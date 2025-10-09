// Global teardown for Playwright tests
async function globalTeardown(config) {
  console.log('🧹 Starting global test teardown...');
  
  try {
    // Add any cleanup tasks here:
    // - Clean up test data
    // - Reset database state
    // - Clear temporary files
    
    console.log('✅ Global teardown completed successfully!');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw here to avoid masking test failures
  }
}

module.exports = globalTeardown;