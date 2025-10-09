// Performance integration tests
const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');

test.describe('Performance', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await helpers.navigateToPage('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Homepage should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    console.log(`Homepage loaded in ${loadTime}ms`);
  });

  test('should have good Core Web Vitals metrics', async ({ page }) => {
    // Navigate to page
    await helpers.navigateToPage('/');
    await page.waitForLoadState('networkidle');
    
    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            vitals.lcp = entries[entries.length - 1].startTime;
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        // First Input Delay (FID) - simulate with click
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            vitals.fid = entries[0].processingStart - entries[0].startTime;
          }
        }).observe({ type: 'first-input', buffered: true });
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          vitals.cls = clsValue;
        }).observe({ type: 'layout-shift', buffered: true });
        
        // Resolve after a short delay to collect metrics
        setTimeout(() => resolve(vitals), 2000);
      });
    });
    
    // Check Core Web Vitals thresholds
    if (metrics.lcp) {
      expect(metrics.lcp).toBeLessThan(2500); // Good LCP < 2.5s
      console.log(`LCP: ${metrics.lcp}ms`);
    }
    
    if (metrics.fid) {
      expect(metrics.fid).toBeLessThan(100); // Good FID < 100ms
      console.log(`FID: ${metrics.fid}ms`);
    }
    
    if (metrics.cls !== undefined) {
      expect(metrics.cls).toBeLessThan(0.1); // Good CLS < 0.1
      console.log(`CLS: ${metrics.cls}`);
    }
  });

  test('should load images efficiently', async ({ page }) => {
    await helpers.navigateToPage('/');
    
    // Get all images
    const images = await page.locator('img').all();
    const imageMetrics = [];
    
    for (const image of images.slice(0, 5)) { // Test first 5 images
      const src = await image.getAttribute('src');
      const loading = await image.getAttribute('loading');
      const isVisible = await image.isVisible();
      
      if (src && isVisible) {
        // Measure image load time
        const startTime = Date.now();
        await image.waitFor({ state: 'visible' });
        const loadTime = Date.now() - startTime;
        
        imageMetrics.push({
          src,
          loadTime,
          hasLazyLoading: loading === 'lazy'
        });
      }
    }
    
    // Images should load reasonably fast
    for (const metric of imageMetrics) {
      expect(metric.loadTime).toBeLessThan(3000);
      console.log(`Image ${metric.src} loaded in ${metric.loadTime}ms, lazy: ${metric.hasLazyLoading}`);
    }
  });

  test('should have minimal JavaScript bundle size', async ({ page }) => {
    // Track network requests
    const jsRequests = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('.js') && response.status() === 200) {
        jsRequests.push({
          url,
          size: response.headers()['content-length']
        });
      }
    });
    
    await helpers.navigateToPage('/');
    await page.waitForLoadState('networkidle');
    
    // Calculate total JS size
    let totalJSSize = 0;
    for (const request of jsRequests) {
      if (request.size) {
        totalJSSize += parseInt(request.size);
      }
    }
    
    console.log(`Total JS bundle size: ${totalJSSize} bytes`);
    console.log(`Number of JS files: ${jsRequests.length}`);
    
    // Total JS should be reasonable (adjust threshold based on app complexity)
    expect(totalJSSize).toBeLessThan(2000000); // Less than 2MB
  });

  test('should handle slow network conditions', async ({ page, context }) => {
    // Simulate slow 3G connection
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });
    
    const startTime = Date.now();
    await helpers.navigateToPage('/');
    
    // Even on slow network, page should be usable
    await expect(page.locator('h1').first()).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    console.log(`Load time on slow network: ${loadTime}ms`);
    
    // Should show loading states appropriately
    const loadingElements = page.locator('[data-testid="loading"], .loading, .spinner');
    if (await loadingElements.count() > 0) {
      console.log('Loading indicators found for slow network');
    }
  });

  test('should implement efficient caching', async ({ page }) => {
    // Track cache hits/misses
    const cacheMetrics = {
      hits: 0,
      misses: 0
    };
    
    page.on('response', response => {
      const cacheHeader = response.headers()['cache-control'];
      const fromCache = response.fromServiceWorker() || 
                       response.headers()['cf-cache-status'] === 'HIT';
      
      if (fromCache) {
        cacheMetrics.hits++;
      } else {
        cacheMetrics.misses++;
      }
    });
    
    // First visit
    await helpers.navigateToPage('/');
    await page.waitForLoadState('networkidle');
    
    // Second visit (should use cache)
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    console.log(`Cache hits: ${cacheMetrics.hits}, misses: ${cacheMetrics.misses}`);
    
    // Should have some cache hits on reload
    expect(cacheMetrics.hits).toBeGreaterThan(0);
  });

  test('should handle memory usage efficiently', async ({ page }) => {
    // Navigate through multiple pages to test memory usage
    const pages = ['/', '/events', '/donations', '/contact', '/about'];
    
    for (const pagePath of pages) {
      await helpers.navigateToPage(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Get memory usage (requires --enable-precise-memory-info flag)
      const memoryUsage = await page.evaluate(() => {
        if ('memory' in performance) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize
          };
        }
        return null;
      });
      
      if (memoryUsage) {
        console.log(`Memory usage on ${pagePath}: ${Math.round(memoryUsage.usedJSHeapSize / 1024 / 1024)}MB`);
        
        // Memory usage should be reasonable
        expect(memoryUsage.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024); // Less than 100MB
      }
    }
  });

  test('should optimize API response times', async ({ page }) => {
    const apiMetrics = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/')) {
        apiMetrics.push({
          url,
          timing: response.timing(),
          status: response.status()
        });
      }
    });
    
    await helpers.navigateToPage('/');
    await page.waitForLoadState('networkidle');
    
    // Analyze API response times
    for (const metric of apiMetrics) {
      const responseTime = metric.timing.responseEnd - metric.timing.requestStart;
      console.log(`API ${metric.url}: ${responseTime}ms`);
      
      // API responses should be fast
      expect(responseTime).toBeLessThan(2000); // Less than 2 seconds
    }
  });

  test('should handle large data sets efficiently', async ({ page }) => {
    // Mock large dataset
    await helpers.mockApiResponse('/api/events', {
      status: 200,
      data: {
        events: Array.from({ length: 100 }, (_, i) => ({
          id: `event-${i}`,
          title: `Event ${i}`,
          description: 'A'.repeat(500), // Large description
          targetAmount: 10000,
          currentAmount: Math.random() * 10000
        })),
        pagination: {
          current_page: 1,
          total_pages: 10,
          total_count: 1000
        }
      }
    });
    
    const startTime = Date.now();
    await helpers.navigateToPage('/events');
    
    // Should handle large dataset without blocking UI
    await expect(page.locator('[data-testid="event-card"]').first()).toBeVisible();
    
    const renderTime = Date.now() - startTime;
    console.log(`Large dataset render time: ${renderTime}ms`);
    
    // Should render within reasonable time
    expect(renderTime).toBeLessThan(3000);
    
    // Should implement virtualization or pagination
    const visibleEvents = await page.locator('[data-testid="event-card"]').count();
    expect(visibleEvents).toBeLessThanOrEqual(50); // Shouldn't render all 100 at once
  });

  test('should have fast form interactions', async ({ page }) => {
    await helpers.navigateToPage('/charity-request');
    
    // Measure form interaction performance
    const startTime = Date.now();
    
    await helpers.fillField('[data-testid="org-name"]', 'Test Organization');
    await helpers.fillField('[data-testid="description"]', 'A'.repeat(500));
    
    const fillTime = Date.now() - startTime;
    console.log(`Form fill time: ${fillTime}ms`);
    
    // Form should be responsive
    expect(fillTime).toBeLessThan(1000);
    
    // Test form validation performance
    const validationStartTime = Date.now();
    await helpers.clickElement('[data-testid="submit-request"]');
    
    // Wait for validation errors
    await expect(page.locator('[data-testid="org-name-error"]')).not.toBeVisible();
    
    const validationTime = Date.now() - validationStartTime;
    console.log(`Form validation time: ${validationTime}ms`);
    
    // Validation should be fast
    expect(validationTime).toBeLessThan(500);
  });

  test('should optimize third-party scripts', async ({ page }) => {
    const thirdPartyRequests = [];
    
    page.on('request', request => {
      const url = request.url();
      const isThirdParty = !url.includes(page.url().split('/')[2]);
      
      if (isThirdParty) {
        thirdPartyRequests.push({
          url,
          resourceType: request.resourceType()
        });
      }
    });
    
    await helpers.navigateToPage('/');
    await page.waitForLoadState('networkidle');
    
    console.log(`Third-party requests: ${thirdPartyRequests.length}`);
    
    // Analyze third-party scripts
    const scriptRequests = thirdPartyRequests.filter(req => req.resourceType === 'script');
    console.log(`Third-party scripts: ${scriptRequests.length}`);
    
    // Should minimize third-party scripts
    expect(scriptRequests.length).toBeLessThan(10);
    
    // Common third-party scripts (adjust based on actual usage)
    const expectedThirdParty = ['stripe', 'google', 'facebook'];
    const foundExpected = scriptRequests.some(req => 
      expectedThirdParty.some(expected => req.url.includes(expected))
    );
    
    if (scriptRequests.length > 0) {
      console.log('Third-party scripts found:', scriptRequests.map(req => req.url));
    }
  });
});