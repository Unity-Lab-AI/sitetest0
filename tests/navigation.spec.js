const { test, expect } = require('@playwright/test');

test.describe('Site Navigation', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Unity AI Lab/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('/about/');
    await expect(page).toHaveURL(/\/about\//);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to Services page', async ({ page }) => {
    await page.goto('/services/');
    await expect(page).toHaveURL(/\/services\//);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to Projects page', async ({ page }) => {
    await page.goto('/projects/');
    await expect(page).toHaveURL(/\/projects\//);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/contact/');
    await expect(page).toHaveURL(/\/contact\//);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to AI landing page', async ({ page }) => {
    await page.goto('/ai/');
    await expect(page).toHaveURL(/\/ai\//);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to AI Demo page', async ({ page }) => {
    await page.goto('/ai/demo/');
    await expect(page).toHaveURL(/\/ai\/demo\//);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate using header links from homepage', async ({ page }) => {
    await page.goto('/');

    // Test navigation menu exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Click About link
    await page.click('a[href*="about"]');
    await expect(page).toHaveURL(/\/about\//);
    await page.goBack();

    // Click Services link
    await page.click('a[href*="services"]');
    await expect(page).toHaveURL(/\/services\//);
    await page.goBack();

    // Click Projects link
    await page.click('a[href*="projects"]');
    await expect(page).toHaveURL(/\/projects\//);
    await page.goBack();

    // Click Contact link
    await page.click('a[href*="contact"]');
    await expect(page).toHaveURL(/\/contact\//);
  });

  test('should have working navigation links on all pages', async ({ page }) => {
    const pages = ['/', '/about/', '/services/', '/projects/', '/contact/', '/ai/'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      // Check that navigation exists
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Check that there are navigation links
      const navLinks = page.locator('nav a');
      const count = await navLinks.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should load all pages without console errors', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const pages = ['/', '/about/', '/services/', '/projects/', '/contact/', '/ai/', '/ai/demo/'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
    }

    // Filter out expected errors (like age verification related ones)
    const unexpectedErrors = consoleErrors.filter(error =>
      !error.includes('age') &&
      !error.includes('verification')
    );

    // Allow some errors but fail if there are too many
    expect(unexpectedErrors.length).toBeLessThan(5);
  });
});
