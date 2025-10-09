// User authentication E2E tests
const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');
const { testData } = require('../fixtures/test-data');

test.describe('User Authentication', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should register new user successfully', async ({ page }) => {
    await helpers.navigateToPage('/auth/register');
    
    // Fill registration form
    await helpers.fillField('[data-testid="register-email"]', 'newuser@test.com');
    await helpers.fillField('[data-testid="register-password"]', 'NewUser123!');
    await helpers.fillField('[data-testid="register-confirm-password"]', 'NewUser123!');
    await helpers.fillField('[data-testid="register-first-name"]', 'New');
    await helpers.fillField('[data-testid="register-last-name"]', 'User');
    
    // Accept terms and conditions
    await helpers.clickElement('[data-testid="accept-terms"]');
    
    // Submit registration
    await helpers.clickElement('[data-testid="register-submit"]');
    
    // Should redirect to verification or dashboard
    await page.waitForURL(/\/(verify-email|dashboard|profile)/, { timeout: 10000 });
    
    // Check for success message or welcome message
    await expect(
      page.locator('[data-testid="welcome-message"], [data-testid="verification-notice"]')
    ).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await helpers.navigateToPage('/auth/login');
    
    // Fill login form
    await helpers.fillField('[data-testid="login-email"]', testData.users.donor.email);
    await helpers.fillField('[data-testid="login-password"]', testData.users.donor.password);
    
    // Submit login
    await helpers.clickElement('[data-testid="login-submit"]');
    
    // Should redirect to dashboard or previous page
    await page.waitForURL(/\/(dashboard|profile|\/)/, { timeout: 10000 });
    
    // Verify user is logged in
    const userMenu = page.locator('[data-testid="user-menu"], [data-testid="user-avatar"]');
    await expect(userMenu).toBeVisible();
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await helpers.navigateToPage('/auth/login');
    
    // Fill login form with invalid credentials
    await helpers.fillField('[data-testid="login-email"]', 'invalid@test.com');
    await helpers.fillField('[data-testid="login-password"]', 'wrongpassword');
    
    // Submit login
    await helpers.clickElement('[data-testid="login-submit"]');
    
    // Should show error message
    const errorMessage = await helpers.waitForElement('[data-testid="login-error"]');
    await expect(errorMessage).toContainText(/invalid|incorrect|failed/i);
    
    // Should remain on login page
    await expect(page).toHaveURL(/.*auth\/login.*/);
  });

  test('should validate email format during registration', async ({ page }) => {
    await helpers.navigateToPage('/auth/register');
    
    const emailField = await helpers.waitForElement('[data-testid="register-email"]');
    
    // Test invalid email formats
    for (const invalidEmail of testData.validation.email.invalid) {
      await emailField.fill(invalidEmail);
      await helpers.clickElement('[data-testid="register-submit"]');
      
      // Should show email validation error
      const emailError = await helpers.waitForElement('[data-testid="email-error"]');
      await expect(emailError).toBeVisible();
    }
  });

  test('should validate password strength', async ({ page }) => {
    await helpers.navigateToPage('/auth/register');
    
    const passwordField = await helpers.waitForElement('[data-testid="register-password"]');
    
    // Test weak passwords
    const weakPasswords = ['123', 'password', 'abc123', '12345678'];
    
    for (const weakPassword of weakPasswords) {
      await passwordField.fill(weakPassword);
      await helpers.clickElement('[data-testid="register-submit"]');
      
      // Should show password strength error
      const passwordError = await helpers.waitForElement('[data-testid="password-error"]');
      await expect(passwordError).toBeVisible();
    }
    
    // Test strong password
    await passwordField.fill('StrongPass123!');
    await helpers.fillField('[data-testid="register-confirm-password"]', 'StrongPass123!');
    
    // Password strength indicator should show strong
    const strengthIndicator = page.locator('[data-testid="password-strength"]');
    if (await strengthIndicator.isVisible()) {
      await expect(strengthIndicator).toContainText(/strong|good/i);
    }
  });

  test('should validate password confirmation', async ({ page }) => {
    await helpers.navigateToPage('/auth/register');
    
    // Fill passwords that don't match
    await helpers.fillField('[data-testid="register-password"]', 'Password123!');
    await helpers.fillField('[data-testid="register-confirm-password"]', 'DifferentPass123!');
    
    await helpers.clickElement('[data-testid="register-submit"]');
    
    // Should show password mismatch error
    const confirmError = await helpers.waitForElement('[data-testid="confirm-password-error"]');
    await expect(confirmError).toContainText(/match|same/i);
  });

  test('should handle Google OAuth login', async ({ page }) => {
    await helpers.navigateToPage('/auth/login');
    
    // Mock successful OAuth response
    await page.route('**/auth/google**', route => {
      route.fulfill({
        status: 200,
        body: 'OAuth redirect handled'
      });
    });
    
    // Click Google login button
    const googleButton = page.locator('[data-testid="google-login"], button:has-text("Google")');
    
    if (await googleButton.isVisible()) {
      await googleButton.click();
      
      // Should redirect to Google OAuth (or handle mock)
      // In real test, this would open OAuth popup
      await page.waitForTimeout(2000);
    }
  });

  test('should handle Apple OAuth login', async ({ page }) => {
    await helpers.navigateToPage('/auth/login');
    
    // Mock successful OAuth response
    await page.route('**/auth/apple**', route => {
      route.fulfill({
        status: 200,
        body: 'OAuth redirect handled'
      });
    });
    
    // Click Apple login button
    const appleButton = page.locator('[data-testid="apple-login"], button:has-text("Apple")');
    
    if (await appleButton.isVisible()) {
      await appleButton.click();
      
      // Should redirect to Apple OAuth (or handle mock)
      await page.waitForTimeout(2000);
    }
  });

  test('should handle forgot password flow', async ({ page }) => {
    await helpers.navigateToPage('/auth/login');
    
    // Click forgot password link
    const forgotPasswordLink = page.locator('[data-testid="forgot-password"], a:has-text("Forgot")');
    await forgotPasswordLink.click();
    
    // Should navigate to forgot password page
    await expect(page).toHaveURL(/.*forgot-password.*/);
    
    // Fill email for password reset
    await helpers.fillField('[data-testid="reset-email"]', testData.users.donor.email);
    
    // Submit reset request
    await helpers.clickElement('[data-testid="reset-submit"]');
    
    // Should show confirmation message
    const confirmationMessage = await helpers.waitForElement('[data-testid="reset-confirmation"]');
    await expect(confirmationMessage).toContainText(/sent|email|check/i);
  });

  test('should logout user successfully', async ({ page }) => {
    // Login first
    await helpers.login(testData.users.donor.email, testData.users.donor.password);
    
    // Verify user is logged in
    const userMenu = await helpers.waitForElement('[data-testid="user-menu"], [data-testid="user-avatar"]');
    await userMenu.click();
    
    // Click logout
    const logoutButton = await helpers.waitForElement('[data-testid="logout-button"], button:has-text("Logout")');
    await logoutButton.click();
    
    // Should redirect to homepage or login page
    await page.waitForURL(/\/(login|\/)/, { timeout: 10000 });
    
    // Verify user is logged out
    await expect(
      page.locator('[data-testid="login-button"], a:has-text("Login")')
    ).toBeVisible();
  });

  test('should protect authenticated routes', async ({ page }) => {
    // Try to access protected route without login
    await helpers.navigateToPage('/profile');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*auth\/login.*/);
    
    // Should show message about authentication required
    const authMessage = page.locator('[data-testid="auth-required"], .auth-notice');
    if (await authMessage.isVisible()) {
      await expect(authMessage).toContainText(/login|authenticate/i);
    }
  });

  test('should persist login session', async ({ page }) => {
    // Login
    await helpers.login(testData.users.donor.email, testData.users.donor.password);
    
    // Reload page
    await page.reload();
    await helpers.waitForPageLoad();
    
    // User should still be logged in
    const userMenu = page.locator('[data-testid="user-menu"], [data-testid="user-avatar"]');
    await expect(userMenu).toBeVisible();
  });

  test('should redirect to intended page after login', async ({ page }) => {
    // Try to access protected page
    await helpers.navigateToPage('/profile');
    
    // Should redirect to login with return URL
    await expect(page).toHaveURL(/.*auth\/login.*/);
    
    // Login
    await helpers.fillField('[data-testid="login-email"]', testData.users.donor.email);
    await helpers.fillField('[data-testid="login-password"]', testData.users.donor.password);
    await helpers.clickElement('[data-testid="login-submit"]');
    
    // Should redirect back to intended page
    await page.waitForURL(/.*profile.*/, { timeout: 10000 });
  });

  test('should handle session expiry', async ({ page }) => {
    // Login first
    await helpers.login(testData.users.donor.email, testData.users.donor.password);
    
    // Mock session expiry by clearing storage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Try to access protected resource
    await helpers.navigateToPage('/profile');
    
    // Should redirect to login due to expired session
    await expect(page).toHaveURL(/.*auth\/login.*/);
  });

  test('should validate required fields', async ({ page }) => {
    await helpers.navigateToPage('/auth/register');
    
    // Try to submit empty form
    await helpers.clickElement('[data-testid="register-submit"]');
    
    // Should show validation errors for required fields
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="first-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="last-name-error"]')).toBeVisible();
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await helpers.navigateToPage('/auth/login');
    
    // Verify mobile-friendly login form
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    
    // Test mobile login
    await helpers.fillField('[data-testid="login-email"]', testData.users.donor.email);
    await helpers.fillField('[data-testid="login-password"]', testData.users.donor.password);
    await helpers.clickElement('[data-testid="login-submit"]');
    
    // Should work on mobile
    await page.waitForURL(/\/(dashboard|profile|\/)/, { timeout: 10000 });
    
    // Verify mobile user menu
    const mobileUserMenu = page.locator('[data-testid="mobile-user-menu"], [data-testid="user-avatar"]');
    await expect(mobileUserMenu).toBeVisible();
  });
});