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
        # Wait for navigation to a page that confirms login, like the homepage or a dashboard.
        # Let's assume it redirects to the homepage which has the main heading "Find Your Perfect Apartment".
        expect(page.get_by_role("heading", name=re.compile("Find Your Perfect Apartment", re.IGNORECASE))).to_be_visible(timeout=10000)

        # 2. Create the test apartments
        apartments_to_create = [
            {
                "address": "123 Main St, Anytown, USA", "photos": "photo1.jpg", "price": "150", "guests": "4",
                "description": "A test location", "amenities": ["parking"]
            },
            {
                "address": "456 Oak Ave, Sometown, USA", "photos": "photo2.jpg", "price": "100", "guests": "2",
                "description": "A cheap place", "amenities": ["wifi", "kitchen"]
            },
            {
                "address": "789 Pine Ln, Otherville, USA", "photos": "photo3.jpg", "price": "300", "guests": "6",
                "description": "A luxury villa", "amenities": ["wifi", "pool"]
            }
        ]

        # Use a consistent name from the created apartments for later lookup
        # This is better than relying on the generic "Test Location"
        cheap_place_address = "456 Oak Ave, Sometown, USA"
        test_location_address = "123 Main St, Anytown, USA"
        luxury_villa_address = "789 Pine Ln, Otherville, USA"


        for apartment in apartments_to_create:
            page.goto("http://localhost:3000/create-apartment")
            page.get_by_label("Address").fill(apartment["address"])
            page.get_by_label("Photos (comma-separated URLs)").fill(apartment["photos"])
            page.get_by_label("Price Per Night").fill(apartment["price"])
            page.get_by_label("Max Guests").fill(apartment["guests"])
            page.get_by_label("Description").fill(apartment["description"])
            page.get_by_label("Amenities (comma-separated)").fill(",".join(apartment["amenities"]))
            page.get_by_role("button", name="Create Apartment").click()
            # Wait for the success message to appear
            expect(page.get_by_text("Apartment created successfully!")).to_be_visible()

        # 3. Navigate to apartment list and test filters
        page.goto("http://localhost:3000/apartments")
        expect(page.get_by_role("heading", name="Apartments")).to_be_visible()

        # Check that all apartments are visible initially
        expect(page.get_by_text(test_location_address)).to_be_visible()
        expect(page.get_by_text(cheap_place_address)).to_be_visible()
        expect(page.get_by_text(luxury_villa_address)).to_be_visible()

        # Apply filters to find only the "Cheap Place"
        page.get_by_label("Max Price Per Night").fill("150")
        page.get_by_label("Min. Guests").fill("2")
        page.get_by_label("Wifi").check()
        page.get_by_label("Kitchen").check()

        # After filtering, only 'Cheap Place' should be visible.
        # The debounce in the component is 500ms, so we'll wait a bit longer.
        expect(page.get_by_text(test_location_address)).not_to_be_visible(timeout=2000)
        expect(page.get_by_text(luxury_villa_address)).not_to_be_visible()
        expect(page.get_by_text(cheap_place_address)).to_be_visible()

        # Check that there is only one apartment card shown
        # We target the card by looking for its unique address text
        expect(page.locator(".card")).to_have_count(1)
        expect(page.locator(".card-text", text=cheap_place_address)).to_be_visible()

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
