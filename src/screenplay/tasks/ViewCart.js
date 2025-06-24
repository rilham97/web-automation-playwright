/**
 * ViewCart - Screenplay Pattern Task
 * High-level business task for viewing the shopping cart
 */

import { Click } from '../interactions/Click.js';

class ViewCart {
  /**
   * Static factory method to create a view cart task
   * @returns {ViewCart} The view cart task
   */
  static now() {
    return new ViewCart();
  }

  /**
   * Performs the view cart task as the given actor
   * @param {Actor} actor - The actor performing the task
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    await actor.attemptsTo(
      Click.on('.shopping_cart_link')
    );
  }

  /**
   * Returns a string representation of the task
   * @returns {string}
   */
  toString() {
    return 'view shopping cart';
  }
}

export { ViewCart }; 