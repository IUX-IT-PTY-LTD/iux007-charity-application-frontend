// Test helper utilities
const { expect } = require('@playwright/test');

/**
 * Common test utilities for the charity application
 */
class TestHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific page and wait for it to load
   */
  async navigateToPage(path = '/') {
    await this.page.goto(path, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('body', { state: 'visible' });
  }

  /**
   * Take a screenshot with timestamp
   */
  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for element to be visible and interactable
   */
  async waitForElement(selector, options = {}) {
    const element = this.page.locator(selector);
    await element.waitFor({ 
      state: 'visible',
      timeout: 10000,
      ...options 
    });
    return element;
  }

  /**
   * Fill form field with validation
   */
  async fillField(selector, value, options = {}) {
    const field = await this.waitForElement(selector);
    await field.clear();
    await field.fill(value);
    
    if (options.validate) {
      await expect(field).toHaveValue(value);
    }
    
    return field;
  }

  /**
   * Click element with wait
   */
  async clickElement(selector, options = {}) {
    const element = await this.waitForElement(selector);
    await element.click(options);
    return element;
  }

  /**
   * Wait for API response
   */
  async waitForApiResponse(urlPattern, options = {}) {
    return await this.page.waitForResponse(response => {
      return response.url().includes(urlPattern) && response.status() === (options.status || 200);
    }, { timeout: 30000 });
  }

  /**
   * Mock API response
   */
  async mockApiResponse(urlPattern, response) {
    await this.page.route(`**/*${urlPattern}*`, route => {
      route.fulfill({
        status: response.status || 200,
        contentType: 'application/json',
        body: JSON.stringify(response.data || {})
      });
    });
  }

  /**
   * Check if element exists
   */
  async elementExists(selector) {
    try {
      await this.page.locator(selector).waitFor({ 
        state: 'visible', 
        timeout: 5000 
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for toast/notification message
   */
  async waitForToast(message = null) {
    const toastSelector = '[data-testid="toast"], .toast, [role="alert"]';
    const toast = await this.waitForElement(toastSelector);
    
    if (message) {
      await expect(toast).toContainText(message);
    }
    
    return toast;
  }

  /**
   * Login helper (if authentication is needed)
   */
  async login(email = 'test@example.com', password = 'password123') {
    await this.navigateToPage('/auth/login');
    await this.fillField('[data-testid="email-input"]', email, { validate: true });
    await this.fillField('[data-testid="password-input"]', password, { validate: true });
    await this.clickElement('[data-testid="login-button"]');
    
    // Wait for successful login
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  }

  /**
   * Logout helper
   */
  async logout() {
    await this.clickElement('[data-testid="user-menu"]');
    await this.clickElement('[data-testid="logout-button"]');
    await this.page.waitForURL('**/', { timeout: 10000 });
  }

  /**
   * Fill donation form
   */
  async fillDonationForm(amount = '25', frequency = 'one-time') {
    await this.fillField('[data-testid="donation-amount"]', amount, { validate: true });
    await this.clickElement(`[data-testid="frequency-${frequency}"]`);
  }

  /**
   * Complete checkout process (mock payment)
   */
  async completeCheckout(cardDetails = {}) {
    const defaults = {
      cardNumber: '4242424242424242',
      expiry: '12/25',
      cvc: '123',
      postalCode: '12345'
    };
    
    const details = { ...defaults, ...cardDetails };
    
    // Fill Stripe form (these selectors might need adjustment based on actual Stripe integration)
    await this.page.frameLocator('iframe[name*="stripe"]').locator('[data-testid="card-number"]').fill(details.cardNumber);
    await this.page.frameLocator('iframe[name*="stripe"]').locator('[data-testid="card-expiry"]').fill(details.expiry);
    await this.page.frameLocator('iframe[name*="stripe"]').locator('[data-testid="card-cvc"]').fill(details.cvc);
    await this.page.frameLocator('iframe[name*="stripe"]').locator('[data-testid="card-postal"]').fill(details.postalCode);
    
    await this.clickElement('[data-testid="submit-payment"]');
  }

  /**
   * Check responsive design
   */
  async checkResponsive() {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'tablet-landscape' },
      { width: 1280, height: 720, name: 'desktop' }
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(1000); // Allow layout to settle
      await this.takeScreenshot(`responsive-${viewport.name}`);
    }
  }
}

module.exports = { TestHelpers };