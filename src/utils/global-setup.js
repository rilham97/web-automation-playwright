import fs from 'fs';
import path from 'path';

/**
 * Global Setup for Playwright Tests
 * This file runs once before all tests start
 */

async function globalSetup(_config) { // eslint-disable-line no-unused-vars
  console.log('🚀 Starting Playwright Assessment Tests...');
  console.log('📋 Target Application: SauceDemo (https://www.saucedemo.com)');
  console.log('🧪 Test Framework: Playwright with Cucumber BDD');
  console.log('🎭 Design Pattern: Screenplay Pattern');
  
  // Create necessary directories if they don't exist
  const directories = [
    'test-results',
    'screenshots',
    'reports',
    'reports/html-report'
  ];
  
  directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
  
  console.log('✅ Global setup completed successfully');
}

export default globalSetup; 