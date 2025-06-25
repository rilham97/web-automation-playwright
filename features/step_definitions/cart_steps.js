/**
 * Screenplay Pattern Step Definitions for Cart 
 * BDD step implementations using the Screenplay Pattern
 * NOTE: Common steps moved to global_steps.js
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { 
  Click,
  AddToCart,
  Login,
  RemoveFromCart,
  RemoveFromCartOnDetail,
  NavigateToCart,
  NavigateToProductDetail,
  AddToCartFromDetail,
  Visibility,
  Ensure,
  CartBadge,
  CartItems,
  CurrentUrl,
  ProductDetailPage,
  ProductDetailButton
} from '../../src/screenplay/index.js';
// Removed unused imports: allure, ContentType, fs (Nuclear Option handles screenshot attachment)

// ==================== HELPER FUNCTIONS ====================

/**
 * Creates dynamic selectors for product buttons based on product name and button type
 * @param {string} productName - The name of the product
 * @param {string} buttonType - 'Add to cart' or 'Remove'
 * @returns {string} The CSS selector for the button
 */
function createButtonSelector(productName, buttonType) {
  const productId = productName.toLowerCase().replace(/\s+/g, '-');
  return buttonType === 'Remove' 
    ? `[data-test="remove-${productId}"]`
    : `[data-test="add-to-cart-${productId}"]`;
}

// Hard insert function removed - Nuclear Option handles screenshot attachment

// ==================== GIVEN Steps (Arrange) ====================

Given('{word} verifies the cart badge is not visible', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Ensure.that(CartBadge.isVisible()).isFalse()
  );
});

// ==================== WHEN Steps (Act) ====================

When('{word} adds {string} to the cart', async function (actorName, itemName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    AddToCart.theProduct(itemName)
  );
});

When('{word} removes {string} from the products page', async function (actorName, itemName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    RemoveFromCart.fromProducts(itemName)
  );
});

When('{word} removes {string} from the cart page', async function (actorName, itemName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    RemoveFromCart.fromCartPage(itemName)
  );
});

When('{word} navigates to the cart page', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    NavigateToCart.page()
  );
});

When('{word} logs out from the application', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Click.on('#react-burger-menu-btn'),
    Click.on('#logout_sidebar_link')
  );
});

When('{word} logs in again with the same credentials', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Login.withValidCredentials()
  );
});

When('{word} logs in with username {string} and password {string}', async function (actorName, username, password) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Login.withCredentials(username, password)
  );
});

// ==================== THEN Steps (Assert) ====================

Then('{word} should see the cart badge showing {string} items', async function (actorName, expectedCount) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Ensure.that(CartBadge.showsCount(expectedCount)).isTrue()
  );
});

// Consolidated with "should see the cart badge showing {string} items"

Then('{word} should see the cart badge is not visible', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Ensure.that(CartBadge.isVisible()).isFalse()
  );
});

// Consolidated with "should see the cart badge is not visible"

Then('{word} should see the {string} button changed to {string} for {string}', async function (actorName, oldButton, newButton, itemName) {
  const actor = await this.actorCalled(actorName);
  
  // Verify the new button is visible using helper function
  const newButtonSelector = createButtonSelector(itemName, newButton);
  await actor.attemptsTo(
    Ensure.that(Visibility.of(newButtonSelector)).isVisible()
  );
  
  // Verify the old button is not visible using helper function
  const oldButtonSelector = createButtonSelector(itemName, oldButton);
  await actor.attemptsTo(
    Ensure.that(Visibility.of(oldButtonSelector)).isNotVisible()
  );
});

// Consolidated with "should see the {string} button changed to {string} for {string}"

Then('{word} should see all added items showing {string} buttons instead of {string}', async function (actorName, expectedButton, _oldButton) { // eslint-disable-line no-unused-vars
  const actor = await this.actorCalled(actorName);
  
  // Get the products that were added from the test context (3 items scenario)
  const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
  
  // Check each product dynamically using helper function
  for (const productName of products) {
    const buttonSelector = createButtonSelector(productName, expectedButton);
    
    await actor.attemptsTo(
      Ensure.that(Visibility.of(buttonSelector)).isVisible()
    );
  }
});

Then('{word} should see {string} in the cart', async function (actorName, itemName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Ensure.that(CartItems.contains(itemName)).isTrue()
  );
});

Then('{word} should see {string} should not be visible in the cart', async function (actorName, itemName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Ensure.that(CartItems.contains(itemName)).isFalse()
  );
});

// Consolidated with "should see {string} in the cart"

Then('{word} should see the cart should be empty', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Ensure.that(CartItems.isEmpty()).isTrue()
  );
});

// Consolidated with "should see the cart should be empty"

Then('{word} is redirected to the products page', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Ensure.that(CurrentUrl.isInventoryPage()).isTrue()
  );
});

// Generic page navigation step moved to global_steps.js

// ==================== PRODUCT DETAIL PAGE STEPS ====================

When('{word} clicks on {string} product title', async function (actorName, productName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    NavigateToProductDetail.byClickingTitle(productName)
  );
});

Then('{word} should be on the product detail page for {string}', async function (actorName, productName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Ensure.that(ProductDetailPage.isVisibleFor(productName)).isTrue()
  );
});

When('{word} adds the product to cart from detail page', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Get the product name from the detail page  
  const productName = await actor.asks(ProductDetailPage.productName());
  
  await actor.attemptsTo(
    AddToCartFromDetail.product(productName)
  );
});

// ==================== PRODUCT DETAIL BUTTON STATE STEPS ====================

Then('{word} should see the {string} button on the product detail page', async function (actorName, expectedButton) {
  const actor = await this.actorCalled(actorName);
  
  if (expectedButton === 'Add to Cart') {
    await actor.attemptsTo(
      Ensure.that(ProductDetailButton.addToCartIsVisible()).isTrue()
    );
  } else if (expectedButton === 'Remove from Cart') {
    await actor.attemptsTo(
      Ensure.that(ProductDetailButton.removeFromCartIsVisible()).isTrue()
    );
  } else {
    throw new Error(`Unknown button type: ${expectedButton}`);
  }
});

Then('{word} should not see the {string} button on the product detail page', async function (actorName, buttonType) {
  const actor = await this.actorCalled(actorName);
  
  if (buttonType === 'Add to Cart') {
    await actor.attemptsTo(
      Ensure.that(ProductDetailButton.addToCartIsVisible()).isFalse()
    );
  } else if (buttonType === 'Remove from Cart') {
    await actor.attemptsTo(
      Ensure.that(ProductDetailButton.removeFromCartIsVisible()).isFalse()
    );
  } else {
    throw new Error(`Unknown button type: ${buttonType}`);
  }
});

When('{word} removes the product from cart on detail page', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    RemoveFromCartOnDetail.now()
  );
}); 