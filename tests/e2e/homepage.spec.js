// Homepage E2E tests
const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');

test.describe('Homepage', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.navigateToPage('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check if page loads without errors
    await expect(page).toHaveTitle(/Charity/i);
    
    // Check for key elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    const heroSection = page.locator('[data-testid="hero-section"], .hero, section:first-of-type');
    await expect(heroSection).toBeVisible();
    
    // Check for hero content
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).not.toBeEmpty();
  });

  test('should display featured events', async ({ page }) => {
    // Wait for events to load
    await helpers.waitForApiResponse('/api/events');
    
    const eventsSection = page.locator('[data-testid="featured-events"], [data-testid="events-list"]');
    await expect(eventsSection).toBeVisible();
    
    // Check if at least one event is displayed
    const eventCards = page.locator('[data-testid="event-card"]');
    await expect(eventCards.first()).toBeVisible();
  });

  test('should navigate to events page', async ({ page }) => {
    // Click on "View All Events" or similar button
    const viewAllButton = page.locator('[data-testid="view-all-events"], a[href*="/events"], a:has-text("View All")').first();
    await viewAllButton.click();
    
    // Should navigate to events page
    await expect(page).toHaveURL(/.*events.*/);
  });

  test('should navigate to individual event', async ({ page }) => {
    // Wait for events to load
    await helpers.waitForApiResponse('/api/events');
    
    // Click on first event card
    const firstEventCard = page.locator('[data-testid="event-card"]').first();
    await firstEventCard.click();
    
    // Should navigate to event details page
    await expect(page).toHaveURL(/.*event-details.*/);
  });

  test('should have working navigation menu', async ({ page }) => {
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
    
    // Test main navigation links
    const navLinks = [
      { text: 'Home', expectedUrl: '/' },
      { text: 'Events', expectedUrl: '/events' },
      { text: 'About', expectedUrl: '/about' },
      { text: 'Contact', expectedUrl: '/contact' }
    ];
    
    for (const link of navLinks) {
      const navLink = page.locator(`nav a:has-text("${link.text}")`).first();
      if (await navLink.isVisible()) {
        await navLink.click();
        await expect(page).toHaveURL(new RegExp(`.*${link.expectedUrl}.*`));
        await helpers.navigateToPage('/'); // Return to homepage
      }
    }
  });

  test('should display donation call-to-action', async ({ page }) => {
    const donateButton = page.locator('[data-testid="donate-now"], a:has-text("Donate"), button:has-text("Donate")').first();
    await expect(donateButton).toBeVisible();
    
    // Click donate button
    await donateButton.click();
    
    // Should navigate to donations page or open donation modal
    await Promise.race([
      expect(page).toHaveURL(/.*donations.*/),
      expect(page.locator('[data-testid="donation-modal"]')).toBeVisible()
    ]);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await helpers.waitForPageLoad();
    
    // Check if mobile menu exists
    const mobileMenuButton = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"]').first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Check if mobile menu opens
      const mobileMenu = page.locator('[data-testid="mobile-menu-content"], .mobile-menu');
      await expect(mobileMenu).toBeVisible();
    }
    
    // Check if content is still visible and readable
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('[data-testid="event-card"]').first()).toBeVisible();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const jsErrors = [];
    
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    await helpers.navigateToPage('/');
    await helpers.waitForPageLoad();
    
    // Check for console errors
    expect(jsErrors).toEqual([]);
  });

  test('should have proper SEO elements', async ({ page }) => {
    // Check meta tags
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    
    // Check if title is meaningful
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.toLowerCase()).toContain('charity');
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Mock network failure for events API
    await page.route('**/api/events**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    await helpers.navigateToPage('/');
    
    // Should show error state or fallback content
    const errorMessage = page.locator('[data-testid="error-message"], .error, .fallback');
    const loadingSpinner = page.locator('[data-testid="loading"], .loading, .spinner');
    
    // Wait a bit for the error state to appear
    await page.waitForTimeout(2000);
    
    // Either error message should be visible or events should still be loading
    await expect(
      errorMessage.or(loadingSpinner).or(page.locator('text=No events available'))
    ).toBeVisible();
  });
});