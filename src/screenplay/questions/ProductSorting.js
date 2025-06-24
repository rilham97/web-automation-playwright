/**
 * ProductSorting - Screenplay Pattern Question
 * Retrieves information about product sorting state and validation
 */

class ProductSorting {
  constructor(query = 'currentOption') {
    this.query = query;
  }

  /**
   * Static factory method to get current sorting option
   * @returns {ProductSorting} The question instance
   */
  static currentOption() {
    return new ProductSorting('currentOption');
  }

  /**
   * Static factory method to get all available sorting options
   * @returns {ProductSorting} The question instance
   */
  static availableOptions() {
    return new ProductSorting('availableOptions');
  }

  /**
   * Static factory method to check if sort dropdown is visible
   * @returns {ProductSorting} The question instance
   */
  static isDropdownVisible() {
    return new ProductSorting('isDropdownVisible');
  }

  /**
   * Static factory method to validate alphabetical sorting A-Z
   * @returns {ProductSorting} The question instance
   */
  static isAlphabeticalAZ() {
    return new ProductSorting('isAlphabeticalAZ');
  }

  /**
   * Static factory method to validate alphabetical sorting Z-A
   * @returns {ProductSorting} The question instance
   */
  static isAlphabeticalZA() {
    return new ProductSorting('isAlphabeticalZA');
  }

  /**
   * Static factory method to validate price sorting low to high
   * @returns {ProductSorting} The question instance
   */
  static isPriceLowToHigh() {
    return new ProductSorting('isPriceLowToHigh');
  }

  /**
   * Static factory method to validate price sorting high to low
   * @returns {ProductSorting} The question instance
   */
  static isPriceHighToLow() {
    return new ProductSorting('isPriceHighToLow');
  }

  /**
   * Answers the question by interacting with the browser
   * @param {Actor} actor - The actor asking the question
   * @returns {Promise<string|boolean|Array>} The answer to the question
   */
  async answeredBy(actor) {
    const { BrowseTheWeb } = await import('../abilities/BrowseTheWeb.js');
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();

    // Map sort option values to text
    const sortOptions = {
      'az': 'Name (A to Z)',
      'za': 'Name (Z to A)',
      'lohi': 'Price (low to high)',
      'hilo': 'Price (high to low)'
    };

    switch (this.query) {
    case 'currentOption': {
      const selectedValue = await page.inputValue('[data-test="product-sort-container"]');
      return sortOptions[selectedValue] || 'Name (A to Z)';
    }

    case 'availableOptions': {
      const options = await page.$$eval('[data-test="product-sort-container"] option', elements => 
        elements.map(el => el.textContent.trim())
      );
      return options;
    }

    case 'isDropdownVisible':
      return await page.isVisible('[data-test="product-sort-container"]');

    case 'isAlphabeticalAZ': {
      const namesAZ = await page.$$eval('.inventory_item_name', elements => 
        elements.map(el => el.textContent.trim())
      );
      const sortedNamesAZ = [...namesAZ].sort();
      return JSON.stringify(namesAZ) === JSON.stringify(sortedNamesAZ);
    }

    case 'isAlphabeticalZA': {
      const namesZA = await page.$$eval('.inventory_item_name', elements => 
        elements.map(el => el.textContent.trim())
      );
      const sortedNamesZA = [...namesZA].sort().reverse();
      return JSON.stringify(namesZA) === JSON.stringify(sortedNamesZA);
    }

    case 'isPriceLowToHigh': {
      const pricesLowHigh = await page.$$eval('.inventory_item_price', elements => 
        elements.map(el => parseFloat(el.textContent.replace('$', '')))
      );
      for (let i = 1; i < pricesLowHigh.length; i++) {
        if (pricesLowHigh[i] < pricesLowHigh[i - 1]) {
          return false;
        }
      }
      return true;
    }

    case 'isPriceHighToLow': {
      const pricesHighLow = await page.$$eval('.inventory_item_price', elements => 
        elements.map(el => parseFloat(el.textContent.replace('$', '')))
      );
      for (let i = 1; i < pricesHighLow.length; i++) {
        if (pricesHighLow[i] > pricesHighLow[i - 1]) {
          return false;
        }
      }
      return true;
    }

    default:
      throw new Error(`Unknown query: ${this.query}`);
    }
  }

  /**
   * Returns a string representation of the question
   * @returns {string}
   */
  toString() {
    switch (this.query) {
    case 'currentOption':
      return 'current sorting option';
    case 'availableOptions':
      return 'available sorting options';
    case 'isDropdownVisible':
      return 'sort dropdown visibility';
    case 'isAlphabeticalAZ':
      return 'products sorted alphabetically A-Z';
    case 'isAlphabeticalZA':
      return 'products sorted alphabetically Z-A';
    case 'isPriceLowToHigh':
      return 'products sorted by price low to high';
    case 'isPriceHighToLow':
      return 'products sorted by price high to low';
    default:
      return `product sorting ${this.query}`;
    }
  }
}

export { ProductSorting }; 