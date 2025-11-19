const { test, expect } = require('@playwright/test');

const pages = [
  { name: 'Home', url: '/', h1: 'The Dark Side of AI' },
  { name: 'About', url: '/about/', h1: 'About UnityAILab' },
  { name: 'Services', url: '/services/', h1: /Services/i },
  { name: 'Projects', url: '/projects/', h1: /Projects/i },
  { name: 'Contact', url: '/contact/', h1: 'Contact Us' },
];

test.describe('Basic Page Functionality', () => {
  for (const pageDef of pages) {
    test(`${pageDef.name} page should load successfully`, async ({ page }) => {
      const response = await page.goto(pageDef.url, { waitUntil: 'domcontentloaded' });
      expect(response.status()).toBe(200);
    });

    test(`${pageDef.name} page should have correct title`, async ({ page }) => {
      await page.goto(pageDef.url, { waitUntil: 'domcontentloaded' });
      const title = await page.title();
      expect(title).toContain('UnityAILab');
    });

    test(`${pageDef.name} page should have main heading`, async ({ page }) => {
      await page.goto(pageDef.url, { waitUntil: 'domcontentloaded' });
      const h1 = await page.locator('h1').first();
      await expect(h1).toBeVisible();

      const h1Text = await h1.textContent();
      if (typeof pageDef.h1 === 'string') {
        expect(h1Text).toContain(pageDef.h1);
      } else {
        expect(h1Text).toMatch(pageDef.h1);
      }
    });

    test(`${pageDef.name} page should have navigation bar`, async ({ page }) => {
      await page.goto(pageDef.url, { waitUntil: 'domcontentloaded' });
      const nav = await page.locator('nav.navbar');
      await expect(nav).toBeVisible();
    });

    test(`${pageDef.name} page should have footer`, async ({ page }) => {
      await page.goto(pageDef.url, { waitUntil: 'domcontentloaded' });
      const footer = await page.locator('footer');
      await expect(footer).toBeVisible();
    });
  }
});

test.describe('Navigation Tests', () => {
  test('Navbar brand logo should link to home', async ({ page }) => {
    await page.goto('/about/');
    await page.locator('.navbar-brand').click();
    await page.waitForURL('/');
    expect(page.url()).toContain('/');
  });

  test('All navigation links should be present', async ({ page }) => {
    await page.goto('/');

    const navLinks = ['AI', 'About', 'Apps', 'Services', 'Projects', 'Contact'];
    for (const linkText of navLinks) {
      const link = await page.locator(`.navbar-nav .nav-link:has-text("${linkText}")`);
      await expect(link).toBeVisible({ timeout: 5000 });
    }
  });

  test('About navigation link works', async ({ page }) => {
    await page.goto('/');
    await page.locator('.navbar-nav .nav-link:has-text("About")').click();
    await page.waitForURL('**/about/**');
    expect(page.url()).toMatch(/\/about/);
  });

  test('Services navigation link works', async ({ page }) => {
    await page.goto('/');
    await page.locator('.navbar-nav .nav-link:has-text("Services")').click();
    await page.waitForURL('**/services/**');
    expect(page.url()).toMatch(/\/services/);
  });

  test('Projects navigation link works', async ({ page }) => {
    await page.goto('/');
    await page.locator('.navbar-nav .nav-link:has-text("Projects")').click();
    await page.waitForURL('**/projects/**');
    expect(page.url()).toMatch(/\/projects/);
  });

  test('Contact navigation link works', async ({ page }) => {
    await page.goto('/');
    await page.locator('.navbar-nav .nav-link:has-text("Contact")').click();
    await page.waitForURL('**/contact/**');
    expect(page.url()).toMatch(/\/contact/);
  });
});

test.describe('Footer Tests', () => {
  test('Footer should have quick links', async ({ page }) => {
    await page.goto('/');
    const footer = await page.locator('footer');
    await expect(footer.locator('.footer-links')).toBeVisible();
  });

  test('Footer should have social links', async ({ page }) => {
    await page.goto('/');
    const footer = await page.locator('footer');
    await expect(footer.locator('.social-links')).toBeVisible();
  });

  test('GitHub link in footer should be present', async ({ page }) => {
    await page.goto('/');
    const githubLink = await page.locator('footer a[href*="github.com"]');
    await expect(githubLink).toBeVisible();
  });

  test('Discord link in footer should be present', async ({ page }) => {
    await page.goto('/');
    const discordLink = await page.locator('footer a[href*="discord"]');
    await expect(discordLink).toBeVisible();
  });
});

test.describe('Home Page Content', () => {
  test('Home page should have hero section', async ({ page }) => {
    await page.goto('/');
    const hero = await page.locator('.hero-section');
    await expect(hero).toBeVisible({ timeout: 10000 });
  });

  test('Home page should have features section', async ({ page }) => {
    await page.goto('/');
    const features = await page.locator('.features-section');
    await expect(features).toBeVisible();
  });

  test('Home page should have services section', async ({ page }) => {
    await page.goto('/');
    const services = await page.locator('.services-section');
    await expect(services).toBeVisible();
  });

  test('Home page should have feature cards', async ({ page }) => {
    await page.goto('/');
    const featureCards = await page.locator('.feature-card');
    expect(await featureCards.count()).toBeGreaterThan(0);
  });
});

test.describe('About Page Content', () => {
  test('About page should have team section', async ({ page }) => {
    await page.goto('/about/');
    const teamSection = await page.locator('.team-section');
    await expect(teamSection).toBeVisible({ timeout: 10000 });
  });

  test('About page should have timeline section', async ({ page }) => {
    await page.goto('/about/');
    const timeline = await page.locator('.timeline-section');
    await expect(timeline).toBeVisible();
  });

  test('About page should have mission section', async ({ page }) => {
    await page.goto('/about/');
    const mission = await page.locator('.mission-section');
    await expect(mission).toBeVisible();
  });

  test('About page should display team members', async ({ page }) => {
    await page.goto('/about/');
    const teamCards = await page.locator('.team-card');
    expect(await teamCards.count()).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Contact Page Forms', () => {
  test('Contact page should have main contact form', async ({ page }) => {
    await page.goto('/contact/');
    const form = await page.locator('#mainContactForm');
    await expect(form).toBeVisible({ timeout: 10000 });
  });

  test('Contact form should have name input', async ({ page }) => {
    await page.goto('/contact/');
    const nameInput = await page.locator('#contactName');
    await expect(nameInput).toBeVisible();
    expect(await nameInput.getAttribute('required')).not.toBeNull();
  });

  test('Contact form should have email input', async ({ page }) => {
    await page.goto('/contact/');
    const emailInput = await page.locator('#contactEmail');
    await expect(emailInput).toBeVisible();
    expect(await emailInput.getAttribute('type')).toBe('email');
  });

  test('Contact form should have message textarea', async ({ page }) => {
    await page.goto('/contact/');
    const messageInput = await page.locator('#contactMessage');
    await expect(messageInput).toBeVisible();
  });

  test('Contact form should have submit button', async ({ page }) => {
    await page.goto('/contact/');
    const submitBtn = await page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });

  test('Contact page should display email address', async ({ page }) => {
    await page.goto('/contact/');
    const emailDisplay = await page.locator('.email-display');
    await expect(emailDisplay).toBeVisible();
    await expect(emailDisplay).toContainText('unityailabcontact@gmail.com');
  });
});

test.describe('Mobile Responsiveness', () => {
  test('Navbar should have toggle button on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const toggle = await page.locator('.navbar-toggler');
    await expect(toggle).toBeVisible();
  });

  test('Content should be visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const h1 = await page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 10000 });
  });

  test('Content should be visible on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    const h1 = await page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 10000 });
  });
});

test.describe('External Links', () => {
  test('GitHub links should use correct URL', async ({ page }) => {
    await page.goto('/');
    const githubLinks = await page.locator('a[href*="github.com/Unity-Lab-AI"]');
    expect(await githubLinks.count()).toBeGreaterThan(0);
  });

  test('External links should have proper attributes', async ({ page }) => {
    await page.goto('/contact/');
    const externalLinks = await page.locator('a[target="_blank"]');
    const count = await externalLinks.count();

    // Verify each external link
    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      const href = await link.getAttribute('href');

      // External links should have http:// or https://
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        expect(await link.getAttribute('target')).toBe('_blank');
      }
    }
  });
});

test.describe('Page Performance', () => {
  test('Home page should load without errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('load');

    // Allow for common benign errors but catch real issues
    const criticalErrors = errors.filter(err =>
      !err.includes('favicon') &&
      !err.includes('cdn.') &&
      !err.includes('analytics')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('All pages should load without 404 errors', async ({ page }) => {
    const failedRequests = [];

    page.on('response', response => {
      if (response.status() === 404 && !response.url().includes('favicon')) {
        failedRequests.push(response.url());
      }
    });

    for (const pageDef of pages) {
      await page.goto(pageDef.url);
      await page.waitForLoadState('load');
    }

    expect(failedRequests.length).toBe(0);
  });
});

test.describe('Content Visibility', () => {
  test('Services page should show service cards', async ({ page }) => {
    await page.goto('/services/');
    const serviceCards = await page.locator('.service-card');
    expect(await serviceCards.count()).toBeGreaterThan(0);
  });

  test('Projects page should show project cards', async ({ page }) => {
    await page.goto('/projects/');
    const projectCards = await page.locator('.project-card, .feature-card');
    expect(await projectCards.count()).toBeGreaterThan(0);
  });
});
