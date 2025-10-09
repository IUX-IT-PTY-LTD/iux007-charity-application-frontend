// Accessibility integration tests
const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');

test.describe('Accessibility', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await helpers.navigateToPage('/');
    
    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    // Should have at least one h1
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBeGreaterThanOrEqual(1);
    
    // Check heading hierarchy
    let previousLevel = 0;
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const currentLevel = parseInt(tagName.charAt(1));
      
      // Heading levels should not skip (h1 -> h3 is bad)
      if (previousLevel > 0) {
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
      
      previousLevel = currentLevel;
    }
  });

  test('should have proper alt text for images', async ({ page }) => {
    await helpers.navigateToPage('/');
    
    // Get all images
    const images = await page.locator('img').all();
    
    for (const image of images) {
      const alt = await image.getAttribute('alt');
      const src = await image.getAttribute('src');
      
      // Decorative images can have empty alt, but should have alt attribute
      expect(alt !== null).toBeTruthy();
      
      // If image has meaningful content, alt should not be empty
      if (src && !src.includes('decoration') && !src.includes('background')) {
        expect(alt?.length).toBeGreaterThan(0);
      }
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    // Get all form inputs
    const inputs = await page.locator('input, textarea, select').all();
    
    for (const input of inputs) {
      const inputId = await input.getAttribute('id');
      const inputType = await input.getAttribute('type');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      
      // Skip hidden inputs and buttons
      if (inputType === 'hidden' || inputType === 'submit' || inputType === 'button') {
        continue;
      }
      
      // Input should have either:
      // 1. Associated label (via for attribute)
      // 2. aria-label
      // 3. aria-labelledby
      let hasLabel = false;
      
      if (inputId) {
        const associatedLabel = await page.locator(`label[for="${inputId}"]`).count();
        if (associatedLabel > 0) hasLabel = true;
      }
      
      if (ariaLabel && ariaLabel.length > 0) hasLabel = true;
      if (ariaLabelledby) hasLabel = true;
      
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await helpers.navigateToPage('/');
    
    // Start from the first focusable element
    await page.keyboard.press('Tab');
    
    const focusableElements = [];
    let currentElement = await page.locator(':focus').first();
    
    // Collect first 10 focusable elements
    for (let i = 0; i < 10; i++) {
      if (await currentElement.isVisible()) {
        const tagName = await currentElement.evaluate(el => el.tagName.toLowerCase());
        focusableElements.push(tagName);
      }
      
      await page.keyboard.press('Tab');
      currentElement = await page.locator(':focus').first();
    }
    
    // Should have focusable elements
    expect(focusableElements.length).toBeGreaterThan(0);
    
    // Common focusable elements should be in the list
    const expectedElements = ['button', 'a', 'input'];
    const hasExpectedElements = expectedElements.some(element => 
      focusableElements.includes(element)
    );
    expect(hasExpectedElements).toBeTruthy();
  });

  test('should have proper color contrast', async ({ page }) => {
    await helpers.navigateToPage('/');
    
    // This is a basic check - in real implementation you'd use a color contrast library
    // or axe-core for comprehensive testing
    
    // Check if text is visible against background
    const textElements = await page.locator('p, span, h1, h2, h3, h4, h5, h6, a').all();
    
    for (let i = 0; i < Math.min(textElements.length, 5); i++) {
      const element = textElements[i];
      
      if (await element.isVisible()) {
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize
          };
        });
        
        // Basic check - text should have color set
        expect(styles.color).not.toBe('');
        expect(styles.color).not.toBe('transparent');
      }
    }
  });

  test('should have proper ARIA roles and states', async ({ page }) => {
    await helpers.navigateToPage('/');
    
    // Check for proper use of ARIA landmarks
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]').count();
    expect(landmarks).toBeGreaterThan(0);
    
    // Check navigation has proper ARIA
    const navigation = page.locator('nav');
    if (await navigation.count() > 0) {
      const navRole = await navigation.first().getAttribute('role');
      const ariaLabel = await navigation.first().getAttribute('aria-label');
      
      // Navigation should have role or be nav element
      expect(navRole === 'navigation' || await navigation.first().evaluate(el => el.tagName.toLowerCase()) === 'nav').toBeTruthy();
    }
    
    // Check buttons have proper states
    const buttons = await page.locator('button').all();
    for (const button of buttons.slice(0, 5)) { // Check first 5 buttons
      const ariaExpanded = await button.getAttribute('aria-expanded');
      const ariaPressed = await button.getAttribute('aria-pressed');
      
      // If button controls something, it should have appropriate ARIA states
      if (ariaExpanded !== null) {
        expect(['true', 'false'].includes(ariaExpanded)).toBeTruthy();
      }
    }
  });

  test('should support screen reader announcements', async ({ page }) => {
    await helpers.navigateToPage('/donations');
    
    // Fill donation form
    await helpers.fillField('[data-testid="donation-amount"]', '25');
    
    // Check for live regions that would announce changes
    const liveRegions = await page.locator('[aria-live], [role="status"], [role="alert"]').count();
    
    // While we can't test actual screen reader behavior in Playwright,
    // we can check that appropriate ARIA live regions exist
    if (liveRegions > 0) {
      console.log(`Found ${liveRegions} live regions for screen reader announcements`);
    }
  });

  test('should handle focus management in modals', async ({ page }) => {
    await helpers.navigateToPage('/');
    
    // Look for modal triggers
    const modalTrigger = page.locator('[data-testid="open-modal"], button:has-text("Donate")').first();
    
    if (await modalTrigger.isVisible()) {
      // Focus the trigger and activate it
      await modalTrigger.focus();
      await modalTrigger.click();
      
      // Check if modal opened
      const modal = page.locator('[role="dialog"], [data-testid="modal"]');
      
      if (await modal.isVisible()) {
        // Focus should be trapped in modal
        await page.keyboard.press('Tab');
        const focusedElement = await page.locator(':focus').first();
        
        // Focused element should be within modal
        const isInModal = await focusedElement.evaluate((el, modalEl) => {
          return modalEl.contains(el);
        }, await modal.elementHandle());
        
        expect(isInModal).toBeTruthy();
        
        // Close modal and check focus return
        const closeButton = modal.locator('[data-testid="close-modal"], button:has-text("Close")').first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
          
          // Focus should return to trigger
          const newFocusedElement = await page.locator(':focus').first();
          const isSameElement = await newFocusedElement.evaluate((el, triggerEl) => {
            return el === triggerEl;
          }, await modalTrigger.elementHandle());
          
          expect(isSameElement).toBeTruthy();
        }
      }
    }
  });

  test('should have proper error announcements', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    // Submit form without required fields to trigger errors
    await helpers.clickElement('[data-testid="submit-request"]');
    
    // Check for error announcements
    const errorElements = await page.locator('[role="alert"], [aria-live="assertive"]').count();
    
    if (errorElements > 0) {
      // Errors should be announced to screen readers
      const errorText = await page.locator('[role="alert"]').first().textContent();
      expect(errorText?.length).toBeGreaterThan(0);
    }
    
    // Check individual field errors have proper association
    const fieldErrors = await page.locator('[data-testid$="-error"]').all();
    
    for (const error of fieldErrors) {
      const errorId = await error.getAttribute('id');
      
      if (errorId) {
        // Find associated input
        const associatedInput = await page.locator(`[aria-describedby*="${errorId}"]`).count();
        expect(associatedInput).toBeGreaterThan(0);
      }
    }
  });

  test('should work with high contrast mode', async ({ page }) => {
    // Simulate high contrast by modifying CSS
    await page.addStyleTag({
      content: `
        * {
          background-color: black !important;
          color: white !important;
          border-color: white !important;
        }
        a {
          color: yellow !important;
        }
      `
    });
    
    await helpers.navigateToPage('/');
    
    // Page should still be usable in high contrast
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('nav').first()).toBeVisible();
    
    // Links should be distinguishable
    const links = await page.locator('a').all();
    for (let i = 0; i < Math.min(links.length, 3); i++) {
      await expect(links[i]).toBeVisible();
    }
  });

  test('should support reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await helpers.navigateToPage('/');
    
    // Animations should be disabled or reduced
    // This is more of a CSS test, but we can check that elements are still functional
    const animatedElements = await page.locator('[class*="animate"], [class*="transition"]').all();
    
    for (let i = 0; i < Math.min(animatedElements.length, 3); i++) {
      await expect(animatedElements[i]).toBeVisible();
    }
  });

  test('should have descriptive page titles', async ({ page }) => {
    const pages = [
      { path: '/', expectedKeywords: ['charity', 'home'] },
      { path: '/donations', expectedKeywords: ['donation', 'donate'] },
      { path: '/events', expectedKeywords: ['event'] },
      { path: '/contact', expectedKeywords: ['contact'] }
    ];
    
    for (const { path, expectedKeywords } of pages) {
      await helpers.navigateToPage(path);
      
      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      
      // Title should contain relevant keywords
      const hasKeyword = expectedKeywords.some(keyword => 
        title.toLowerCase().includes(keyword)
      );
      expect(hasKeyword).toBeTruthy();
    }
  });

  test('should handle language and internationalization', async ({ page }) => {
    await helpers.navigateToPage('/');
    
    // Check HTML lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    expect(htmlLang?.length).toBeGreaterThan(1);
    
    // Check for proper text direction
    const direction = await page.locator('html').getAttribute('dir');
    if (direction) {
      expect(['ltr', 'rtl'].includes(direction)).toBeTruthy();
    }
  });
});