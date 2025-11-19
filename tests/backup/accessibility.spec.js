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
    test(`${page.name} page should not have critical accessibility issues`, async ({ page: playwright }) => {
      await playwright.goto(page.url, { timeout: 60000 });

      // Wait for page to be fully loaded
      await playwright.waitForLoadState('load', { timeout: 60000 });

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

      // Filter only critical and serious violations
      const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );

      expect(criticalViolations).toEqual([]);
    });
  }

  test('Home page should have proper ARIA landmarks', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    // Check for navigation landmark
    const nav = await page.locator('nav[role="navigation"]');
    await expect(nav).toHaveCount(1, { timeout: 10000 });

    // Check for main landmark
    const main = await page.locator('main[role="main"]');
    await expect(main).toHaveCount(1, { timeout: 10000 });

    // Check for contentinfo landmark
    const footer = await page.locator('footer[role="contentinfo"]');
    await expect(footer).toHaveCount(1, { timeout: 10000 });
  });

  test('Forms should have proper labels or aria-labels', async ({ page }) => {
    await page.goto('/contact/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    // Check that all required inputs have some form of labeling
    const inputs = await page.locator('input[required], select[required], textarea[required]').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');

      // Input should have either a label, aria-label, or placeholder
      if (id) {
        const labelCount = await page.locator(`label[for="${id}"]`).count();
        const hasLabel = labelCount > 0 || ariaLabel || placeholder;
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('Skip link should be present and functional', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const skipLink = await page.locator('.skip-link');
    await expect(skipLink).toHaveCount(1, { timeout: 10000 });
    await expect(skipLink).toContainText('Skip to main content');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
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

  test('Interactive elements should have accessible names', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    // Check visible buttons
    const buttons = await page.locator('button:visible').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      const hasAccessibleName = (ariaLabel && ariaLabel.trim()) || (text && text.trim());
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('Color contrast should not have critical issues', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast' && (v.impact === 'critical' || v.impact === 'serious')
    );

    if (contrastViolations.length > 0) {
      console.log('Contrast violations:', contrastViolations);
    }

    expect(contrastViolations).toHaveLength(0);
  });

  test('Navbar toggle should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    const navbarToggle = await page.locator('.navbar-toggler');
    const hasControls = await navbarToggle.getAttribute('aria-controls');
    const hasExpanded = await navbarToggle.getAttribute('aria-expanded');
    const hasLabel = await navbarToggle.getAttribute('aria-label');

    expect(hasControls).toBeTruthy();
    expect(hasExpanded).not.toBeNull();
    expect(hasLabel).toBeTruthy();
  });

  test('Decorative icons should have aria-hidden', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });

    // Check brain icon in navbar
    const brainIcon = await page.locator('.navbar-brand .fa-brain');
    const ariaHidden = await brainIcon.getAttribute('aria-hidden');
    expect(ariaHidden).toBe('true');
  });
});
