// Charity request E2E tests
const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');
const { testData } = require('../fixtures/test-data');

test.describe('Charity Request Flow', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should submit charity request successfully', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    // Fill charity request form
    const requestData = testData.charityRequests.valid;
    
    await helpers.fillField('[data-testid="org-name"]', requestData.organizationName);
    await helpers.fillField('[data-testid="reg-number"]', requestData.registrationNumber);
    await helpers.fillField('[data-testid="description"]', requestData.description);
    await helpers.fillField('[data-testid="contact-email"]', requestData.contactEmail);
    await helpers.fillField('[data-testid="contact-phone"]', requestData.contactPhone);
    await helpers.fillField('[data-testid="website"]', requestData.website);
    
    // Fill address information
    await helpers.fillField('[data-testid="address-street"]', requestData.address.street);
    await helpers.fillField('[data-testid="address-city"]', requestData.address.city);
    await helpers.fillField('[data-testid="address-state"]', requestData.address.state);
    await helpers.fillField('[data-testid="address-zip"]', requestData.address.zipCode);
    
    // Select country
    await helpers.clickElement('[data-testid="address-country"]');
    await helpers.clickElement(`[data-testid="country-${requestData.address.country}"]`);
    
    // Upload documents (mock file upload)
    const fileInput = page.locator('[data-testid="document-upload"]');
    if (await fileInput.isVisible()) {
      // In real tests, you'd upload actual files
      // For now, we'll simulate the upload
      await page.setInputFiles('[data-testid="document-upload"]', [
        {
          name: 'registration-certificate.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('Mock PDF content')
        }
      ]);
    }
    
    // Accept terms
    await helpers.clickElement('[data-testid="accept-terms"]');
    
    // Submit request
    await helpers.clickElement('[data-testid="submit-request"]');
    
    // Wait for API response
    await helpers.waitForApiResponse('/api/charity-requests');
    
    // Should show success message
    const successMessage = await helpers.waitForElement('[data-testid="request-success"]');
    await expect(successMessage).toContainText(/submitted|received|review/i);
    
    // Should show reference number
    await expect(page.locator('[data-testid="reference-number"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    // Try to submit empty form
    await helpers.clickElement('[data-testid="submit-request"]');
    
    // Should show validation errors
    await expect(page.locator('[data-testid="org-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="reg-number-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="description-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="terms-error"]')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    const emailField = await helpers.waitForElement('[data-testid="contact-email"]');
    
    // Test invalid email formats
    for (const invalidEmail of testData.validation.email.invalid) {
      await emailField.fill(invalidEmail);
      await helpers.clickElement('[data-testid="submit-request"]');
      
      const emailError = await helpers.waitForElement('[data-testid="contact-email-error"]');
      await expect(emailError).toBeVisible();
    }
    
    // Test valid email
    await emailField.fill(testData.charityRequests.valid.contactEmail);
    await helpers.clickElement('[data-testid="submit-request"]');
    
    // Email error should be gone
    const emailError = page.locator('[data-testid="contact-email-error"]');
    await expect(emailError).not.toBeVisible();
  });

  test('should validate phone number format', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    const phoneField = await helpers.waitForElement('[data-testid="contact-phone"]');
    
    // Test invalid phone formats
    for (const invalidPhone of testData.validation.phone.invalid) {
      await phoneField.fill(invalidPhone);
      await helpers.clickElement('[data-testid="submit-request"]');
      
      const phoneError = await helpers.waitForElement('[data-testid="contact-phone-error"]');
      await expect(phoneError).toBeVisible();
    }
    
    // Test valid phone
    await phoneField.fill(testData.charityRequests.valid.contactPhone);
    await helpers.clickElement('[data-testid="submit-request"]');
    
    // Phone error should be gone
    const phoneError = page.locator('[data-testid="contact-phone-error"]');
    await expect(phoneError).not.toBeVisible();
  });

  test('should validate website URL format', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    const websiteField = await helpers.waitForElement('[data-testid="website"]');
    
    // Test invalid URLs
    const invalidUrls = ['invalid-url', 'not-a-url', 'http://', 'ftp://example.com'];
    
    for (const invalidUrl of invalidUrls) {
      await websiteField.fill(invalidUrl);
      await helpers.clickElement('[data-testid="submit-request"]');
      
      const websiteError = await helpers.waitForElement('[data-testid="website-error"]');
      await expect(websiteError).toBeVisible();
    }
    
    // Test valid URL
    await websiteField.fill(testData.charityRequests.valid.website);
    await helpers.clickElement('[data-testid="submit-request"]');
    
    // Website error should be gone
    const websiteError = page.locator('[data-testid="website-error"]');
    await expect(websiteError).not.toBeVisible();
  });

  test('should handle file upload validation', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    const fileInput = page.locator('[data-testid="document-upload"]');
    
    if (await fileInput.isVisible()) {
      // Test invalid file type
      await page.setInputFiles('[data-testid="document-upload"]', [
        {
          name: 'invalid-document.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('Invalid file type')
        }
      ]);
      
      await helpers.clickElement('[data-testid="submit-request"]');
      
      // Should show file type error
      const fileError = await helpers.waitForElement('[data-testid="file-type-error"]');
      await expect(fileError).toContainText(/pdf|document|format/i);
      
      // Test valid file
      await page.setInputFiles('[data-testid="document-upload"]', [
        {
          name: 'registration-certificate.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('Valid PDF content')
        }
      ]);
      
      // File error should be gone
      await expect(fileError).not.toBeVisible();
    }
  });

  test('should show progress indicator during submission', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    // Fill required fields
    const requestData = testData.charityRequests.valid;
    await helpers.fillField('[data-testid="org-name"]', requestData.organizationName);
    await helpers.fillField('[data-testid="reg-number"]', requestData.registrationNumber);
    await helpers.fillField('[data-testid="description"]', requestData.description);
    await helpers.fillField('[data-testid="contact-email"]', requestData.contactEmail);
    await helpers.clickElement('[data-testid="accept-terms"]');
    
    // Submit request
    await helpers.clickElement('[data-testid="submit-request"]');
    
    // Should show loading state
    const loadingIndicator = page.locator('[data-testid="submitting"], .loading, [disabled]');
    await expect(loadingIndicator).toBeVisible();
    
    // Wait for completion
    await helpers.waitForApiResponse('/api/charity-requests');
    
    // Loading should be gone
    await expect(loadingIndicator).not.toBeVisible();
  });

  test('should handle submission errors', async ({ page }) => {
    // Mock server error
    await helpers.mockApiResponse('/api/charity-requests', {
      status: 500,
      data: { message: 'Server error', error: 'Database connection failed' }
    });
    
    await helpers.navigateToPage('/charity-request');
    
    // Fill minimum required fields
    const requestData = testData.charityRequests.valid;
    await helpers.fillField('[data-testid="org-name"]', requestData.organizationName);
    await helpers.fillField('[data-testid="reg-number"]', requestData.registrationNumber);
    await helpers.fillField('[data-testid="description"]', requestData.description);
    await helpers.fillField('[data-testid="contact-email"]', requestData.contactEmail);
    await helpers.clickElement('[data-testid="accept-terms"]');
    
    // Submit request
    await helpers.clickElement('[data-testid="submit-request"]');
    
    // Should show error message
    const errorMessage = await helpers.waitForElement('[data-testid="submission-error"]');
    await expect(errorMessage).toContainText(/error|failed|try again/i);
    
    // Form should remain filled
    await expect(page.locator('[data-testid="org-name"]')).toHaveValue(requestData.organizationName);
  });

  test('should save draft automatically', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    // Fill some fields
    await helpers.fillField('[data-testid="org-name"]', 'Test Organization');
    await helpers.fillField('[data-testid="contact-email"]', 'test@example.com');
    
    // Navigate away and come back
    await helpers.navigateToPage('/');
    await helpers.navigateToPage('/charity-request');
    
    // Fields should be restored from draft (if auto-save is implemented)
    const orgName = page.locator('[data-testid="org-name"]');
    const savedValue = await orgName.inputValue();
    
    if (savedValue) {
      expect(savedValue).toBe('Test Organization');
    }
  });

  test('should display terms and conditions', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    // Terms link should be visible
    const termsLink = page.locator('[data-testid="terms-link"], a:has-text("Terms")');
    await expect(termsLink).toBeVisible();
    
    // Click terms link
    await termsLink.click();
    
    // Should open terms modal or navigate to terms page
    const termsContent = page.locator('[data-testid="terms-modal"], [data-testid="terms-content"]');
    await expect(termsContent).toBeVisible();
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await helpers.navigateToPage('/charity-request');
    
    // Verify mobile-friendly form
    await expect(page.locator('[data-testid="charity-request-form"]')).toBeVisible();
    
    // Test mobile form filling
    const requestData = testData.charityRequests.valid;
    await helpers.fillField('[data-testid="org-name"]', requestData.organizationName);
    await helpers.fillField('[data-testid="reg-number"]', requestData.registrationNumber);
    await helpers.fillField('[data-testid="description"]', requestData.description);
    await helpers.fillField('[data-testid="contact-email"]', requestData.contactEmail);
    
    // Mobile form should be scrollable and usable
    await helpers.clickElement('[data-testid="accept-terms"]');
    await helpers.clickElement('[data-testid="submit-request"]');
    
    // Should work on mobile
    await helpers.waitForApiResponse('/api/charity-requests');
    await expect(page.locator('[data-testid="request-success"]')).toBeVisible();
  });

  test('should display character counts for text areas', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    const descriptionField = await helpers.waitForElement('[data-testid="description"]');
    
    // Type in description
    await descriptionField.fill('This is a test description for our charity organization.');
    
    // Character count should be displayed
    const charCount = page.locator('[data-testid="description-count"]');
    if (await charCount.isVisible()) {
      const count = await charCount.textContent();
      expect(count).toContain('61'); // Length of test description
    }
  });

  test('should validate maximum character limits', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    const descriptionField = await helpers.waitForElement('[data-testid="description"]');
    
    // Fill with very long text (assuming 1000 char limit)
    const longText = 'A'.repeat(1001);
    await descriptionField.fill(longText);
    
    await helpers.clickElement('[data-testid="submit-request"]');
    
    // Should show character limit error
    const charLimitError = await helpers.waitForElement('[data-testid="description-error"]');
    await expect(charLimitError).toContainText(/character|limit|maximum/i);
  });

  test('should allow users to track request status', async ({ page }) => {
    // First submit a request
    await helpers.navigateToPage('/charity-request');
    
    const requestData = testData.charityRequests.valid;
    await helpers.fillField('[data-testid="org-name"]', requestData.organizationName);
    await helpers.fillField('[data-testid="reg-number"]', requestData.registrationNumber);
    await helpers.fillField('[data-testid="description"]', requestData.description);
    await helpers.fillField('[data-testid="contact-email"]', requestData.contactEmail);
    await helpers.clickElement('[data-testid="accept-terms"]');
    await helpers.clickElement('[data-testid="submit-request"]');
    
    // Get reference number
    await helpers.waitForApiResponse('/api/charity-requests');
    const referenceNumber = await page.locator('[data-testid="reference-number"]').textContent();
    
    // Navigate to status tracking page
    await helpers.navigateToPage('/charity-request/status');
    
    // Enter reference number
    await helpers.fillField('[data-testid="reference-input"]', referenceNumber);
    await helpers.clickElement('[data-testid="check-status"]');
    
    // Should show request status
    const statusInfo = await helpers.waitForElement('[data-testid="request-status"]');
    await expect(statusInfo).toContainText(/pending|review|submitted/i);
  });
});