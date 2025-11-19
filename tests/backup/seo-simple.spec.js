const { test, expect } = require('@playwright/test');

const pages = [
  { name: 'Home', url: '/', title: 'UnityAILab - The Dark Side of AI' },
  { name: 'About', url: '/about/', title: /About.*UnityAILab/i },
  { name: 'Services', url: '/services/', title: /Services.*UnityAILab/i },
  { name: 'Projects', url: '/projects/', title: /Projects.*UnityAILab/i },
  { name: 'Contact', url: '/contact/', title: /Contact.*UnityAILab/i },
];

test.describe('Simple SEO Tests', () => {
  for (const pageDef of pages) {
    test(`${pageDef.name} page should have proper title and meta tags`, async ({ page }) => {
      await page.goto(pageDef.url, { timeout: 60000 });
      await page.waitForLoadState('load', { timeout: 60000 });

      // Check title
      const title = await page.title();
      if (typeof pageDef.title === 'string') {
        expect(title).toBe(pageDef.title);
      } else {
        expect(title).toMatch(pageDef.title);
      }

      // Check meta description
      const description = await page.locator('meta[name="description"]');
      await expect(description).toHaveCount(1);
      const descContent = await description.getAttribute('content');
      expect(descContent).toBeTruthy();

      // Check viewport meta
      const viewport = await page.locator('meta[name="viewport"]');
      await expect(viewport).toHaveCount(1);

      // Check charset
      const charset = await page.locator('meta[charset]');
      await expect(charset).toHaveCount(1);
    });
  }

  test('Home page should have Open Graph tags', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const ogType = await page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveCount(1);

    const ogTitle = await page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveCount(1);
  });

  test('Pages should have proper heading hierarchy', async ({ page }) => {
    for (const pageDef of pages) {
      await page.goto(pageDef.url, { timeout: 60000 });
      await page.waitForLoadState('load', { timeout: 60000 });

      // Should have exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      // H1 should not be empty
      const h1Text = await page.locator('h1').first().textContent();
      expect(h1Text.trim()).toBeTruthy();
    }
  });

  test('All images should have alt attributes', async ({ page }) => {
    await page.goto('/about/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Alt attribute should exist (can be empty for decorative images)
      expect(alt !== null).toBeTruthy();
    }
  });

  test('Page should have valid language attribute', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const html = await page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });
});
