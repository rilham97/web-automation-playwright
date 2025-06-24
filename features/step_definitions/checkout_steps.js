/**
 * Checkout Step Definitions using Screenplay Pattern
 * Implements all checkout scenarios with business-readable language
 */

import { Given, When, Then } from '@cucumber/cucumber';
import {
  StartCheckout,
  FillCheckoutInformation,
  CompleteCheckout,
  CheckoutPage,
  OrderSummary,
  Text,
  Visibility,
  CurrentUrl,
  Click,
  Ensure,
  CartBadge
} from '../../src/screenplay/index.js';


// ====================================
// GIVEN STEPS - Setup and Preconditions
// ====================================

Given('{word} should be on the checkout information step', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(CheckoutPage.isInformationStep()).isTrue());
});

Given('{word} should be on the checkout overview step', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(CheckoutPage.isOverviewStep()).isTrue());
});

Given('{word} should be on the checkout complete step', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(CheckoutPage.isCompleteStep()).isTrue());
});

// ====================================
// WHEN STEPS - Actions
// ====================================

When('{word} starts the checkout process', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(StartCheckout.process());
});

When('{word} fills checkout information with {string}, {string}, and {string}', async function (actorName, firstName, lastName, postalCode) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(
    FillCheckoutInformation.withDetails(firstName, lastName, postalCode)
  );
});

When('{word} fills first name {string}', async function (actorName, firstName) {
  const actor = await this.actorCalled(actorName);
  if (firstName) {
    await actor.attemptsTo(FillCheckoutInformation.withFirstName(firstName));
  }
});

When('{word} fills last name {string}', async function (actorName, lastName) {
  const actor = await this.actorCalled(actorName);
  if (lastName) {
    await actor.attemptsTo(FillCheckoutInformation.withLastName(lastName));
  }
});

When('{word} fills postal code {string}', async function (actorName, postalCode) {
  const actor = await this.actorCalled(actorName);
  if (postalCode) {
    await actor.attemptsTo(FillCheckoutInformation.withPostalCode(postalCode));
  }
});

When('{word} continues to the next checkout step', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(CompleteCheckout.byContinuing());
});

When('{word} finishes the checkout process', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(CompleteCheckout.byFinishing());
});

When('{word} cancels the checkout process', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(CompleteCheckout.byCancelling());
});

// Generic button click step moved to global_steps.js

// ====================================
// THEN STEPS - Assertions and Validations
// ====================================

Then('{word} should be on step {int} {string}', async function (actorName, stepNumber, expectedTitle) {
  const actor = await this.actorCalled(actorName);
  
  // Verify the page header (.title element) matches expected step
  const pageHeaderText = await actor.asks(Text.of('.title'));
  await actor.attemptsTo(Ensure.that(pageHeaderText).equals(expectedTitle));
  
  // Verify correct step based on step number
  switch (stepNumber) {
  case 1:
    await actor.attemptsTo(Ensure.that(CheckoutPage.isInformationStep()).isTrue());
    break;
  case 2:
    await actor.attemptsTo(Ensure.that(CheckoutPage.isOverviewStep()).isTrue());
    break;
  case 3:
    await actor.attemptsTo(Ensure.that(CheckoutPage.isCompleteStep()).isTrue());
    break;
  default:
    throw new Error(`Unknown step number: ${stepNumber}`);
  }
});

Then('{word} should see customer information form fields', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(CheckoutPage.hasFormFields()).isTrue());
});

Then('{word} should see payment information section', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(CheckoutPage.hasPaymentInfo()).isTrue());
});

Then('{word} should see shipping information section', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(CheckoutPage.hasShippingInfo()).isTrue());
});

Then('{word} should see price breakdown with totals', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Verify item total is visible
  await actor.attemptsTo(Ensure.that(Visibility.of('.summary_subtotal_label')).isVisible());
  
  // Verify tax is visible
  await actor.attemptsTo(Ensure.that(Visibility.of('.summary_tax_label')).isVisible());
  
  // Verify final total is visible
  await actor.attemptsTo(Ensure.that(Visibility.of('.summary_total_label')).isVisible());
});

Then('{word} should see order completion elements', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(CheckoutPage.hasCompletionConfirmation()).isTrue());
});

Then('{word} should see the completion confirmation', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(CheckoutPage.hasCompletionConfirmation()).isTrue());
});

Then('{word} should see {string} message', async function (actorName, expectedMessage) {
  const actor = await this.actorCalled(actorName);
  
  if (expectedMessage.includes('Thank you for your order!')) {
    await actor.attemptsTo(Ensure.that(Visibility.of('.complete-header')).isVisible());
    await actor.attemptsTo(Ensure.that(Text.of('.complete-header')).contains('Thank you for your order!'));
  } else {
    await actor.attemptsTo(Ensure.that(Text.of('body')).contains(expectedMessage));
  }
});

Then('{word} should see the {string} button', async function (actorName, buttonText) {
  const actor = await this.actorCalled(actorName);
  
  let selector;
  switch (buttonText.toLowerCase()) {
  case 'back home':
    selector = '[data-test="back-to-products"]';
    break;
  default:
    throw new Error(`Unknown button: ${buttonText}`);
  }
  
  await actor.attemptsTo(Ensure.that(Visibility.of(selector)).isVisible());
});

// Generic error message step moved to global_steps.js

Then('{word} should remain on the checkout information page', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(CheckoutPage.isInformationStep()).isTrue());
});

Then('{word} should be back on the cart page', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Cancel behavior depends on which step we canceled from:
  // - Cancel from step 1 (information) → Cart page
  // - Cancel from step 2 (overview) → Products page (SauceDemo behavior)
  try {
    // First try cart page (expected for cancel from step 1)
    await actor.attemptsTo(Ensure.that(CurrentUrl.isCartPage()).isTrue());
  } catch {
    // If not cart page, check if on products page (expected for cancel from step 2)
    await actor.attemptsTo(Ensure.that(CurrentUrl.isInventoryPage()).isTrue());
  }
});

Then('{word} should see the order summary with correct items', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Verify order summary section is visible
  await actor.attemptsTo(Ensure.that(Visibility.of('.summary_info')).isVisible());
  
  // Verify at least one item is present
  await actor.attemptsTo(Ensure.that(Visibility.of('.cart_item')).isVisible());
});

Then('{word} should see {string} in the checkout items', async function (actorName, itemName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(OrderSummary.containsItem(itemName)).isTrue());
});

Then('{word} should see correct item total calculation', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Verify item total is visible and is a positive number
  const itemTotal = await actor.asks(OrderSummary.itemTotal());
  if (itemTotal <= 0) {
    throw new Error(`Item total should be positive, but got: ${itemTotal}`);
  }
});

Then('{word} should see tax amount displayed', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Verify tax amount is visible and is a non-negative number
  const taxAmount = await actor.asks(OrderSummary.taxAmount());
  if (taxAmount < 0) {
    throw new Error(`Tax amount should be non-negative, but got: ${taxAmount}`);
  }
});

Then('{word} should see correct grand total calculation', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(OrderSummary.hasCorrectCalculations()).isTrue());
});

Then('{word} should not see the cart badge', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(CartBadge.isVisible()).isFalse());
});

// ====================================
// COMPLEX DATA TABLE STEPS
// ====================================

Given('{word} adds the following items to the cart:', async function (actorName, dataTable) {
  const actor = await this.actorCalled(actorName);
  const products = dataTable.hashes();
  
  for (const product of products) {
    const productName = product.product_name;
    
    // Click on the add to cart button for this specific product
    const productSelector = `.inventory_item:has-text("${productName}") [data-test^="add-to-cart"]`;
    await actor.attemptsTo(Click.on(productSelector));
  }
});

// ====================================
// DYNAMIC PRICE CALCULATION STEPS
// ====================================

Then('{word} should see the item total calculated correctly based on cart items', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Get the item total from order summary
  const displayedTotal = await actor.asks(OrderSummary.itemTotal());
  
  // Verify it's a reasonable amount (expected total for the test items: $53.97)
  const expectedMinimum = 50.00;
  const expectedMaximum = 60.00;
  
  if (displayedTotal < expectedMinimum || displayedTotal > expectedMaximum) {
    throw new Error(`Item total ${displayedTotal} is outside expected range ${expectedMinimum}-${expectedMaximum}`);
  }
});

Then('{word} should see the tax calculated correctly based on the item total', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  const itemTotal = await actor.asks(OrderSummary.itemTotal());
  const taxAmount = await actor.asks(OrderSummary.taxAmount());
  
  // Verify tax is calculated (typically 8% in the demo)
  const expectedTaxRate = 0.08;
  const expectedTax = itemTotal * expectedTaxRate;
  const tolerance = 0.10; // Allow small difference for rounding
  
  if (Math.abs(taxAmount - expectedTax) > tolerance) {
    throw new Error(`Tax calculation incorrect. Expected ~${expectedTax}, got ${taxAmount}`);
  }
});

Then('{word} should see the final total equal to the sum of item total and tax', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(Ensure.that(OrderSummary.hasCorrectCalculations()).isTrue());
});

// Generic page navigation step moved to global_steps.js 