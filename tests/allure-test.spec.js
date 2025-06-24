// @ts-check
const { test, expect } = require('@playwright/test');
const { URLS } = require('../src/constants/urls');

test.describe('Allure Reporting Test', () => {
  test('should login successfully', async ({ page }) => {
    // Navigate to the login page
    await page.goto(URLS.BASE);
    
    // Fill in login form
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    
    // Click login button
    await page.click('#login-button');
    
    // Verify successful login
    await expect(page).toHaveURL(URLS.INVENTORY);
    await expect(page.locator('.title')).toHaveText('Products');
  });
}); 