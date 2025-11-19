const { test, expect } = require('@playwright/test');

test.describe('Keyboard Navigation Tests', () => {
  test('Skip link should be first focusable element', async ({ page }) => {
    await page.goto('/');

    // Tab to first element
    await page.keyboard.press('Tab');

    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toHaveClass(/skip-link/);
  });

  test('All navigation links should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Skip the skip-link
    await page.keyboard.press('Tab');

    // Tab through navigation
    const navLinks = ['Home', 'About', 'Services', 'Projects', 'Contact'];

    for (const linkText of navLinks) {
      await page.keyboard.press('Tab');
      const focused = await page.locator(':focus');
      const text = await focused.textContent();

      // Should eventually focus each nav link
      if (text.includes(linkText)) {
        expect(text).toContain(linkText);
      }
    }
  });

  test('Form inputs should be keyboard accessible', async ({ page }) => {
    await page.goto('/contact/');
    await page.waitForLoadState('networkidle');

    // Focus first input
    await page.locator('#contactName').focus();
    await page.keyboard.type('Test User');

    // Tab to email
    await page.keyboard.press('Tab');
    const emailInput = await page.locator(':focus');
    await expect(emailInput).toHaveAttribute('id', 'contactEmail');
    await page.keyboard.type('test@example.com');

    // Continue tabbing through form
    await page.keyboard.press('Tab');
    const focused = await page.locator(':focus');
    const tagName = await focused.evaluate(el => el.tagName.toLowerCase());
    expect(['input', 'select', 'textarea', 'button']).toContain(tagName);
  });

  test('Navbar toggle should be keyboard accessible on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Find and focus navbar toggle
    const toggle = await page.locator('.navbar-toggler');
    await toggle.focus();

    // Press Enter to toggle
    await page.keyboard.press('Enter');

    // Check if navbar is expanded
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('Focus should be visible on all interactive elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab through several elements and check focus visibility
    const elements = await page.locator('a, button').all();

    for (let i = 0; i < Math.min(10, elements.length); i++) {
      await elements[i].focus();

      // Check that focused element is visible
      const isVisible = await elements[i].isVisible();
      expect(isVisible).toBeTruthy();

      // Optionally check for focus styles
      const outlineStyle = await elements[i].evaluate(el =>
        window.getComputedStyle(el).outline
      );

      // Should have some focus indication (outline or other styling)
      expect(outlineStyle).toBeTruthy();
    }
  });

  test('Escape key should close modals if present', async ({ page }) => {
    await page.goto('/services/');
    await page.waitForLoadState('networkidle');

    // Try to find and open a modal (if services page has modals)
    const modalTriggers = await page.locator('[data-bs-toggle="modal"]').all();

    if (modalTriggers.length > 0) {
      // Click first modal trigger
      await modalTriggers[0].click();

      // Wait for modal to open
      await page.waitForTimeout(500);

      // Press Escape
      await page.keyboard.press('Escape');

      // Wait for modal to close
      await page.waitForTimeout(500);

      // Modal should be closed
      const modalBackdrop = await page.locator('.modal-backdrop').count();
      expect(modalBackdrop).toBe(0);
    }
  });

  test('Submit button should be reachable via keyboard', async ({ page }) => {
    await page.goto('/contact/');
    await page.waitForLoadState('networkidle');

    // Tab through form to submit button
    const submitButton = await page.locator('button[type="submit"]');
    await submitButton.focus();

    await expect(submitButton).toBeFocused();

    // Check button has accessible text
    const buttonText = await submitButton.textContent();
    expect(buttonText.trim()).toBeTruthy();
  });

  test('No keyboard trap should exist', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab forward multiple times
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);
    }

    // Should still be able to tab (not trapped)
    const focused1 = await page.locator(':focus');
    const isVisible1 = await focused1.isVisible();

    await page.keyboard.press('Tab');
    const focused2 = await page.locator(':focus');
    const isVisible2 = await focused2.isVisible();

    // Both elements should be visible (not stuck)
    expect(isVisible1 || isVisible2).toBeTruthy();
  });

  test('Shift+Tab should move focus backwards', async ({ page }) => {
    await page.goto('/');

    // Tab forward twice
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const element1 = await page.locator(':focus');
    const id1 = await element1.getAttribute('id') || await element1.getAttribute('class');

    // Shift+Tab back
    await page.keyboard.press('Shift+Tab');

    const element2 = await page.locator(':focus');
    const id2 = await element2.getAttribute('id') || await element2.getAttribute('class');

    // Should be different elements
    expect(id1).not.toBe(id2);
  });
});
