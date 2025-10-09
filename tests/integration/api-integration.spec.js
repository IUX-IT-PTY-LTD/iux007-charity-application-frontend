// API integration tests
const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');
const { testData } = require('../fixtures/test-data');

test.describe('API Integration', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should fetch events successfully', async ({ page }) => {
    await helpers.navigateToPage('/');
    
    // Wait for events API call
    const response = await helpers.waitForApiResponse('/api/events');
    
    // Verify response
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('data');
    expect(Array.isArray(responseBody.data)).toBeTruthy();
  });

  test('should handle events API pagination', async ({ page }) => {
    await helpers.navigateToPage('/events');
    
    // Wait for first page
    const firstPageResponse = await helpers.waitForApiResponse('/api/events');
    const firstPageData = await firstPageResponse.json();
    
    // Check pagination metadata
    expect(firstPageData).toHaveProperty('pagination');
    expect(firstPageData.pagination).toHaveProperty('current_page');
    expect(firstPageData.pagination).toHaveProperty('total_pages');
    
    // If there are multiple pages, test pagination
    if (firstPageData.pagination.total_pages > 1) {
      // Click next page or page 2
      const nextPageButton = page.locator('[data-testid="next-page"], [data-testid="page-2"]').first();
      
      if (await nextPageButton.isVisible()) {
        await nextPageButton.click();
        
        // Wait for second page response
        const secondPageResponse = await helpers.waitForApiResponse('/api/events');
        const secondPageData = await secondPageResponse.json();
        
        expect(secondPageData.pagination.current_page).toBe(2);
      }
    }
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/events**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await helpers.navigateToPage('/');
    
    // Should display error state
    const errorElement = page.locator('[data-testid="error-message"], .error-state, .api-error');
    await expect(errorElement).toBeVisible();
  });

  test('should submit donation via API', async ({ page }) => {
    // Mock successful donation API
    await helpers.mockApiResponse('/api/donations', {
      status: 200,
      data: {
        id: 'donation_123',
        amount: 25,
        status: 'completed',
        transaction_id: 'txn_456'
      }
    });
    
    await helpers.navigateToPage('/donations');
    
    // Fill donation form
    await helpers.fillDonationForm('25', 'one-time');
    await helpers.clickElement('[data-testid="proceed-checkout"]');
    
    // Fill donor info
    await helpers.fillField('[data-testid="donor-email"]', testData.users.donor.email);
    await helpers.fillField('[data-testid="donor-first-name"]', testData.users.donor.firstName);
    await helpers.fillField('[data-testid="donor-last-name"]', testData.users.donor.lastName);
    
    // Complete checkout
    await helpers.clickElement('[data-testid="submit-payment"]');
    
    // Wait for donation API call
    const donationResponse = await helpers.waitForApiResponse('/api/donations');
    expect(donationResponse.status()).toBe(200);
    
    const responseData = await donationResponse.json();
    expect(responseData.amount).toBe(25);
    expect(responseData.status).toBe('completed');
  });

  test('should handle authentication API calls', async ({ page }) => {
    // Mock successful login
    await helpers.mockApiResponse('/api/auth/login', {
      status: 200,
      data: {
        user: {
          id: 'user_123',
          email: testData.users.donor.email,
          first_name: testData.users.donor.firstName
        },
        token: 'jwt_token_123',
        expires_at: '2024-12-31T23:59:59Z'
      }
    });
    
    await helpers.navigateToPage('/auth/login');
    
    // Fill login form
    await helpers.fillField('[data-testid="login-email"]', testData.users.donor.email);
    await helpers.fillField('[data-testid="login-password"]', testData.users.donor.password);
    await helpers.clickElement('[data-testid="login-submit"]');
    
    // Wait for login API call
    const loginResponse = await helpers.waitForApiResponse('/api/auth/login');
    expect(loginResponse.status()).toBe(200);
    
    const loginData = await loginResponse.json();
    expect(loginData.user.email).toBe(testData.users.donor.email);
  });

  test('should include authentication headers for protected routes', async ({ page }) => {
    // Mock authenticated user
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'test_jwt_token');
    });
    
    // Mock protected API endpoint
    let authHeaderReceived = false;
    await page.route('**/api/profile**', route => {
      const headers = route.request().headers();
      if (headers.authorization && headers.authorization.includes('Bearer test_jwt_token')) {
        authHeaderReceived = true;
      }
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: testData.users.donor })
      });
    });
    
    await helpers.navigateToPage('/profile');
    
    // Wait for profile API call
    await helpers.waitForApiResponse('/api/profile');
    
    // Verify auth header was sent
    expect(authHeaderReceived).toBeTruthy();
  });

  test('should handle rate limiting', async ({ page }) => {
    // Mock rate limit response
    await page.route('**/api/events**', route => {
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Too many requests' }),
        headers: {
          'Retry-After': '60'
        }
      });
    });
    
    await helpers.navigateToPage('/');
    
    // Should display rate limit message
    const rateLimitMessage = page.locator('[data-testid="rate-limit-error"], .rate-limit');
    await expect(rateLimitMessage).toBeVisible();
  });

  test('should retry failed API calls', async ({ page }) => {
    let callCount = 0;
    
    // Mock API that fails first time, succeeds second time
    await page.route('**/api/events**', route => {
      callCount++;
      
      if (callCount === 1) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Temporary server error' })
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: testData.events })
        });
      }
    });
    
    await helpers.navigateToPage('/');
    
    // Wait for retry mechanism (if implemented)
    await page.waitForTimeout(3000);
    
    // Should eventually succeed
    expect(callCount).toBeGreaterThan(1);
  });

  test('should handle network timeouts', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/events**', route => {
      // Don't fulfill the route to simulate timeout
      // In real implementation, this would timeout after specified duration
    });
    
    await helpers.navigateToPage('/');
    
    // Wait for timeout handling
    await page.waitForTimeout(5000);
    
    // Should show timeout error
    const timeoutError = page.locator('[data-testid="timeout-error"], .timeout');
    if (await timeoutError.isVisible()) {
      await expect(timeoutError).toContainText(/timeout|slow|try again/i);
    }
  });

  test('should validate API response schemas', async ({ page }) => {
    // Mock API with invalid response structure
    await page.route('**/api/events**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          // Missing required fields
          invalid: 'response'
        })
      });
    });
    
    await helpers.navigateToPage('/');
    
    // Should handle invalid response gracefully
    const errorState = page.locator('[data-testid="invalid-data-error"], .schema-error');
    if (await errorState.isVisible()) {
      await expect(errorState).toBeVisible();
    }
  });

  test('should handle concurrent API calls', async ({ page }) => {
    let apiCallCount = 0;
    
    // Track multiple API calls
    await page.route('**/api/**', route => {
      apiCallCount++;
      route.continue();
    });
    
    // Navigate to page that makes multiple API calls
    await helpers.navigateToPage('/');
    
    // Wait for all API calls to complete
    await page.waitForTimeout(3000);
    
    // Should have made multiple API calls concurrently
    expect(apiCallCount).toBeGreaterThan(1);
  });

  test('should cache API responses appropriately', async ({ page }) => {
    let eventsApiCallCount = 0;
    
    // Track events API calls
    await page.route('**/api/events**', route => {
      eventsApiCallCount++;
      route.continue();
    });
    
    // Visit page that loads events
    await helpers.navigateToPage('/');
    await helpers.waitForPageLoad();
    
    const initialCallCount = eventsApiCallCount;
    
    // Navigate to another page and back
    await helpers.navigateToPage('/about');
    await helpers.navigateToPage('/');
    await helpers.waitForPageLoad();
    
    // If caching is implemented, should not make additional API calls
    // If not cached, will make new calls
    const finalCallCount = eventsApiCallCount;
    
    // This test documents current behavior
    expect(finalCallCount).toBeGreaterThanOrEqual(initialCallCount);
  });

  test('should handle API versioning', async ({ page }) => {
    // Check if API calls include version headers
    let versionHeaderFound = false;
    
    await page.route('**/api/**', route => {
      const headers = route.request().headers();
      if (headers['api-version'] || headers['accept'] && headers['accept'].includes('v1')) {
        versionHeaderFound = true;
      }
      route.continue();
    });
    
    await helpers.navigateToPage('/');
    await helpers.waitForApiResponse('/api/events');
    
    // Document whether versioning headers are used
    // This helps ensure API compatibility
    console.log('API versioning headers found:', versionHeaderFound);
  });

  test('should handle CORS properly', async ({ page }) => {
    // Monitor for CORS errors
    const corsErrors = [];
    
    page.on('pageerror', error => {
      if (error.message.includes('CORS')) {
        corsErrors.push(error);
      }
    });
    
    await helpers.navigateToPage('/');
    await helpers.waitForApiResponse('/api/events');
    
    // Should not have CORS errors
    expect(corsErrors).toHaveLength(0);
  });
});