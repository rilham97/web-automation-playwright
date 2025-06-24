// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for SauceDemo Assessment Project
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // Test directory
  testDir: '.',
  
  // Global setup and teardown files
  globalSetup: require.resolve('./src/utils/global-setup.js'),
  globalTeardown: require.resolve('./src/utils/global-teardown.js'),
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use - Allure for beautiful HTML reports
  reporter: [
    ['line'], // Console output for immediate feedback
    ['allure-playwright', { 
      resultsDir: 'allure-results',
      environmentInfo: {
        os_platform: require('os').platform(),
        os_release: require('os').release(),
        node_version: process.version,
        framework: 'Playwright + Cucumber BDD',
        browser: 'Chrome/Chromium',
        base_url: 'https://www.saucedemo.com'
      }
    }]
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'https://www.saucedemo.com',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Global timeout for each action (e.g., click, fill, etc.)
    actionTimeout: 30000,
    
    // Global timeout for navigation actions
    navigationTimeout: 30000,
    
    // Browser viewport
    viewport: { width: 1280, height: 720 }
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Headless is the default - can be overridden with --headed flag
        headless: true
      },
    },
    {
      name: 'chromium-headed', 
      use: { 
        ...devices['Desktop Chrome'],
        headless: false,
        slowMo: 500  // Slow down for better visibility when headed
      },
    }
  ],

  // Output directories
  outputDir: 'test-results/',
  
  // Timeout for each test
  timeout: 60000,
  
  // Expect timeout for assertions
  expect: {
    timeout: 10000,
    // Screenshot comparison options
    toHaveScreenshot: {
      threshold: 0.3
    }
  },

  // Web Server - uncomment if you need to start a local server
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
}); 