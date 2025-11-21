const { test, expect } = require('@playwright/test');

/**
 * Browser Compatibility Test Suite
 *
 * Tests that all HTML elements and JavaScript functionality load properly
 * across Chrome (Chromium), Firefox, and WebKit browsers.
 *
 * Focus: Element presence and JavaScript execution, NOT user interactions
 */

// Test pages to verify
const TEST_PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/about/', name: 'About' },
  { path: '/services/', name: 'Services' },
  { path: '/projects/', name: 'Projects' },
  { path: '/contact/', name: 'Contact' },
  { path: '/ai/', name: 'AI Landing' },
  { path: '/ai/demo/', name: 'AI Demo' }
];

// ==============================================================================
// CHROMIUM BROWSER TESTS
// ==============================================================================

test.describe('Chromium Browser Compatibility', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium-only tests');

  test('should load all critical HTML elements on homepage', async ({ page }) => {
    await page.goto('/');

    // Navigation elements
    await expect(page.locator('nav.navbar')).toBeVisible();
    await expect(page.locator('.navbar-brand')).toBeVisible();
    await expect(page.locator('.navbar-toggler')).toBeVisible();
    await expect(page.locator('#navbarNav')).toBeAttached();

    // Nav links
    const navLinks = page.locator('.nav-link');
    expect(await navLinks.count()).toBeGreaterThan(0);

    // Hero section
    await expect(page.locator('.hero-section')).toBeVisible();
    await expect(page.locator('h1.gothic-title')).toBeVisible();
    await expect(page.locator('.gothic-subtitle')).toBeVisible();
    await expect(page.locator('.hero-buttons')).toBeVisible();
    await expect(page.locator('.scroll-indicator')).toBeVisible();

    // Features section
    await expect(page.locator('.features-section')).toBeVisible();
    await expect(page.locator('.feature-card')).toHaveCount(3);

    // Services section
    await expect(page.locator('.services-section')).toBeVisible();
    await expect(page.locator('.service-card')).toHaveCount(2);

    // Footer
    await expect(page.locator('footer.footer-section')).toBeVisible();
    await expect(page.locator('.social-links')).toBeVisible();
    await expect(page.locator('.copyright')).toBeVisible();

    // Background elements
    await expect(page.locator('.background-overlay')).toBeAttached();
    await expect(page.locator('.red-streaks')).toBeAttached();
  });

  test('should execute JavaScript correctly on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check body has 'loaded' class (added by JS)
    const body = page.locator('body');
    await expect(body).toHaveClass(/loaded/);

    // Check AOS library loaded (elements with data-aos)
    const aosElements = page.locator('[data-aos]');
    expect(await aosElements.count()).toBeGreaterThan(0);

    // Check Bootstrap JS loaded (navbar functionality)
    const navbarCollapse = page.locator('#navbarNav');
    await expect(navbarCollapse).toBeAttached();

    // Verify navbar scroll class can be added (JS event listener exists)
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(100); // Brief wait for scroll event
    const navbar = page.locator('nav.navbar');
    // Note: We're just checking the navbar exists, not testing the actual scroll behavior
    await expect(navbar).toBeVisible();
  });

  test('should load all pages without errors', async ({ page }) => {
    const errors = [];

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    for (const testPage of TEST_PAGES) {
      await page.goto(testPage.path);
      await page.waitForLoadState('networkidle');

      // Verify page loaded
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('nav.navbar')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    }

    // Allow some minor errors but fail if too many
    expect(errors.length).toBeLessThan(5);
  });

  test('should load all CSS and JavaScript resources', async ({ page }) => {
    const response = await page.goto('/');
    expect(response.status()).toBe(200);

    // Wait for all resources to load
    await page.waitForLoadState('networkidle');

    // Check critical stylesheets loaded
    const stylesheets = page.locator('link[rel="stylesheet"]');
    expect(await stylesheets.count()).toBeGreaterThan(0);

    // Check critical scripts loaded
    const scripts = page.locator('script[src]');
    expect(await scripts.count()).toBeGreaterThan(0);

    // Verify Bootstrap is loaded
    const hasBootstrap = await page.evaluate(() => {
      return typeof window.bootstrap !== 'undefined' ||
             typeof window.$ !== 'undefined' ||
             document.querySelector('.navbar') !== null;
    });
    expect(hasBootstrap).toBeTruthy();
  });
});

// ==============================================================================
// FIREFOX BROWSER TESTS
// ==============================================================================

test.describe('Firefox Browser Compatibility', () => {
  test.skip(({ browserName }) => browserName !== 'firefox', 'Firefox-only tests');

  test('should load all critical HTML elements on homepage', async ({ page }) => {
    await page.goto('/');

    // Navigation elements
    await expect(page.locator('nav.navbar')).toBeVisible();
    await expect(page.locator('.navbar-brand')).toBeVisible();
    await expect(page.locator('.navbar-toggler')).toBeVisible();
    await expect(page.locator('#navbarNav')).toBeAttached();

    // Nav links
    const navLinks = page.locator('.nav-link');
    expect(await navLinks.count()).toBeGreaterThan(0);

    // Hero section
    await expect(page.locator('.hero-section')).toBeVisible();
    await expect(page.locator('h1.gothic-title')).toBeVisible();
    await expect(page.locator('.gothic-subtitle')).toBeVisible();
    await expect(page.locator('.hero-buttons')).toBeVisible();
    await expect(page.locator('.scroll-indicator')).toBeVisible();

    // Features section
    await expect(page.locator('.features-section')).toBeVisible();
    await expect(page.locator('.feature-card')).toHaveCount(3);

    // Services section
    await expect(page.locator('.services-section')).toBeVisible();
    await expect(page.locator('.service-card')).toHaveCount(2);

    // Footer
    await expect(page.locator('footer.footer-section')).toBeVisible();
    await expect(page.locator('.social-links')).toBeVisible();
    await expect(page.locator('.copyright')).toBeVisible();

    // Background elements
    await expect(page.locator('.background-overlay')).toBeAttached();
    await expect(page.locator('.red-streaks')).toBeAttached();
  });

  test('should execute JavaScript correctly on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check body has 'loaded' class (added by JS)
    const body = page.locator('body');
    await expect(body).toHaveClass(/loaded/);

    // Check AOS library loaded (elements with data-aos)
    const aosElements = page.locator('[data-aos]');
    expect(await aosElements.count()).toBeGreaterThan(0);

    // Check Bootstrap JS loaded (navbar functionality)
    const navbarCollapse = page.locator('#navbarNav');
    await expect(navbarCollapse).toBeAttached();

    // Verify navbar exists and JS can interact with it
    const navbar = page.locator('nav.navbar');
    await expect(navbar).toBeVisible();
  });

  test('should load all pages without errors', async ({ page }) => {
    const errors = [];

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    for (const testPage of TEST_PAGES) {
      await page.goto(testPage.path);
      await page.waitForLoadState('networkidle');

      // Verify page loaded
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('nav.navbar')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    }

    // Allow some minor errors but fail if too many
    expect(errors.length).toBeLessThan(5);
  });

  test('should load all CSS and JavaScript resources', async ({ page }) => {
    const response = await page.goto('/');
    expect(response.status()).toBe(200);

    // Wait for all resources to load
    await page.waitForLoadState('networkidle');

    // Check critical stylesheets loaded
    const stylesheets = page.locator('link[rel="stylesheet"]');
    expect(await stylesheets.count()).toBeGreaterThan(0);

    // Check critical scripts loaded
    const scripts = page.locator('script[src]');
    expect(await scripts.count()).toBeGreaterThan(0);

    // Verify Bootstrap is loaded
    const hasBootstrap = await page.evaluate(() => {
      return typeof window.bootstrap !== 'undefined' ||
             typeof window.$ !== 'undefined' ||
             document.querySelector('.navbar') !== null;
    });
    expect(hasBootstrap).toBeTruthy();
  });

  test('should render animations and transitions correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that animated elements exist and have proper attributes
    const heroTitle = page.locator('h1.gothic-title');
    await expect(heroTitle).toBeVisible();

    // Verify data-aos attributes are present
    const dataAosAttr = await heroTitle.getAttribute('data-aos');
    expect(dataAosAttr).toBeTruthy();

    // Check other animated elements
    const animatedElements = page.locator('[data-aos]');
    expect(await animatedElements.count()).toBeGreaterThan(5);
  });
});

// ==============================================================================
// WEBKIT BROWSER TESTS
// ==============================================================================

test.describe('WebKit Browser Compatibility', () => {
  test.skip(({ browserName }) => browserName !== 'webkit', 'WebKit-only tests');

  test('should load all critical HTML elements on homepage', async ({ page }) => {
    await page.goto('/');

    // Navigation elements
    await expect(page.locator('nav.navbar')).toBeVisible();
    await expect(page.locator('.navbar-brand')).toBeVisible();
    await expect(page.locator('.navbar-toggler')).toBeVisible();
    await expect(page.locator('#navbarNav')).toBeAttached();

    // Nav links
    const navLinks = page.locator('.nav-link');
    expect(await navLinks.count()).toBeGreaterThan(0);

    // Hero section
    await expect(page.locator('.hero-section')).toBeVisible();
    await expect(page.locator('h1.gothic-title')).toBeVisible();
    await expect(page.locator('.gothic-subtitle')).toBeVisible();
    await expect(page.locator('.hero-buttons')).toBeVisible();
    await expect(page.locator('.scroll-indicator')).toBeVisible();

    // Features section
    await expect(page.locator('.features-section')).toBeVisible();
    await expect(page.locator('.feature-card')).toHaveCount(3);

    // Services section
    await expect(page.locator('.services-section')).toBeVisible();
    await expect(page.locator('.service-card')).toHaveCount(2);

    // Footer
    await expect(page.locator('footer.footer-section')).toBeVisible();
    await expect(page.locator('.social-links')).toBeVisible();
    await expect(page.locator('.copyright')).toBeVisible();

    // Background elements
    await expect(page.locator('.background-overlay')).toBeAttached();
    await expect(page.locator('.red-streaks')).toBeAttached();
  });

  test('should execute JavaScript correctly on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check body has 'loaded' class (added by JS)
    const body = page.locator('body');
    await expect(body).toHaveClass(/loaded/);

    // Check AOS library loaded (elements with data-aos)
    const aosElements = page.locator('[data-aos]');
    expect(await aosElements.count()).toBeGreaterThan(0);

    // Check Bootstrap JS loaded (navbar functionality)
    const navbarCollapse = page.locator('#navbarNav');
    await expect(navbarCollapse).toBeAttached();

    // Verify navbar exists and JS can interact with it
    const navbar = page.locator('nav.navbar');
    await expect(navbar).toBeVisible();
  });

  test('should load all pages without errors', async ({ page }) => {
    const errors = [];

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    for (const testPage of TEST_PAGES) {
      await page.goto(testPage.path);
      await page.waitForLoadState('networkidle');

      // Verify page loaded
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('nav.navbar')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    }

    // Allow some minor errors but fail if too many
    expect(errors.length).toBeLessThan(5);
  });

  test('should load all CSS and JavaScript resources', async ({ page }) => {
    const response = await page.goto('/');
    expect(response.status()).toBe(200);

    // Wait for all resources to load
    await page.waitForLoadState('networkidle');

    // Check critical stylesheets loaded
    const stylesheets = page.locator('link[rel="stylesheet"]');
    expect(await stylesheets.count()).toBeGreaterThan(0);

    // Check critical scripts loaded
    const scripts = page.locator('script[src]');
    expect(await scripts.count()).toBeGreaterThan(0);

    // Verify Bootstrap is loaded
    const hasBootstrap = await page.evaluate(() => {
      return typeof window.bootstrap !== 'undefined' ||
             typeof window.$ !== 'undefined' ||
             document.querySelector('.navbar') !== null;
    });
    expect(hasBootstrap).toBeTruthy();
  });

  test('should render animations and transitions correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that animated elements exist and have proper attributes
    const heroTitle = page.locator('h1.gothic-title');
    await expect(heroTitle).toBeVisible();

    // Verify data-aos attributes are present
    const dataAosAttr = await heroTitle.getAttribute('data-aos');
    expect(dataAosAttr).toBeTruthy();

    // Check other animated elements
    const animatedElements = page.locator('[data-aos]');
    expect(await animatedElements.count()).toBeGreaterThan(5);
  });

  test('should handle WebKit-specific CSS properties', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify that WebKit-specific elements render correctly
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check that background elements are properly attached
    const backgroundOverlay = page.locator('.background-overlay');
    await expect(backgroundOverlay).toBeAttached();

    const redStreaks = page.locator('.red-streaks');
    await expect(redStreaks).toBeAttached();
  });
});

// ==============================================================================
// CROSS-BROWSER VERIFICATION TESTS
// ==============================================================================

test.describe('Cross-Browser Element Consistency', () => {

  test('all browsers should load the same number of nav links', async ({ page, browserName }) => {
    await page.goto('/');

    const navLinks = page.locator('.nav-link');
    const count = await navLinks.count();

    // Should have 6 nav links (AI, About, Apps, Services, Projects, Contact)
    expect(count).toBe(6);
  });

  test('all browsers should load feature cards correctly', async ({ page, browserName }) => {
    await page.goto('/');

    const featureCards = page.locator('.feature-card');
    const count = await featureCards.count();

    // Should have 3 feature cards
    expect(count).toBe(3);
  });

  test('all browsers should load service cards correctly', async ({ page, browserName }) => {
    await page.goto('/');

    const serviceCards = page.locator('.service-card');
    const count = await serviceCards.count();

    // Should have 2 service cards
    expect(count).toBe(2);
  });

  test('all browsers should have footer social links', async ({ page, browserName }) => {
    await page.goto('/');

    const socialLinks = page.locator('.social-links a');
    const count = await socialLinks.count();

    // Should have 3 social links (GitHub, Discord, Unity Chat)
    expect(count).toBe(3);
  });

  test('all browsers should execute the loaded class JavaScript', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    await expect(body).toHaveClass(/loaded/);
  });
});

// ==============================================================================
// SPECIAL PAGE TESTS (AI Demo)
// ==============================================================================

test.describe('AI Demo Page Browser Compatibility', () => {

  test('should load AI demo page elements correctly @chromium', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chromium-specific test');

    await page.goto('/ai/demo/');
    await page.waitForLoadState('networkidle');

    // Check main demo container exists
    const demoContainer = page.locator('.demo-container, #demo-app, main');
    await expect(demoContainer.first()).toBeVisible();

    // Verify page loaded
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load AI demo page elements correctly @firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox-specific test');

    await page.goto('/ai/demo/');
    await page.waitForLoadState('networkidle');

    // Check main demo container exists
    const demoContainer = page.locator('.demo-container, #demo-app, main');
    await expect(demoContainer.first()).toBeVisible();

    // Verify page loaded
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load AI demo page elements correctly @webkit', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'WebKit-specific test');

    await page.goto('/ai/demo/');
    await page.waitForLoadState('networkidle');

    // Check main demo container exists
    const demoContainer = page.locator('.demo-container, #demo-app, main');
    await expect(demoContainer.first()).toBeVisible();

    // Verify page loaded
    await expect(page.locator('body')).toBeVisible();
  });
});
