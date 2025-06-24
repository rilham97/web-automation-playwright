/**
 * AddToCart - Screenplay Pattern Task
 * High-level business task for adding products to shopping cart
 */

import { Click } from '../interactions/Click.js';

class AddToCart {
  constructor(productName) {
    this.productName = productName;
  }

  /**
   * Static factory method to create an add to cart task
   * @param {string} productName - The name of the product to add
   * @returns {AddToCart} The add to cart task
   */
  static theProduct(productName) {
    return new AddToCart(productName);
  }

  /**
   * Performs the add to cart task as the given actor
   * @param {Actor} actor - The actor performing the task
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    // Convert product name to the data-test attribute format
    const productId = this.productName.toLowerCase().replace(/\s+/g, '-');
    const addToCartSelector = `[data-test="add-to-cart-${productId}"]`;
    
    await actor.attemptsTo(
      Click.on(addToCartSelector)
    );
  }

  /**
   * Returns a string representation of the task
   * @returns {string}
   */
  toString() {
    return `add "${this.productName}" to cart`;
  }
}

export { AddToCart }; 