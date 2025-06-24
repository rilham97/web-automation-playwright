/**
 * Global Step Definitions - Generic Interactions Only
 * Contains only truly generic steps that can be reused across ALL features
 * Feature-specific steps should remain in their respective feature files
 */

import { When, Then } from '@cucumber/cucumber';
import { 
  Click,
  Text,
  Visibility,
  Ensure,
  CurrentUrl
} from '../../src/screenplay/index.js';

// ====================================
// GENERIC CLICK INTERACTIONS
// ====================================

/**
 * Generic button click handler - works for any button text
 */
When('{word} clicks {string}', async function (actorName, buttonText) {
  const actor = await this.actorCalled(actorName);
  
  // Handle different button texts with common selectors
  let selector;
  switch (buttonText) {
  case 'Continue Shopping':
    selector = '[data-test="continue-shopping"]';
    break;
  case 'Back to products':
    selector = '[data-test="back-to-products"]';
    break;
  case 'Continue':
    selector = '[data-test="continue"]';
    break;
  case 'Finish':
    selector = '[data-test="finish"]';
    break;
  case 'Cancel':
    selector = '[data-test="cancel"]';
    break;
  case 'Checkout':
    selector = '[data-test="checkout"]';
    break;
  default:
    // Try data-test attribute first, then fallback to text
    selector = `[data-test="${buttonText.toLowerCase().replace(/\s+/g, '-')}"]`;
    if (!(await actor.asks(Visibility.of(selector)))) {
      selector = `text="${buttonText}"`;
    }
    break;
  }
  
  await actor.attemptsTo(
    Click.on(selector)
  );
});

/**
 * Generic button click with data-test attribute
 */
When('{word} clicks the {string} button', async function (actorName, buttonText) {
  const actor = await this.actorCalled(actorName);
  
  // Convert button text to data-test format
  const dataTestValue = buttonText.toLowerCase().replace(/\s+/g, '-');
  const selector = `[data-test="${dataTestValue}"]`;
  
  await actor.attemptsTo(
    Click.on(selector)
  );
});

// ====================================
// GENERIC PAGE NAVIGATION VALIDATION
// ====================================

/**
 * Generic page validation - works for any page by checking URL or header
 */
Then('{word} should be on the {string} page', async function (actorName, expectedPage) {
  const actor = await this.actorCalled(actorName);
  
  switch (expectedPage.toLowerCase()) {
  case 'products':
  case 'inventory': {
    await actor.attemptsTo(Ensure.that(CurrentUrl.isInventoryPage()).isTrue());
    break;
  }
  case 'login': {
    await actor.attemptsTo(Ensure.that(CurrentUrl.isLoginPage()).isTrue());
    break;
  }
  case 'cart':
  case 'shopping cart': {
    await actor.attemptsTo(Ensure.that(CurrentUrl.isCartPage()).isTrue());
    break;
  }
  default: {
    // For checkout pages and other pages, check the page header
    const pageHeaderText = await actor.asks(Text.of('.title'));
    await actor.attemptsTo(Ensure.that(pageHeaderText).contains(expectedPage));
    break;
  }
  }
});

/**
 * Specific step for unquoted "products page" from feature files
 */
Then('{word} should be on the products page', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(CurrentUrl.isInventoryPage()).isTrue());
});

// ====================================
// GENERIC ERROR MESSAGE VALIDATION
// ====================================

/**
 * Generic error message visibility check
 */
Then('{word} should see an error message', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(
    Ensure.that(Visibility.of('[data-test="error"]')).isVisible()
  );
});

/**
 * Generic error message content validation
 */
Then('{word} should see the error message {string}', async function (actorName, expectedMessage) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(
    Ensure.that(Text.of('[data-test="error"]')).contains(expectedMessage)
  );
});

/**
 * Generic error message validation for checkout/form errors
 */
Then('{word} should see a checkout error message containing {string}', async function (actorName, expectedError) {
  const actor = await this.actorCalled(actorName);
  // Check for checkout-specific error container or fallback to generic error
  const errorSelector = '[data-test="error"], .error-message-container, .error';
  await actor.attemptsTo(
    Ensure.that(Text.of(errorSelector)).contains(expectedError)
  );
});

// ====================================
// GENERIC WAITING/TIMING UTILITIES
// ====================================

/**
 * Generic wait for UI updates (useful after any interaction)
 */
When('{word} waits for the cart badge to update', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  // Wait for UI to update after cart interaction
  const { BrowseTheWeb } = await import('../../src/screenplay/abilities/BrowseTheWeb.js');
  const browseTheWeb = actor.abilityTo(BrowseTheWeb);
  const page = browseTheWeb.currentPage();
  await page.waitForTimeout(1000);
});

/**
 * Generic wait for any element to update
 */
When('{word} waits for {string} to update', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  // Generic wait for any UI element to update
  const { BrowseTheWeb } = await import('../../src/screenplay/abilities/BrowseTheWeb.js');
  const browseTheWeb = actor.abilityTo(BrowseTheWeb);
  const page = browseTheWeb.currentPage();
  await page.waitForTimeout(1000);
});

// ====================================
// GENERIC VISIBILITY CHECKS
// ====================================

/**
 * Generic visibility check for any element
 */
Then('{word} should see {string} is visible', async function (actorName, elementDescription) {
  const actor = await this.actorCalled(actorName);
  // Convert description to a likely selector
  const selector = `[data-test="${elementDescription.toLowerCase().replace(/\s+/g, '-')}"]`;
  await actor.attemptsTo(
    Ensure.that(Visibility.of(selector)).isVisible()
  );
});

/**
 * Generic visibility check for any element (negative)
 */
Then('{word} should not see {string}', async function (actorName, elementDescription) {
  const actor = await this.actorCalled(actorName);
  // Convert description to a likely selector
  const selector = `[data-test="${elementDescription.toLowerCase().replace(/\s+/g, '-')}"]`;
  await actor.attemptsTo(
    Ensure.that(Visibility.of(selector)).isNotVisible()
  );
}); 