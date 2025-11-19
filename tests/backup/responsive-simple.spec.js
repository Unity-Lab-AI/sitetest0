const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 },
];

test.describe('Simple Responsive Design Tests', () => {
  for (const viewport of viewports) {
    test(`Home page should load on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/', { timeout: 60000 });
      await page.waitForLoadState('load', { timeout: 60000 });

      const h1 = await page.locator('h1').first();
      await expect(h1).toBeVisible({ timeout: 15000 });
    });
  }

  test('Navbar should collapse on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const navbarToggle = await page.locator('.navbar-toggler');
    await expect(navbarToggle).toBeVisible({ timeout: 10000 });
  });

  test('Navbar should be expanded on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const navLinks = await page.locator('.navbar-nav .nav-link').first();
    await expect(navLinks).toBeVisible({ timeout: 10000 });
  });

  test('Content should be visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const hero = await page.locator('.hero-section');
    await expect(hero).toBeVisible({ timeout: 15000 });
  });

  test('Forms should be usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/contact/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const nameInput = await page.locator('#contactName');
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    const box = await nameInput.boundingBox();
    expect(box).toBeTruthy();
    expect(box.width).toBeGreaterThan(100);
  });
});
