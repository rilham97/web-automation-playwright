/**
 * NavigateToCart - Screenplay Pattern Task
 * High-level business task for navigating to the shopping cart
 */

import { Click } from '../interactions/Click.js';

class NavigateToCart {
  constructor() {}

  /**
   * Static factory method to navigate to cart
   * @returns {NavigateToCart} The navigate to cart task
   */
  static page() {
    return new NavigateToCart();
  }

  /**
   * Performs the navigate to cart task as the given actor
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
    return 'navigate to cart page';
  }
}

export { NavigateToCart }; 