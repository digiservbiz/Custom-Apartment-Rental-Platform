from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:3000/login")
        expect(page.get_by_label("Email Address")).to_be_visible(timeout=10000)
        page.screenshot(path="jules-scratch/verification/login_page_loads.png")
        print("Login page loaded successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
        raise

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
