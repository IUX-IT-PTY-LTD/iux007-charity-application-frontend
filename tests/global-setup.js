// Global setup for Playwright tests
const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('🚀 Starting global test setup...');
  
  // Get the base URL
  const baseURL = config?.use?.baseURL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  console.log(`⏳ Checking if server is available at ${baseURL}...`);
  
  // First, check if server is available with a simple fetch
  try {
    const response = await fetch(baseURL, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000) // 5 second timeout for initial check
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    
    console.log('✅ Server is available, proceeding with browser setup...');
    
  } catch (fetchError) {
    console.error('❌ Server is not available!');
    console.log('\n📋 To fix this issue:');
    console.log('1. Start your development server in another terminal:');
    console.log('   npm run dev');
    console.log('2. Wait for the server to start (usually takes 10-30 seconds)');
    console.log('3. Verify it\'s running by visiting http://localhost:3000 in your browser');
    console.log('4. Then run your tests again\n');
    
    // Don't throw error immediately, let the webServer option in playwright.config.js handle it
    console.log('💡 If you have webServer configured in playwright.config.js, it will start automatically');
    return;
  }
  
  // Create a browser instance for additional setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Quick verification that the page loads
    await page.goto(baseURL, { 
      waitUntil: 'domcontentloaded', // Less strict than networkidle
      timeout: 15000 // Shorter timeout since we already checked server availability
    });
    
    console.log('✅ Browser can access the application successfully!');
    
    // You can add any global setup tasks here:
    // - Create test data
    // - Set up authentication tokens
    // - Initialize database state
    
  } catch (error) {
    console.error('❌ Browser setup failed:', error.message);
    // Don't throw here since the webServer might handle it
  } finally {
    await browser.close();
  }
}

module.exports = globalSetup;