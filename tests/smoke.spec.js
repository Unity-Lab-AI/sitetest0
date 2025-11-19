const { test, expect } = require('@playwright/test');

// Smoke tests - Basic flow through the website
test.describe('Website Smoke Tests', () => {
  test('Complete user flow through all pages', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    let h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Verify JavaScript loaded (check for AOS or feature cards)
    const featureCards = page.locator('.feature-card');
    expect(await featureCards.count()).toBeGreaterThan(0);

    // Scroll down to trigger scroll effects
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    // Navigate to About page
    await page.click('.navbar-nav .nav-link:has-text("About")');
    await page.waitForURL('**/about/**');
    h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Scroll on About page
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    // Navigate to Services page
    await page.click('.navbar-nav .nav-link:has-text("Services")');
    await page.waitForURL('**/services/**');
    h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Verify service cards loaded
    const serviceCards = page.locator('.service-card, .feature-card');
    expect(await serviceCards.count()).toBeGreaterThan(0);

    // Navigate to Projects page
    await page.click('.navbar-nav .nav-link:has-text("Projects")');
    await page.waitForURL('**/projects/**');
    h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Navigate to Contact page
    await page.click('.navbar-nav .nav-link:has-text("Contact")');
    await page.waitForURL('**/contact/**');
    h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Verify contact form loaded and is interactive
    const form = page.locator('#mainContactForm');
    await expect(form).toBeVisible();

    const nameInput = page.locator('#contactName');
    await nameInput.fill('Test User');
    expect(await nameInput.inputValue()).toBe('Test User');

    // Click submit button to verify it's clickable (form will use mailto)
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Verify footer links exist
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    const githubLink = footer.locator('a[href*="github.com"]');
    await expect(githubLink).toBeVisible();
  });

  test('Mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Find and click navbar toggle
    const navbarToggle = page.locator('.navbar-toggler');
    await expect(navbarToggle).toBeVisible();
    await navbarToggle.click();

    // Wait for menu to open
    await page.waitForTimeout(500);

    // Click a nav link
    const aboutLink = page.locator('.navbar-nav .nav-link:has-text("About")');
    await aboutLink.click();

    await page.waitForURL('**/about/**');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('All pages return 200 status', async ({ page }) => {
    const pages = ['/', '/about/', '/services/', '/projects/', '/contact/'];

    for (const url of pages) {
      const response = await page.goto(url);
      expect(response.status()).toBe(200);
    }
  });

  test('JavaScript loads correctly', async ({ page }) => {
    await page.goto('/');

    // Check that scripts executed by verifying DOM modifications
    // The script.js adds event listeners and initializes AOS
    const hasNavbar = await page.locator('.navbar').count();
    expect(hasNavbar).toBeGreaterThan(0);

    // Check that body has 'loaded' class added by JavaScript
    await page.waitForLoadState('networkidle');
    const bodyClass = await page.locator('body').getAttribute('class');
    expect(bodyClass).toContain('loaded');
  });

  test('Footer appears on all pages', async ({ page }) => {
    const pages = ['/', '/about/', '/services/', '/projects/', '/contact/'];

    for (const url of pages) {
      await page.goto(url);
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      const copyright = footer.locator('.copyright');
      await expect(copyright).toBeVisible();
      expect(await copyright.textContent()).toContain('UnityAILab');
    }
  });
});
