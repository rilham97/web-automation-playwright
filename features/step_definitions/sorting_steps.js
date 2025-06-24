import { Given, When, Then } from '@cucumber/cucumber';
import { 
  SortProducts, 
  ProductSorting, 
  ProductList,
  Ensure 
} from '../../src/screenplay/index.js';
/**
 * Screenplay Pattern Step Definitions - Sorting Feature
 * Business-readable test automation using Screenplay Pattern
 */

// ==================== GIVEN Steps (Arrange) ====================

Given('{word} sees the sort dropdown is visible', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  const isVisible = await actor.asks(ProductSorting.isDropdownVisible());
  await actor.attemptsTo(Ensure.that(isVisible).isTrue());
});

// ==================== WHEN Steps (Act) ====================

When('{word} checks the current sorting option', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Actually query and store the current sorting option for validation
  const currentSorting = await actor.asks(ProductSorting.currentOption());
  actor.remember('currentSortingOption', currentSorting);
  
  // Verify the sorting dropdown is accessible
  const isDropdownVisible = await actor.asks(ProductSorting.isDropdownVisible());
  await actor.attemptsTo(Ensure.that(isDropdownVisible).isTrue());
});

When('{word} sorts products by {string}', async function(actorName, sortOption) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(SortProducts.by(sortOption));
});

When('{word} checks all available sorting options', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Query and validate all available sorting options
  const availableOptions = await actor.asks(ProductSorting.availableOptions());
  actor.remember('availableSortingOptions', availableOptions);
  
  // Verify we have the expected 4 sorting options
  const expectedOptions = [
    'Name (A to Z)',
    'Name (Z to A)', 
    'Price (low to high)',
    'Price (high to low)'
  ];
  
  for (const expectedOption of expectedOptions) {
    await actor.attemptsTo(
      Ensure.that(availableOptions).contains(expectedOption)
    );
  }
});

// Generic wait step moved to global_steps.js

// ==================== THEN Steps (Assert) ====================

Then('the sorting should be {string}', async function(expectedSortOption) {
  // Note: Using the same actor from previous steps
  const actor = await this.actorCalled('Alice');
  const currentSorting = await actor.asks(ProductSorting.currentOption());
  await actor.attemptsTo(Ensure.that(currentSorting).equals(expectedSortOption));
});

Then('the sorting should still be {string}', async function(expectedSortOption) {
  // Verify sorting is maintained after page interactions
  const actor = await this.actorCalled('Alice');
  const currentSorting = await actor.asks(ProductSorting.currentOption());
  await actor.attemptsTo(Ensure.that(currentSorting).equals(expectedSortOption));
});

Then('{word} should see products sorted alphabetically from A to Z', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  const isCorrectlySorted = await actor.asks(ProductSorting.isAlphabeticalAZ());
  await actor.attemptsTo(Ensure.that(isCorrectlySorted).isTrue());
});

Then('{word} should see products sorted alphabetically from Z to A', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  const isCorrectlySorted = await actor.asks(ProductSorting.isAlphabeticalZA());
  await actor.attemptsTo(Ensure.that(isCorrectlySorted).isTrue());
});

Then('{word} should see products sorted by price from low to high', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  const isCorrectlySorted = await actor.asks(ProductSorting.isPriceLowToHigh());
  await actor.attemptsTo(Ensure.that(isCorrectlySorted).isTrue());
});

Then('{word} should see products still sorted by price from low to high', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  const isCorrectlySorted = await actor.asks(ProductSorting.isPriceLowToHigh());
  await actor.attemptsTo(Ensure.that(isCorrectlySorted).isTrue());
});

Then('{word} should see products sorted by price from high to low', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  const isCorrectlySorted = await actor.asks(ProductSorting.isPriceHighToLow());
  await actor.attemptsTo(Ensure.that(isCorrectlySorted).isTrue());
});

Then('{string} should appear before {string}', async function(firstProduct, secondProduct) {
  const actor = await this.actorCalled('Alice');
  const isOrderCorrect = await actor.asks(ProductList.productOrder(firstProduct, secondProduct));
  await actor.attemptsTo(Ensure.that(isOrderCorrect).isTrue());
});

Then('{word} should see the cheapest product appears first', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  const hasLowestPriceFirst = await actor.asks(ProductList.firstHasLowestPrice());
  await actor.attemptsTo(Ensure.that(hasLowestPriceFirst).isTrue());
});

Then('{word} should see the most expensive product appears last', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Get all prices and check if last product has highest price
  const allPrices = await actor.asks(ProductList.allPrices());
  const lastProduct = await actor.asks(ProductList.lastProduct());
  const maxPrice = Math.max(...allPrices);
  
  await actor.attemptsTo(Ensure.that(lastProduct.price).equals(maxPrice));
});

Then('{word} should see the most expensive product appears first', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  const hasHighestPriceFirst = await actor.asks(ProductList.firstHasHighestPrice());
  await actor.attemptsTo(Ensure.that(hasHighestPriceFirst).isTrue());
});

Then('{word} should see the cheapest product appears last', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Get all prices and check if last product has lowest price
  const allPrices = await actor.asks(ProductList.allPrices());
  const lastProduct = await actor.asks(ProductList.lastProduct());
  const minPrice = Math.min(...allPrices);
  
  await actor.attemptsTo(Ensure.that(lastProduct.price).equals(minPrice));
});

Then('{word} should see sorting option {string}', async function(actorName, expectedOption) {
  const actor = await this.actorCalled(actorName);
  const availableOptions = await actor.asks(ProductSorting.availableOptions());
  await actor.attemptsTo(Ensure.that(availableOptions).contains(expectedOption));
});

Then('{word} should see products displayed in the correct {string} order', async function(actorName, sortType) {
  const actor = await this.actorCalled(actorName);
  let isCorrectlySorted = false;
  
  switch(sortType) {
  case 'alphabetical-az':
    isCorrectlySorted = await actor.asks(ProductSorting.isAlphabeticalAZ());
    break;
  case 'alphabetical-za':
    isCorrectlySorted = await actor.asks(ProductSorting.isAlphabeticalZA());
    break;
  case 'price-ascending':
    isCorrectlySorted = await actor.asks(ProductSorting.isPriceLowToHigh());
    break;
  case 'price-descending':
    isCorrectlySorted = await actor.asks(ProductSorting.isPriceHighToLow());
    break;
  default:
    throw new Error(`Unknown sort type: ${sortType}`);
  }
  
  await actor.attemptsTo(Ensure.that(isCorrectlySorted).isTrue());
});

Then('{string} should be among the first products', async function(productName) {
  const actor = await this.actorCalled('Alice');
  const isProductFirst = await actor.asks(ProductList.isProductFirst(productName));
  await actor.attemptsTo(Ensure.that(isProductFirst).isTrue());
});

Then('{word} should see the first product has the lowest price', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  const hasLowestPriceFirst = await actor.asks(ProductList.firstHasLowestPrice());
  await actor.attemptsTo(Ensure.that(hasLowestPriceFirst).isTrue());
});

Then('{word} should see the first product has the highest price', async function(actorName) {
  const actor = await this.actorCalled(actorName);
  const hasHighestPriceFirst = await actor.asks(ProductList.firstHasHighestPrice());
  await actor.attemptsTo(Ensure.that(hasHighestPriceFirst).isTrue());
}); 