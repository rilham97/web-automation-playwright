/**
 * SortProducts - Screenplay Pattern Task
 * High-level business task for sorting products on the products page
 */

class SortProducts {
  constructor(sortOption) {
    this.sortOption = sortOption;
  }

  /**
   * Static factory method to sort products by a specific option
   * @param {string} sortOption - The sorting option (e.g., "Name (A to Z)", "Price (low to high)")
   * @returns {SortProducts} The sort products task
   */
  static by(sortOption) {
    return new SortProducts(sortOption);
  }

  /**
   * Performs the sort products task as the given actor
   * @param {Actor} actor - The actor performing the task
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    const { BrowseTheWeb } = await import('../abilities/BrowseTheWeb.js');
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();
    
    // Map sort option text to dropdown values
    const sortOptions = {
      'Name (A to Z)': 'az',
      'Name (Z to A)': 'za', 
      'Price (low to high)': 'lohi',
      'Price (high to low)': 'hilo'
    };
    
    const optionValue = sortOptions[this.sortOption];
    if (!optionValue) {
      throw new Error(`Invalid sort option: ${this.sortOption}. Available options: ${Object.keys(sortOptions).join(', ')}`);
    }
    
    // Select the sorting option from dropdown
    await page.selectOption('[data-test="product-sort-container"]', optionValue);
    
    // Wait for sorting to complete
    await page.waitForTimeout(1000);
  }

  /**
   * Returns a string representation of the task
   * @returns {string}
   */
  toString() {
    return `sort products by "${this.sortOption}"`;
  }
}

export { SortProducts }; 