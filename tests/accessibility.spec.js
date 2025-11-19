const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const pages = [
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about/' },
  { name: 'Services', url: '/services/' },
  { name: 'Projects', url: '/projects/' },
  { name: 'Contact', url: '/contact/' },
];

test.describe('Accessibility Tests (WCAG 2.1 Level AA)', () => {
  for (const page of pages) {
    test(`${page.name} page should not have any automatically detectable accessibility issues`, async ({ page: playwright }) => {
      await playwright.goto(page.url);

      // Wait for page to be fully loaded
      await playwright.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page: playwright })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Log violations for debugging
      if (accessibilityScanResults.violations.length > 0) {
        console.log(`\n${page.name} page violations:`);
        accessibilityScanResults.violations.forEach(violation => {
          console.log(`  - ${violation.id}: ${violation.description}`);
          console.log(`    Impact: ${violation.impact}`);
          console.log(`    Nodes: ${violation.nodes.length}`);
        });
      }

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  test('Home page should have proper ARIA landmarks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for navigation landmark
    const nav = await page.locator('nav[role="navigation"]');
    await expect(nav).toHaveCount(1);
    await expect(nav).toHaveAttribute('aria-label', 'Main navigation');

    // Check for main landmark
    const main = await page.locator('main[role="main"]');
    await expect(main).toHaveCount(1);

    // Check for contentinfo landmark
    const footer = await page.locator('footer[role="contentinfo"]');
    await expect(footer).toHaveCount(1);
  });

  test('Forms should have proper labels', async ({ page }) => {
    await page.goto('/contact/');
    await page.waitForLoadState('networkidle');

    // Check that all inputs have associated labels
    const inputs = await page.locator('input, select, textarea').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        // Check for associated label
        const label = await page.locator(`label[for="${id}"]`);
        await expect(label).toHaveCount(1);
      }
    }
  });

  test('Skip link should be present and functional', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const skipLink = await page.locator('.skip-link');
    await expect(skipLink).toHaveCount(1);
    await expect(skipLink).toHaveText('Skip to main content');
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    // Test that it's keyboard accessible
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
  });

  test('All images should have alt text', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('Interactive elements should have accessible names', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check buttons
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      expect(ariaLabel || text.trim()).toBeTruthy();
    }

    // Check links
    const links = await page.locator('a').all();
    for (const link of links) {
      const ariaLabel = await link.getAttribute('aria-label');
      const text = await link.textContent();
      const title = await link.getAttribute('title');
      expect(ariaLabel || text.trim() || title).toBeTruthy();
    }
  });

  test('Color contrast should meet WCAG AA standards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('Navbar toggle should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const navbarToggle = await page.locator('.navbar-toggler');
    await expect(navbarToggle).toHaveAttribute('aria-controls', 'navbarNav');
    await expect(navbarToggle).toHaveAttribute('aria-expanded');
    await expect(navbarToggle).toHaveAttribute('aria-label');
  });

  test('Decorative icons should have aria-hidden', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check brain icon in navbar
    const brainIcon = await page.locator('.navbar-brand .fa-brain');
    await expect(brainIcon).toHaveAttribute('aria-hidden', 'true');
  });
});
