/**
 * Global Teardown for Playwright Tests
 * This file runs once after all tests complete
 */

async function globalTeardown(_config) { // eslint-disable-line no-unused-vars
  console.log('🧹 Starting global teardown...');
  
  // Add any cleanup logic here if needed
  // For example: database cleanup, file cleanup, etc.
  
  console.log('📊 Test execution summary:');
  console.log('   - Test results saved to: test-results/');
  console.log('   - Screenshots saved to: screenshots/');
  console.log('   - HTML report saved to: reports/html-report/');
  console.log('   - JSON report saved to: reports/test-results.json');
  console.log('   - JUnit report saved to: reports/junit.xml');
  
  console.log('✅ Global teardown completed successfully');
  console.log('🎯 Assessment tests execution finished!');
}

export default globalTeardown; 