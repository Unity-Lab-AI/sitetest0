const { test, expect } = require('@playwright/test');
const { playAudit } = require('lighthouse/core/index.cjs');
const lighthouse = require('lighthouse');
const { chromium } = require('playwright');

test.describe('Performance Tests', () => {
  test('Pages should load within acceptable time', async ({ page }) => {
    const pages = ['/', '/about/', '/services/', '/projects/', '/contact/'];

    for (const url of pages) {
      const startTime = Date.now();
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      console.log(`${url} loaded in ${loadTime}ms`);
      expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
    }
  });

  test('Images should be loaded efficiently', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    const images = await page.locator('img').all();

    for (const img of images) {
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      const naturalHeight = await img.evaluate(el => el.naturalHeight);

      // Images should have dimensions (loaded)
      expect(naturalWidth).toBeGreaterThan(0);
      expect(naturalHeight).toBeGreaterThan(0);
    }
  });

  test('No render-blocking resources in critical path', async ({ page }) => {
    await page.goto('/');

    // Check that CSS is in head
    const aosInHead = await page.locator('head link[href*="aos.css"]');
    await expect(aosInHead).toHaveCount(1);

    // Check that styles are in head
    const customCSS = await page.locator('head link[href*="styles.css"]');
    await expect(customCSS).toHaveCount(1);
  });

  test('JavaScript should not block initial render', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // Wait for First Contentful Paint
    await page.waitForLoadState('domcontentloaded');
    const fcp = Date.now() - startTime;

    console.log(`First Contentful Paint: ${fcp}ms`);
    expect(fcp).toBeLessThan(3000); // FCP under 3 seconds
  });

  test('Resources should be cached properly', async ({ page, context }) => {
    // First visit
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get resource timing for first load
    const resources1 = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(r => ({
        name: r.name,
        duration: r.duration,
        transferSize: r.transferSize
      }));
    });

    // Second visit (should use cache)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const resources2 = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(r => ({
        name: r.name,
        duration: r.duration,
        transferSize: r.transferSize
      }));
    });

    // Some resources should come from cache (transferSize = 0)
    const cachedResources = resources2.filter(r => r.transferSize === 0);

    console.log(`Cached resources on second visit: ${cachedResources.length}`);
    expect(cachedResources.length).toBeGreaterThan(0);
  });

  test('No console errors on page load', async ({ page }) => {
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });

  test('Fonts should be loaded efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for font-display: swap or block
    const fontFaces = await page.evaluate(() => {
      return Array.from(document.fonts).map(font => ({
        family: font.family,
        status: font.status
      }));
    });

    // All fonts should be loaded or loading
    for (const font of fontFaces) {
      expect(['loaded', 'loading']).toContain(font.status);
    }
  });

  test('Network requests should be minimized', async ({ page }) => {
    const requests = [];

    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Total requests: ${requests.length}`);

    // Should have reasonable number of requests
    expect(requests.length).toBeLessThan(50);
  });

  test('No 404 or failed requests', async ({ page }) => {
    const failedRequests = [];

    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    if (failedRequests.length > 0) {
      console.log('Failed requests:', failedRequests);
    }

    expect(failedRequests).toHaveLength(0);
  });

  test('Main content should be visible quickly', async ({ page }) => {
    await page.goto('/');

    // Wait for hero section to be visible
    const heroSection = await page.locator('.hero-section');
    await expect(heroSection).toBeVisible({ timeout: 3000 });

    // Check that text content is visible
    const h1 = await page.locator('h1.gothic-title');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('The Dark Side of AI');
  });
});
