/**
 * AddToCartFromDetail - Screenplay Pattern Task
 * High-level business task for adding items to cart from product detail page
 */

import { Click } from '../interactions/Click.js';

class AddToCartFromDetail {
  constructor(productName) {
    this.productName = productName;
  }

  /**
   * Static factory method to add product to cart from detail page
   * @param {string} productName - The name of the product
   * @returns {AddToCartFromDetail} The add to cart from detail task
   */
  static product(productName) {
    return new AddToCartFromDetail(productName);
  }

  /**
   * Performs the add to cart from detail task as the given actor
   * @param {Actor} actor - The actor performing the task
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    // On product detail page, the Add to cart button has a generic selector
    // since there's only one product shown
    await actor.attemptsTo(
      Click.on('[data-test^="add-to-cart"]')
    );
  }

  /**
   * Returns a string representation of the task
   * @returns {string}
   */
  toString() {
    return `add "${this.productName}" to cart from product detail page`;
  }
}

export { AddToCartFromDetail }; 