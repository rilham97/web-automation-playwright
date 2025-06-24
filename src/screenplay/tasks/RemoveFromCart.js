/**
 * RemoveFromCart - Screenplay Pattern Task
 * High-level business task for removing items from cart
 */

import { Click } from '../interactions/Click.js';

class RemoveFromCart {
  constructor(itemName, location = 'products') {
    this.itemName = itemName;
    this.location = location; // 'products' or 'cart'
  }

  /**
   * Static factory method to remove item from products page
   * @param {string} itemName - The name of the item to remove
   * @returns {RemoveFromCart} The remove from cart task
   */
  static fromProducts(itemName) {
    return new RemoveFromCart(itemName, 'products');
  }

  /**
   * Static factory method to remove item from cart page
   * @param {string} itemName - The name of the item to remove
   * @returns {RemoveFromCart} The remove from cart task
   */
  static fromCartPage(itemName) {
    return new RemoveFromCart(itemName, 'cart');
  }

  /**
   * Performs the remove from cart task as the given actor
   * @param {Actor} actor - The actor performing the task
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    if (this.location === 'cart') {
      // Remove from cart page - different selectors
      const removeSelector = `[data-test*="remove-${this.itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
      await actor.attemptsTo(
        Click.on(removeSelector)
      );
    } else {
      // Remove from products page - standard selectors
      const removeSelector = `[data-test*="remove-${this.itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
      await actor.attemptsTo(
        Click.on(removeSelector)
      );
    }
  }

  /**
   * Returns a string representation of the task
   * @returns {string}
   */
  toString() {
    return `remove "${this.itemName}" from ${this.location === 'cart' ? 'cart page' : 'products page'}`;
  }
}

export { RemoveFromCart }; 