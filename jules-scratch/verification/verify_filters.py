import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # 1. Login as an owner
        page.goto("http://localhost:3000/login")
        page.get_by_label("Email Address").fill("owner@example.com")
        page.get_by_label("Password").fill("password123")
        page.get_by_role("button", name="Sign In").click()
        expect(page.get_by_role("heading", name="Welcome to Your Dashboard")).to_be_visible(timeout=10000)

        # 2. Create the test apartments
        apartments_to_create = [
            {
                "location": "Test Location", "photos": "photo1.jpg", "price": "150", "guests": "4",
                "description": "A test location", "amenities": ["parking"]
            },
            {
                "location": "Cheap Place", "photos": "photo2.jpg", "price": "100", "guests": "2",
                "description": "A cheap place", "amenities": ["wifi", "kitchen"]
            },
            {
                "location": "Luxury Villa", "photos": "photo3.jpg", "price": "300", "guests": "6",
                "description": "A luxury villa", "amenities": ["wifi", "pool"]
            }
        ]

        for apartment in apartments_to_create:
            page.goto("http://localhost:3000/create-apartment")
            page.get_by_label("Location").fill(apartment["location"])
            page.get_by_label("Photos (comma-separated URLs)").fill(apartment["photos"])
            page.get_by_label("Price Per Night").fill(apartment["price"])
            page.get_by_label("Max Guests").fill(apartment["guests"])
            page.get_by_label("Description").fill(apartment["description"])
            page.get_by_label("Amenities (comma-separated)").fill(",".join(apartment["amenities"]))
            page.get_by_role("button", name="Create Apartment").click()
            expect(page.get_by_role("heading", name="My Apartments")).to_be_visible()

        # 3. Navigate to apartment list and test filters
        page.goto("http://localhost:3000/apartments")
        expect(page.get_by_role("heading", name="Apartments")).to_be_visible()

        # Check that all apartments are visible initially
        expect(page.get_by_text("Test Location")).to_be_visible()
        expect(page.get_by_text("Cheap Place")).to_be_visible()
        expect(page.get_by_text("Luxury Villa")).to_be_visible()

        # Apply filters
        page.get_by_label("Max Price Per Night").fill("200")
        page.get_by_label("Min. Guests").fill("2")
        page.get_by_label("Wifi").check()

        # After filtering, only 'Cheap Place' should be visible.
        expect(page.get_by_text("Test Location")).not_to_be_visible(timeout=2000)
        expect(page.get_by_text("Luxury Villa")).not_to_be_visible()
        expect(page.get_by_text("Cheap Place")).to_be_visible()

        # Check that there is only one apartment card shown
        apartment_cards = page.locator('.card-title', text="Cheap Place")
        expect(apartment_cards).to_have_count(1)

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")
        print("Screenshot taken successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
        raise

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
