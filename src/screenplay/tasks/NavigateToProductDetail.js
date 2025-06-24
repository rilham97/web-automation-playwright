/**
 * NavigateToProductDetail - Screenplay Pattern Task
 * High-level business task for navigating to product detail pages
 */

import { Click } from '../interactions/Click.js';

class NavigateToProductDetail {
  constructor(productName) {
    this.productName = productName;
  }

  /**
   * Static factory method to navigate to product detail by clicking title
   * @param {string} productName - The name of the product
   * @returns {NavigateToProductDetail} The navigate to product detail task
   */
  static byClickingTitle(productName) {
    return new NavigateToProductDetail(productName);
  }

  /**
   * Performs the navigate to product detail task as the given actor
   * @param {Actor} actor - The actor performing the task
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    // Create selector for product title link based on product name
    // SauceDemo uses the inventory_item_name class for product titles
    const titleSelector = `.inventory_item:has-text("${this.productName}") .inventory_item_name`;
    
    await actor.attemptsTo(
      Click.on(titleSelector)
    );
  }

  /**
   * Returns a string representation of the task
   * @returns {string}
   */
  toString() {
    return `navigate to "${this.productName}" product detail page by clicking title`;
  }
}

export { NavigateToProductDetail }; 