/**
 * ProductDetailButton - Screenplay Pattern Question
 * Retrieves information about button states on the product detail page
 */

class ProductDetailButton {
  constructor(buttonType = 'addToCart', productName = null) {
    this.buttonType = buttonType;
    this.productName = productName;
  }

  /**
   * Static factory method to check if "Add to Cart" button is visible
   * @returns {ProductDetailButton} The question instance
   */
  static addToCartIsVisible() {
    return new ProductDetailButton('addToCart');
  }

  /**
   * Static factory method to check if "Remove from Cart" button is visible
   * @returns {ProductDetailButton} The question instance
   */
  static removeFromCartIsVisible() {
    return new ProductDetailButton('removeFromCart');
  }

  /**
   * Static factory method to check if "Add to Cart" button is visible for specific product
   * @param {string} productName - The product name
   * @returns {ProductDetailButton} The question instance
   */
  static addToCartIsVisibleFor(productName) {
    return new ProductDetailButton('addToCart', productName);
  }

  /**
   * Static factory method to check if "Remove from Cart" button is visible for specific product
   * @param {string} productName - The product name
   * @returns {ProductDetailButton} The question instance
   */
  static removeFromCartIsVisibleFor(productName) {
    return new ProductDetailButton('removeFromCart', productName);
  }

  /**
   * Static factory method to check if "Add to Cart" button is visible for specific product
   * @param {string} productName - The product name
   * @returns {ProductDetailButton} The question instance
   */
  static forProduct(productName) {
    return new ProductDetailButton(productName);
  }

  /**
   * Answers the question by interacting with the browser
   * @param {Actor} actor - The actor asking the question
   * @returns {Promise<boolean>} Whether the specified button is visible
   */
  async answeredBy(actor) {
    const { BrowseTheWeb } = await import('../abilities/BrowseTheWeb.js');
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();

    // If no specific product name is provided, try to get it from the detail page
    let productName = this.productName;
    if (!productName) {
      // Get product name from page title or URL
      const { ProductDetailPage } = await import('./ProductDetailPage.js');
      productName = await actor.asks(ProductDetailPage.productName());
    }

    // Note: Product detail page buttons use generic selectors, not product-specific ones

    switch (this.buttonType) {
    case 'addToCart':
      // Check for Add to Cart button (when product is not in cart)
      // On detail page, use generic prefix selector
      return await page.isVisible('[data-test^="add-to-cart"]');

    case 'removeFromCart':
      // Check for Remove from Cart button (when product is in cart)
      // On detail page, use generic prefix selector
      return await page.isVisible('[data-test^="remove"]');

    default:
      throw new Error(`Unknown button type: ${this.buttonType}`);
    }
  }

  /**
   * Returns a string representation of the question
   * @returns {string}
   */
  toString() {
    switch (this.buttonType) {
    case 'addToCart':
      return '"Add to Cart" button visibility on product detail page';
    case 'removeFromCart':
      return '"Remove from Cart" button visibility on product detail page';
    default:
      return `product detail button ${this.buttonType} visibility`;
    }
  }
}

export { ProductDetailButton }; 