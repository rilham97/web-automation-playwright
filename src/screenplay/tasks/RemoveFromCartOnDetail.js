/**
 * RemoveFromCartOnDetail - Screenplay Pattern Task
 * High-level business task for removing a product from cart on the product detail page
 */

import { Click } from '../interactions/Click.js';

class RemoveFromCartOnDetail {
  constructor() {
    // This task removes the current product from cart on detail page
  }

  /**
   * Static factory method to remove current product from cart on detail page
   * @returns {RemoveFromCartOnDetail} The task instance
   */
  static now() {
    return new RemoveFromCartOnDetail();
  }

  /**
   * Performs the remove from cart task as the given actor
   * @param {Actor} actor - The actor performing the task
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    // On product detail page, use generic prefix selector like AddToCartFromDetail
    const removeButton = '[data-test^="remove"]';
    
    // Use the Click interaction for consistency with Screenplay pattern
    await actor.attemptsTo(
      Click.on(removeButton)
    );
  }

  /**
   * Returns a string representation of the task
   * @returns {string}
   */
  toString() {
    return 'remove product from cart on detail page';
  }
}

export { RemoveFromCartOnDetail }; 