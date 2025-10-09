// Donation flow E2E tests
const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');
const { testData } = require('../fixtures/test-data');

test.describe('Donation Flow', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Mock successful payment processing
    await helpers.mockApiResponse('/api/payments', {
      status: 200,
      data: testData.apiResponses.donation.success.data
    });
  });

  test('should complete one-time donation flow', async ({ page }) => {
    // Navigate to a specific event
    await helpers.navigateToPage('/');
    
    // Wait for events to load and click on first event
    await helpers.waitForApiResponse('/api/events');
    const firstEvent = await helpers.waitForElement('[data-testid="event-card"]');
    await firstEvent.click();
    
    // Should be on event details page
    await expect(page).toHaveURL(/.*event-details.*/);
    
    // Click donate button
    const donateButton = await helpers.waitForElement('[data-testid="donate-button"], button:has-text("Donate")');
    await donateButton.click();
    
    // Fill donation form
    await helpers.fillDonationForm('25', 'one-time');
    
    // Proceed to checkout
    const proceedButton = await helpers.waitForElement('[data-testid="proceed-checkout"], button:has-text("Proceed")');
    await proceedButton.click();
    
    // Should be on checkout page
    await expect(page).toHaveURL(/.*checkout.*/);
    
    // Fill donor information
    await helpers.fillField('[data-testid="donor-email"]', testData.users.donor.email);
    await helpers.fillField('[data-testid="donor-first-name"]', testData.users.donor.firstName);
    await helpers.fillField('[data-testid="donor-last-name"]', testData.users.donor.lastName);
    
    // Complete payment
    await helpers.completeCheckout(testData.payments.validCard);
    
    // Wait for success page
    await page.waitForURL('**/donation-success**', { timeout: 30000 });
    
    // Verify success message
    const successMessage = await helpers.waitForElement('[data-testid="success-message"]');
    await expect(successMessage).toContainText('Thank you');
    
    // Verify transaction details
    await expect(page.locator('[data-testid="transaction-id"]')).toBeVisible();
    await expect(page.locator('[data-testid="donation-amount"]')).toContainText('$25');
  });

  test('should complete monthly donation flow', async ({ page }) => {
    await helpers.navigateToPage('/donations');
    
    // Fill donation form for monthly donation
    await helpers.fillDonationForm('50', 'monthly');
    
    // Proceed to checkout
    const proceedButton = await helpers.waitForElement('[data-testid="proceed-checkout"]');
    await proceedButton.click();
    
    // Fill donor information
    await helpers.fillField('[data-testid="donor-email"]', testData.users.donor.email);
    await helpers.fillField('[data-testid="donor-first-name"]', testData.users.donor.firstName);
    await helpers.fillField('[data-testid="donor-last-name"]', testData.users.donor.lastName);
    
    // Verify monthly donation details
    await expect(page.locator('[data-testid="recurring-info"]')).toContainText('monthly');
    await expect(page.locator('[data-testid="monthly-amount"]')).toContainText('$50');
    
    // Complete payment
    await helpers.completeCheckout(testData.payments.validCard);
    
    // Verify subscription setup
    await page.waitForURL('**/donation-success**');
    await expect(page.locator('[data-testid="subscription-info"]')).toBeVisible();
  });

  test('should handle anonymous donations', async ({ page }) => {
    await helpers.navigateToPage('/donations');
    
    // Fill donation form
    await helpers.fillDonationForm('100', 'one-time');
    
    // Check anonymous donation option
    const anonymousCheckbox = await helpers.waitForElement('[data-testid="anonymous-donation"]');
    await anonymousCheckbox.check();
    
    // Proceed to checkout
    await helpers.clickElement('[data-testid="proceed-checkout"]');
    
    // Verify anonymous donation notice
    await expect(page.locator('[data-testid="anonymous-notice"]')).toBeVisible();
    
    // Should still require email for receipt
    await helpers.fillField('[data-testid="donor-email"]', testData.users.donor.email);
    
    // Complete payment
    await helpers.completeCheckout(testData.payments.validCard);
    
    // Verify anonymous confirmation
    await page.waitForURL('**/donation-success**');
    await expect(page.locator('[data-testid="anonymous-confirmation"]')).toBeVisible();
  });

  test('should handle payment failures', async ({ page }) => {
    // Mock payment failure
    await helpers.mockApiResponse('/api/payments', {
      status: 400,
      data: testData.apiResponses.donation.paymentFailed.data
    });
    
    await helpers.navigateToPage('/donations');
    
    // Fill donation form
    await helpers.fillDonationForm('25', 'one-time');
    await helpers.clickElement('[data-testid="proceed-checkout"]');
    
    // Fill donor information
    await helpers.fillField('[data-testid="donor-email"]', testData.users.donor.email);
    await helpers.fillField('[data-testid="donor-first-name"]', testData.users.donor.firstName);
    await helpers.fillField('[data-testid="donor-last-name"]', testData.users.donor.lastName);
    
    // Try to complete payment with declined card
    await helpers.completeCheckout(testData.payments.declinedCard);
    
    // Should show error message
    const errorMessage = await helpers.waitForElement('[data-testid="payment-error"]');
    await expect(errorMessage).toContainText('declined');
    
    // Should remain on checkout page
    await expect(page).toHaveURL(/.*checkout.*/);
  });

  test('should validate donation amounts', async ({ page }) => {
    await helpers.navigateToPage('/donations');
    
    const amountField = await helpers.waitForElement('[data-testid="donation-amount"]');
    
    // Test invalid amounts
    for (const invalidAmount of testData.validation.amount.invalid) {
      await amountField.fill(invalidAmount);
      await helpers.clickElement('[data-testid="proceed-checkout"]');
      
      // Should show validation error
      const errorMessage = await helpers.waitForElement('[data-testid="amount-error"]');
      await expect(errorMessage).toBeVisible();
    }
    
    // Test valid amount
    await amountField.fill('25');
    await helpers.clickElement('[data-testid="proceed-checkout"]');
    
    // Should proceed to checkout
    await expect(page).toHaveURL(/.*checkout.*/);
  });

  test('should validate donor information', async ({ page }) => {
    await helpers.navigateToPage('/donations');
    
    // Fill donation form and proceed
    await helpers.fillDonationForm('25', 'one-time');
    await helpers.clickElement('[data-testid="proceed-checkout"]');
    
    // Test invalid email formats
    const emailField = await helpers.waitForElement('[data-testid="donor-email"]');
    
    for (const invalidEmail of testData.validation.email.invalid) {
      await emailField.fill(invalidEmail);
      await helpers.clickElement('[data-testid="submit-payment"]');
      
      // Should show email validation error
      const emailError = await helpers.waitForElement('[data-testid="email-error"]');
      await expect(emailError).toBeVisible();
    }
    
    // Test valid email
    await emailField.fill(testData.users.donor.email);
    await helpers.fillField('[data-testid="donor-first-name"]', testData.users.donor.firstName);
    await helpers.fillField('[data-testid="donor-last-name"]', testData.users.donor.lastName);
    
    // Should proceed with valid information
    await helpers.completeCheckout(testData.payments.validCard);
    await page.waitForURL('**/donation-success**');
  });

  test('should handle donation to specific event', async ({ page }) => {
    // Navigate to specific event
    await helpers.navigateToPage('/event-details/123');
    
    // Verify event information is displayed
    await expect(page.locator('[data-testid="event-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="event-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
    
    // Click donate button
    await helpers.clickElement('[data-testid="donate-button"]');
    
    // Verify event is pre-selected in donation form
    await expect(page.locator('[data-testid="selected-event"]')).toContainText('Help Feed the Homeless');
    
    // Complete donation flow
    await helpers.fillDonationForm('50', 'one-time');
    await helpers.clickElement('[data-testid="proceed-checkout"]');
    
    await helpers.fillField('[data-testid="donor-email"]', testData.users.donor.email);
    await helpers.fillField('[data-testid="donor-first-name"]', testData.users.donor.firstName);
    await helpers.fillField('[data-testid="donor-last-name"]', testData.users.donor.lastName);
    
    await helpers.completeCheckout(testData.payments.validCard);
    
    // Verify donation success with event information
    await page.waitForURL('**/donation-success**');
    await expect(page.locator('[data-testid="donated-event"]')).toContainText('Help Feed the Homeless');
  });

  test('should save donation for logged-in users', async ({ page }) => {
    // Login first
    await helpers.login(testData.users.donor.email, testData.users.donor.password);
    
    // Navigate to donations
    await helpers.navigateToPage('/donations');
    
    // Complete donation
    await helpers.fillDonationForm('75', 'one-time');
    await helpers.clickElement('[data-testid="proceed-checkout"]');
    
    // User info should be pre-filled for logged-in users
    await expect(page.locator('[data-testid="donor-email"]')).toHaveValue(testData.users.donor.email);
    
    await helpers.completeCheckout(testData.payments.validCard);
    
    // Navigate to donation history
    await helpers.navigateToPage('/profile/donations');
    
    // Verify donation appears in history
    await expect(page.locator('[data-testid="donation-history"]')).toContainText('$75');
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await helpers.navigateToPage('/donations');
    
    // Test mobile donation flow
    await helpers.fillDonationForm('25', 'one-time');
    await helpers.clickElement('[data-testid="proceed-checkout"]');
    
    // Verify mobile-friendly checkout
    await expect(page.locator('[data-testid="checkout-form"]')).toBeVisible();
    
    // Complete mobile checkout
    await helpers.fillField('[data-testid="donor-email"]', testData.users.donor.email);
    await helpers.fillField('[data-testid="donor-first-name"]', testData.users.donor.firstName);
    await helpers.fillField('[data-testid="donor-last-name"]', testData.users.donor.lastName);
    
    await helpers.completeCheckout(testData.payments.validCard);
    
    // Verify mobile success page
    await page.waitForURL('**/donation-success**');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});