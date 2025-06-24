/**
 * ProductList - Screenplay Pattern Question
 * Retrieves information about the product list and specific product positioning
 */

class ProductList {
  constructor(query = 'allNames', targetProduct = null) {
    this.query = query;
    this.targetProduct = targetProduct;
  }

  /**
   * Static factory method to get all product names
   * @returns {ProductList} The question instance
   */
  static allNames() {
    return new ProductList('allNames');
  }

  /**
   * Static factory method to get all product prices
   * @returns {ProductList} The question instance
   */
  static allPrices() {
    return new ProductList('allPrices');
  }

  /**
   * Static factory method to check if a product appears before another
   * @param {string} firstProduct - The first product name
   * @param {string} secondProduct - The second product name
   * @returns {ProductList} The question instance
   */
  static productOrder(firstProduct, secondProduct) {
    const instance = new ProductList('productOrder');
    instance.firstProduct = firstProduct;
    instance.secondProduct = secondProduct;
    return instance;
  }

  /**
   * Static factory method to check if a product is among the first products
   * @param {string} productName - The product name to check
   * @returns {ProductList} The question instance
   */
  static isProductFirst(productName) {
    return new ProductList('isProductFirst', productName);
  }

  /**
   * Static factory method to get the first product info
   * @returns {ProductList} The question instance
   */
  static firstProduct() {
    return new ProductList('firstProduct');
  }

  /**
   * Static factory method to get the last product info
   * @returns {ProductList} The question instance
   */
  static lastProduct() {
    return new ProductList('lastProduct');
  }

  /**
   * Static factory method to check if first product has lowest price
   * @returns {ProductList} The question instance
   */
  static firstHasLowestPrice() {
    return new ProductList('firstHasLowestPrice');
  }

  /**
   * Static factory method to check if first product has highest price
   * @returns {ProductList} The question instance
   */
  static firstHasHighestPrice() {
    return new ProductList('firstHasHighestPrice');
  }

  /**
   * Answers the question by interacting with the browser
   * @param {Actor} actor - The actor asking the question
   * @returns {Promise<Array|boolean|Object>} The answer to the question
   */
  async answeredBy(actor) {
    const { BrowseTheWeb } = await import('../abilities/BrowseTheWeb.js');
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();

    switch (this.query) {
    case 'allNames':
      return await page.$$eval('.inventory_item_name', elements => 
        elements.map(el => el.textContent.trim())
      );

    case 'allPrices':
      return await page.$$eval('.inventory_item_price', elements => 
        elements.map(el => parseFloat(el.textContent.replace('$', '')))
      );

    case 'productOrder': {
      const names = await page.$$eval('.inventory_item_name', elements => 
        elements.map(el => el.textContent.trim())
      );
      const firstIndex = names.indexOf(this.firstProduct);
      const secondIndex = names.indexOf(this.secondProduct);
      return firstIndex >= 0 && secondIndex >= 0 && firstIndex < secondIndex;
    }

    case 'isProductFirst': {
      const productNames = await page.$$eval('.inventory_item_name', elements => 
        elements.map(el => el.textContent.trim())
      );
      const productIndex = productNames.indexOf(this.targetProduct);
      return productIndex >= 0 && productIndex < 3; // Among first 3 products
    }

    case 'firstProduct': {
      const firstName = await page.$$eval('.inventory_item_name', elements => 
        elements[0]?.textContent.trim()
      );
      const firstPrice = await page.$$eval('.inventory_item_price', elements => 
        parseFloat(elements[0]?.textContent.replace('$', ''))
      );
      return { name: firstName, price: firstPrice };
    }

    case 'lastProduct': {
      const lastNameElements = await page.$$eval('.inventory_item_name', elements => 
        elements[elements.length - 1]?.textContent.trim()
      );
      const lastPriceElements = await page.$$eval('.inventory_item_price', elements => 
        parseFloat(elements[elements.length - 1]?.textContent.replace('$', ''))
      );
      return { name: lastNameElements, price: lastPriceElements };
    }

    case 'firstHasLowestPrice': {
      const allPricesLow = await page.$$eval('.inventory_item_price', elements => 
        elements.map(el => parseFloat(el.textContent.replace('$', '')))
      );
      const minPrice = Math.min(...allPricesLow);
      return allPricesLow[0] === minPrice;
    }

    case 'firstHasHighestPrice': {
      const allPricesHigh = await page.$$eval('.inventory_item_price', elements => 
        elements.map(el => parseFloat(el.textContent.replace('$', '')))
      );
      const maxPrice = Math.max(...allPricesHigh);
      return allPricesHigh[0] === maxPrice;
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
    case 'allNames':
      return 'all product names';
    case 'allPrices':
      return 'all product prices';
    case 'productOrder':
      return `"${this.firstProduct}" appears before "${this.secondProduct}"`;
    case 'isProductFirst':
      return `"${this.targetProduct}" is among first products`;
    case 'firstProduct':
      return 'first product information';
    case 'lastProduct':
      return 'last product information';
    case 'firstHasLowestPrice':
      return 'first product has lowest price';
    case 'firstHasHighestPrice':
      return 'first product has highest price';
    default:
      return `product list ${this.query}`;
    }
  }
}

export { ProductList }; 