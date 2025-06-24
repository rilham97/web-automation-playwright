/**
 * StartCheckout - Screenplay Pattern Task
 * High-level business task for starting the checkout process
 */

import { Click } from '../interactions/Click.js';

class StartCheckout {
  constructor() {}

  /**
   * Static factory method to start checkout process
   * @returns {StartCheckout} The start checkout task
   */
  static process() {
    return new StartCheckout();
  }

  /**
   * Performs the start checkout task as the given actor
   * @param {Actor} actor - The actor performing the task
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    await actor.attemptsTo(
      Click.on('[data-test="checkout"]')
    );
  }

  /**
   * Returns a string representation of the task
   * @returns {string}
   */
  toString() {
    return 'start checkout process';
  }
}

export { StartCheckout }; 