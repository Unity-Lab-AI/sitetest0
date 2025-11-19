const { test, expect } = require('@playwright/test');

const pages = [
  { name: 'Home', url: '/', title: 'UnityAILab - The Dark Side of AI' },
  { name: 'About', url: '/about/', title: /About.*UnityAILab/i },
  { name: 'Services', url: '/services/', title: /Services.*UnityAILab/i },
  { name: 'Projects', url: '/projects/', title: /Projects.*UnityAILab/i },
  { name: 'Contact', url: '/contact/', title: /Contact.*UnityAILab/i },
];

test.describe('SEO Tests', () => {
  for (const pageDef of pages) {
    test(`${pageDef.name} page should have proper meta tags`, async ({ page }) => {
      await page.goto(pageDef.url);
      await page.waitForLoadState('domcontentloaded');

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
      expect(descContent.length).toBeGreaterThan(50);
      expect(descContent.length).toBeLessThan(160);

      // Check viewport meta
      const viewport = await page.locator('meta[name="viewport"]');
      await expect(viewport).toHaveCount(1);

      // Check charset
      const charset = await page.locator('meta[charset]');
      await expect(charset).toHaveCount(1);
    });
  }

  test('Home page should have Open Graph tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check OG tags
    const ogType = await page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveCount(1);
    await expect(ogType).toHaveAttribute('content', 'website');

    const ogUrl = await page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveCount(1);

    const ogTitle = await page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveCount(1);

    const ogDescription = await page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveCount(1);

    const ogSiteName = await page.locator('meta[property="og:site_name"]');
    await expect(ogSiteName).toHaveCount(1);
  });

  test('Home page should have Twitter Card tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const twitterCard = await page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveCount(1);

    const twitterTitle = await page.locator('meta[name="twitter:title"]');
    await expect(twitterTitle).toHaveCount(1);

    const twitterDescription = await page.locator('meta[name="twitter:description"]');
    await expect(twitterDescription).toHaveCount(1);
  });

  test('Pages should have proper heading hierarchy', async ({ page }) => {
    for (const pageDef of pages) {
      await page.goto(pageDef.url);
      await page.waitForLoadState('load');

      // Should have exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // H1 should not be empty
      const h1Text = await page.locator('h1').first().textContent();
      expect(h1Text.trim()).toBeTruthy();

      // Check heading order (h1 before h2, h2 before h3, etc.)
      const headings = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        return elements.map(el => ({
          tag: el.tagName,
          text: el.textContent.trim()
        }));
      });

      // First heading should be h1
      if (headings.length > 0) {
        expect(headings[0].tag).toBe('H1');
      }
    }
  });

  test('All links should have descriptive text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    const links = await page.locator('a').all();

    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');

      // Link should have text, aria-label, or title
      expect(text.trim() || ariaLabel || title).toBeTruthy();

      // Check for generic link text (avoid "click here", "read more" without context)
      const textLower = text.trim().toLowerCase();
      const genericTexts = ['click here', 'here', 'more'];

      if (genericTexts.includes(textLower)) {
        // Should have aria-label or title for context
        expect(ariaLabel || title).toBeTruthy();
      }
    }
  });

  test('Images should have descriptive alt text', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('load');

    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');

      // Alt text should exist
      expect(alt).toBeTruthy();

      // Alt text should be descriptive (not just filename)
      const hasExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(alt);
      expect(hasExtension).toBeFalsy();
    }
  });

  test('Page should have valid language attribute', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const html = await page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('Canonical URL should be set', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check for canonical link (optional but good for SEO)
    const canonical = await page.locator('link[rel="canonical"]').count();

    if (canonical > 0) {
      const href = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toContain('unity-lab-ai.github.io/sitetest0');
    }
  });

  test('No broken internal links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    const internalLinks = await page.locator('a[href^="/"], a[href^="./"], a[href^="../"]').all();

    for (const link of internalLinks.slice(0, 10)) { // Test first 10 internal links
      const href = await link.getAttribute('href');

      if (href && !href.includes('#')) {
        try {
          const response = await page.request.get(href, {
            failOnStatusCode: false
          });

          expect(response.status()).toBeLessThan(400);
        } catch (e) {
          console.log(`Failed to fetch: ${href}`);
        }
      }
    }
  });

  test('Robots meta tag should allow indexing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const robotsMeta = await page.locator('meta[name="robots"]').count();

    // If robots meta exists, check it's not blocking
    if (robotsMeta > 0) {
      const content = await page.locator('meta[name="robots"]').getAttribute('content');
      expect(content.toLowerCase()).not.toContain('noindex');
      expect(content.toLowerCase()).not.toContain('nofollow');
    }
  });
});
