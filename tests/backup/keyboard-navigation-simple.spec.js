const { test, expect } = require('@playwright/test');

test.describe('Simple Keyboard Navigation Tests', () => {
  test('Page should be keyboard accessible', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    // Tab through a few elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to navigate without errors
    const activeElement = await page.evaluate(() => document.activeElement.tagName);
    expect(activeElement).toBeTruthy();
  });

  test('Navigation links should be keyboard accessible', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const navLinks = await page.locator('.navbar-nav .nav-link').all();
    expect(navLinks.length).toBeGreaterThan(0);

    // Focus on first nav link
    await navLinks[0].focus();
    const focused = await navLinks[0].evaluate(el => document.activeElement === el);
    expect(focused).toBeTruthy();
  });

  test('Form inputs should be focusable', async ({ page }) => {
    await page.goto('/contact/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const nameInput = await page.locator('#contactName');
    await nameInput.focus();

    const isFocused = await nameInput.evaluate(el => document.activeElement === el);
    expect(isFocused).toBeTruthy();
  });

  test('Navbar toggle should be keyboard accessible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const toggle = await page.locator('.navbar-toggler');
    await toggle.focus();

    const isFocused = await toggle.evaluate(el => document.activeElement === el);
    expect(isFocused).toBeTruthy();
  });

  test('Submit button should be keyboard accessible', async ({ page }) => {
    await page.goto('/contact/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const submitButton = await page.locator('button[type="submit"]');
    await submitButton.focus();

    const isFocused = await submitButton.evaluate(el => document.activeElement === el);
    expect(isFocused).toBeTruthy();
  });
});
