import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, expect } from '@playwright/test';

// Simple step definitions without Screenplay pattern
// Using direct Playwright API for basic functionality testing

Given('I am on the SauceDemo website', async function () {
  console.log('🚀 [Simple Steps] Starting browser...');
  
  // Launch browser directly
  this.browser = await chromium.launch({ 
    headless: process.env.HEADLESS === 'true' || true,
    slowMo: 100 
  });
  
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  
  console.log('🌐 [Simple Steps] Navigating to SauceDemo...');
  await this.page.goto('https://www.saucedemo.com');
  
  console.log('✅ [Simple Steps] Successfully navigated to SauceDemo');
});

When('I check the page title', async function () {
  console.log('🔍 [Simple Steps] Checking page title...');
  this.pageTitle = await this.page.title();
  console.log(`📄 [Simple Steps] Page title: '${this.pageTitle}'`);
});

Then('the title should contain {string}', async function (expectedText) {
  console.log(`✅ [Simple Steps] Verifying title contains: '${expectedText}'`);
  expect(this.pageTitle).toContain(expectedText);
  console.log('✅ [Simple Steps] Title verification passed');
});

When('I enter username {string}', async function (username) {
  console.log(`👤 [Simple Steps] Entering username: '${username}'`);
  await this.page.fill('[data-test="username"]', username);
  console.log('✅ [Simple Steps] Username entered successfully');
});

When('I enter password {string}', async function (password) {
  console.log(`🔐 [Simple Steps] Entering password: '${password}'`);
  await this.page.fill('[data-test="password"]', password);
  console.log('✅ [Simple Steps] Password entered successfully');
});

When('I click the login button', async function () {
  console.log('🖱️ [Simple Steps] Clicking login button...');
  await this.page.click('[data-test="login-button"]');
  console.log('✅ [Simple Steps] Login button clicked');
});

Then('I should see the products page', async function () {
  console.log('🏪 [Simple Steps] Verifying products page...');
  
  // Wait for products page to load
  await this.page.waitForSelector('.inventory_list', { timeout: 10000 });
  
  // Check URL contains inventory
  const currentUrl = this.page.url();
  console.log(`🔗 [Simple Steps] Current URL: '${currentUrl}'`);
  expect(currentUrl).toContain('inventory.html');
  
  // Check products are visible
  const productsCount = await this.page.locator('.inventory_item').count();
  console.log(`📦 [Simple Steps] Products found: ${productsCount}`);
  expect(productsCount).toBeGreaterThan(0);
  
  console.log('✅ [Simple Steps] Products page verification passed');
  
  // Clean up: Close browser
  if (this.browser) {
    console.log('🧹 [Simple Steps] Cleaning up browser...');
    await this.browser.close();
    console.log('✅ [Simple Steps] Browser closed successfully');
  }
}); 