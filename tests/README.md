# Playwright Testing Guide

This directory contains comprehensive end-to-end and integration tests for the charity application using Playwright.

## 📁 Test Structure

```
tests/
├── e2e/                    # End-to-end user journey tests
│   ├── homepage.spec.js    # Homepage functionality tests
│   ├── donation-flow.spec.js # Complete donation process tests
│   ├── user-authentication.spec.js # Login/register tests
│   └── charity-request.spec.js # Charity request form tests
├── integration/            # Integration and specialized tests
│   ├── api-integration.spec.js # API integration tests
│   ├── accessibility.spec.js # Accessibility compliance tests
│   └── performance.spec.js # Performance and optimization tests
├── fixtures/               # Test data and mocks
│   └── test-data.js       # Mock data for testing
├── utils/                  # Test utilities and helpers
│   └── test-helpers.js    # Common test functions
├── global-setup.js        # Global test setup
└── global-teardown.js     # Global test cleanup
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm install completed

### Installation
```bash
# Install Playwright browsers
npm run test:install

# Or install manually
npx playwright install
```

### Running Tests

#### Basic Commands
```bash
# Run all tests
npm test

# Run tests with browser UI
npm run test:headed

# Run tests in interactive mode
npm run test:ui

# Debug tests step by step
npm run test:debug
```

#### Browser-Specific Tests
```bash
# Run tests on specific browsers
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run mobile tests
npm run test:mobile
```

#### Test Categories
```bash
# Run only E2E tests
npm run test:e2e

# Run only integration tests
npm run test:integration

# Run performance tests
npm run test:performance

# Run accessibility tests
npm run test:accessibility
```

#### View Test Reports
```bash
# Show HTML test report
npm run test:report
```

## 📝 Test Categories

### 🎯 End-to-End Tests (E2E)

#### Homepage Tests (`homepage.spec.js`)
- ✅ Page loading and basic functionality
- ✅ Navigation menu functionality  
- ✅ Featured events display
- ✅ Responsive design on mobile
- ✅ SEO elements validation
- ✅ Error handling for network failures

#### Donation Flow Tests (`donation-flow.spec.js`)
- ✅ Complete one-time donation process
- ✅ Monthly recurring donation setup
- ✅ Anonymous donation handling
- ✅ Payment validation and error handling
- ✅ Form validation (amounts, email, etc.)
- ✅ Mobile donation experience
- ✅ Integration with Stripe payment processing

#### User Authentication Tests (`user-authentication.spec.js`)
- ✅ User registration with validation
- ✅ Login with email/password
- ✅ OAuth login (Google, Apple)
- ✅ Password reset flow
- ✅ Session persistence and logout
- ✅ Protected route access control
- ✅ Form validation and error handling

#### Charity Request Tests (`charity-request.spec.js`)
- ✅ Complete charity request submission
- ✅ Form validation (email, phone, URL formats)
- ✅ File upload validation
- ✅ Character limits and text validation
- ✅ Draft saving functionality
- ✅ Request status tracking
- ✅ Mobile form experience

### 🔗 Integration Tests

#### API Integration Tests (`api-integration.spec.js`)
- ✅ Events API with pagination
- ✅ Donation API integration
- ✅ Authentication API calls
- ✅ Error handling and retry logic
- ✅ Rate limiting responses
- ✅ Request/response validation
- ✅ CORS and network timeout handling

#### Accessibility Tests (`accessibility.spec.js`)
- ✅ Proper heading hierarchy
- ✅ Image alt text validation
- ✅ Form label associations
- ✅ Keyboard navigation support
- ✅ ARIA roles and states
- ✅ Color contrast verification
- ✅ Screen reader compatibility
- ✅ Focus management in modals

#### Performance Tests (`performance.spec.js`)
- ✅ Page load time optimization
- ✅ Core Web Vitals (LCP, FID, CLS)
- ✅ Image loading efficiency
- ✅ JavaScript bundle size analysis
- ✅ Network condition handling
- ✅ Memory usage monitoring
- ✅ API response time validation

## 🛠️ Test Utilities

### TestHelpers Class
The `TestHelpers` class provides common testing utilities:

```javascript
const helpers = new TestHelpers(page);

// Navigation
await helpers.navigateToPage('/donations');

// Form interactions
await helpers.fillField('[data-testid="email"]', 'test@example.com');
await helpers.clickElement('[data-testid="submit-button"]');

// API interactions
await helpers.waitForApiResponse('/api/events');
await helpers.mockApiResponse('/api/payments', mockData);

// Authentication
await helpers.login('user@test.com', 'password');
await helpers.logout();

// Screenshots and debugging
await helpers.takeScreenshot('error-state');
await helpers.checkResponsive();
```

### Test Data
Centralized test data in `fixtures/test-data.js`:

```javascript
const { testData } = require('../fixtures/test-data');

// Use predefined test data
await helpers.fillField('[data-testid="email"]', testData.users.donor.email);
await helpers.completeCheckout(testData.payments.validCard);
```

## 📊 CI/CD Integration

### GitHub Actions Workflow
Tests run automatically on:
- ✅ Push to main/develop branches
- ✅ Pull requests
- ✅ Multiple browser environments
- ✅ Mobile device testing
- ✅ Performance monitoring
- ✅ Accessibility compliance

### Test Reports
- HTML reports uploaded as artifacts
- Test results available for 30 days
- Screenshots on test failures
- Video recordings for debugging

## 🔧 Configuration

### Environment Variables
Create `.env.local` for testing:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### Playwright Configuration
Key settings in `playwright.config.js`:
- ✅ Multiple browser support
- ✅ Mobile device emulation
- ✅ Automatic screenshots on failure
- ✅ Video recording for debugging
- ✅ Parallel test execution
- ✅ Global setup/teardown

## 📋 Writing New Tests

### Test Structure Template
```javascript
const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../utils/test-helpers');
const { testData } = require('../fixtures/test-data');

test.describe('Feature Name', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    // Common setup
  });

  test('should perform specific action', async ({ page }) => {
    // Test implementation
    await helpers.navigateToPage('/feature');
    await expect(page.locator('h1')).toContainText('Expected Title');
  });
});
```

### Best Practices
1. **Use data-testid attributes** for reliable element selection
2. **Mock external APIs** for consistent test results
3. **Test both success and error scenarios**
4. **Include mobile responsiveness testing**
5. **Validate accessibility compliance**
6. **Monitor performance metrics**
7. **Use descriptive test names**
8. **Keep tests independent and isolated**

## 🐛 Debugging Tests

### Interactive Debugging
```bash
# Run tests in debug mode
npm run test:debug

# Run specific test file in debug mode
npx playwright test tests/e2e/homepage.spec.js --debug

# Run tests in headed mode to see browser
npm run test:headed
```

### Test Inspector
```bash
# Open Playwright Test Inspector
npm run test:ui
```

### Screenshots and Videos
- Screenshots automatically taken on failure
- Videos recorded for failed tests
- Available in `test-results/` directory

## 📈 Monitoring and Maintenance

### Regular Test Maintenance
- ✅ Update test data as application evolves
- ✅ Review and update selectors for UI changes
- ✅ Monitor test execution times
- ✅ Update browser versions regularly
- ✅ Review accessibility compliance
- ✅ Performance benchmark updates

### Test Metrics
Track key metrics:
- Test execution time
- Test reliability (flaky test detection)
- Coverage of user journeys
- Performance benchmark trends
- Accessibility compliance scores

## 🚨 Troubleshooting

### Common Issues

#### Test Timeouts
```bash
# Increase timeout in playwright.config.js
timeout: 30 * 1000, // 30 seconds
```

#### Element Not Found
- Verify data-testid attributes exist
- Check element visibility timing
- Use `waitFor()` methods appropriately

#### Network Issues
- Mock external APIs for reliability
- Handle rate limiting gracefully
- Test offline scenarios

#### Browser Installation
```bash
# Reinstall browsers
npx playwright install --force
```

For more detailed documentation, refer to the [Playwright Documentation](https://playwright.dev/docs/intro).