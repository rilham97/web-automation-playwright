/**
 * ProductDetailPage - Screenplay Pattern Question
 * Retrieves information about the current product detail page
 */

class ProductDetailPage {
  constructor(productName = null, query = 'isVisible') {
    this.productName = productName;
    this.query = query;
  }

  /**
   * Static factory method to check if we're on a product detail page
   * @returns {ProductDetailPage} The question instance
   */
  static isVisible() {
    return new ProductDetailPage(null, 'isVisible');
  }

  /**
   * Static factory method to check if we're on a specific product detail page
   * @param {string} productName - The name of the product
   * @returns {ProductDetailPage} The question instance
   */
  static isVisibleFor(productName) {
    return new ProductDetailPage(productName, 'isVisibleFor');
  }

  /**
   * Static factory method to get the product name on the detail page
   * @returns {ProductDetailPage} The question instance
   */
  static productName() {
    return new ProductDetailPage(null, 'productName');
  }

  /**
   * Answers the question by interacting with the browser
   * @param {Actor} actor - The actor asking the question
   * @returns {Promise<boolean|string>} The answer to the question
   */
  async answeredBy(actor) {
    const { BrowseTheWeb } = await import('../abilities/BrowseTheWeb.js');
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();

    switch (this.query) {
    case 'isVisible':
      // Check if we're on a product detail page by looking for detail-specific elements
      return await page.isVisible('.inventory_details');

    case 'isVisibleFor': {
      // Check if we're on the specific product detail page
      const isDetailPage = await page.isVisible('.inventory_details');
      if (!isDetailPage) return false;
        
      const actualProductName = await page.textContent('.inventory_details_name');
      return actualProductName && actualProductName.trim() === this.productName;
    }

    case 'productName':
      // Get the product name from the detail page
      if (await page.isVisible('.inventory_details_name')) {
        return await page.textContent('.inventory_details_name');
      }
      return null;

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
    case 'isVisible':
      return 'product detail page is visible';
    case 'isVisibleFor':
      return `product detail page is visible for "${this.productName}"`;
    case 'productName':
      return 'product name on detail page';
    default:
      return `product detail page ${this.query}`;
    }
  }
}

export { ProductDetailPage }; 