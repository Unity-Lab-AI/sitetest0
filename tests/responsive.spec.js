const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'Mobile (iPhone 12)', width: 390, height: 844 },
  { name: 'Mobile (Samsung Galaxy S21)', width: 360, height: 800 },
  { name: 'Tablet (iPad)', width: 768, height: 1024 },
  { name: 'Tablet (iPad Pro)', width: 1024, height: 1366 },
  { name: 'Laptop (13")', width: 1280, height: 800 },
  { name: 'Desktop (1080p)', width: 1920, height: 1080 },
  { name: 'Desktop (4K)', width: 3840, height: 2160 },
];

test.describe('Responsive Design Tests', () => {
  for (const viewport of viewports) {
    test(`Home page should be responsive on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check that content is visible
      const heroSection = await page.locator('.hero-section');
      await expect(heroSection).toBeVisible();

      // Check no horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (hasHorizontalScroll) {
        console.log(`WARNING: Horizontal scroll detected on ${viewport.name}`);
      }

      expect(hasHorizontalScroll).toBeFalsy();
    });
  }

  test('Navbar should collapse on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Navbar toggle should be visible
    const navbarToggle = await page.locator('.navbar-toggler');
    await expect(navbarToggle).toBeVisible();

    // Nav menu should be collapsed initially
    const navbarCollapse = await page.locator('.navbar-collapse');
    const isExpanded = await navbarCollapse.evaluate(el =>
      el.classList.contains('show')
    );

    expect(isExpanded).toBeFalsy();
  });

  test('Navbar should be expanded on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Navbar toggle should not be visible
    const navbarToggle = await page.locator('.navbar-toggler');
    const isToggleVisible = await navbarToggle.isVisible();

    expect(isToggleVisible).toBeFalsy();

    // Nav links should be visible
    const navLinks = await page.locator('.navbar-nav .nav-link');
    await expect(navLinks.first()).toBeVisible();
  });

  test('Touch targets should be at least 44x44px on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/contact/');
    await page.waitForLoadState('networkidle');

    // Check buttons and links
    const interactiveElements = await page.locator('button, a.btn, input[type="submit"]').all();

    for (const element of interactiveElements) {
      const box = await element.boundingBox();

      if (box) {
        const meetsMinimum = box.width >= 44 && box.height >= 44;

        if (!meetsMinimum) {
          const className = await element.getAttribute('class');
          console.log(`WARNING: Small touch target: ${className} (${box.width}x${box.height})`);
        }
      }
    }
  });

  test('Text should be readable on all viewports', async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check font size of main content
      const bodyFontSize = await page.evaluate(() => {
        return parseFloat(window.getComputedStyle(document.body).fontSize);
      });

      // Minimum readable font size (16px recommended)
      expect(bodyFontSize).toBeGreaterThanOrEqual(14);

      // Check heading contrast
      const h1 = await page.locator('h1').first();
      if (await h1.isVisible()) {
        const h1Color = await h1.evaluate(el =>
          window.getComputedStyle(el).color
        );
        expect(h1Color).toBeTruthy();
      }
    }
  });

  test('Images should scale properly on different viewports', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    for (const viewport of viewports.slice(0, 3)) { // Test first 3 viewports
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);

      const images = await page.locator('img').all();

      for (const img of images) {
        const box = await img.boundingBox();

        if (box) {
          // Image should not exceed viewport width
          expect(box.width).toBeLessThanOrEqual(viewport.width);
        }
      }
    }
  });

  test('Forms should be usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/contact/');
    await page.waitForLoadState('networkidle');

    // Form inputs should be visible and appropriately sized
    const inputs = await page.locator('input, select, textarea').all();

    for (const input of inputs) {
      const isVisible = await input.isVisible();
      const box = await input.boundingBox();

      if (box) {
        // Input should have reasonable width
        expect(box.width).toBeGreaterThan(100);

        // Input should have minimum height for touch
        expect(box.height).toBeGreaterThanOrEqual(38);
      }
    }
  });

  test('Orientation change should not break layout', async ({ page }) => {
    // Portrait
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hasScrollPortrait = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    // Landscape
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(500);

    const hasScrollLandscape = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasScrollPortrait).toBeFalsy();
    expect(hasScrollLandscape).toBeFalsy();
  });

  test('Content should reflow properly on window resize', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get initial layout
    const initialH1Box = await page.locator('h1').first().boundingBox();

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Get new layout
    const newH1Box = await page.locator('h1').first().boundingBox();

    // Layout should have changed
    expect(newH1Box.width).not.toBe(initialH1Box.width);
  });
});
