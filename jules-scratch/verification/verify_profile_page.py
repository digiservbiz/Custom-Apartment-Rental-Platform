from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:3000/login")
    page.get_by_label("Email Address").click()
    page.get_by_label("Email Address").fill("test@example.com")
    page.get_by_label("Password").click()
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Login").click()
    page.wait_for_url("http://localhost:3000/")
    page.goto("http://localhost:3000/profile")
    page.get_by_label("Bio").click()
    page.get_by_label("Bio").fill("This is my bio.")
    page.get_by_label("Profile Picture URL").click()
    page.get_by_label("Profile Picture URL").fill("https://i.imgur.com/6VBx3io.png")
    page.get_by_role("button", name="Save Changes").click()
    expect(page.get_by_text("Profile updated successfully!")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/profile-page.png")

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
