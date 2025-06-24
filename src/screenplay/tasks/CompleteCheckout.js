/**
 * CompleteCheckout - Screenplay Pattern Task
 * High-level business task for completing the checkout process
 */

import { Click } from '../interactions/Click.js';

class CompleteCheckout {
  constructor(action = 'finish') {
    this.action = action;
  }

  /**
   * Static factory method to continue to next checkout step
   * @returns {CompleteCheckout} The complete checkout task
   */
  static byContinuing() {
    return new CompleteCheckout('continue');
  }

  /**
   * Static factory method to finish the checkout process
   * @returns {CompleteCheckout} The complete checkout task
   */
  static byFinishing() {
    return new CompleteCheckout('finish');
  }

  /**
   * Static factory method to cancel the checkout process
   * @returns {CompleteCheckout} The complete checkout task
   */
  static byCancelling() {
    return new CompleteCheckout('cancel');
  }

  /**
   * Performs the complete checkout task as the given actor
   * @param {Actor} actor - The actor performing the task
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    let selector;
    
    switch (this.action) {
    case 'continue':
      selector = '[data-test="continue"]';
      break;
    case 'finish':
      selector = '[data-test="finish"]';
      break;
    case 'cancel':
      selector = '[data-test="cancel"]';
      break;
    default:
      throw new Error(`Unknown checkout action: ${this.action}`);
    }

    await actor.attemptsTo(
      Click.on(selector)
    );
  }

  /**
   * Returns a string representation of the task
   * @returns {string}
   */
  toString() {
    switch (this.action) {
    case 'continue':
      return 'continue to next checkout step';
    case 'finish':
      return 'finish checkout process';
    case 'cancel':
      return 'cancel checkout process';
    default:
      return `complete checkout by ${this.action}`;
    }
  }
}

export { CompleteCheckout }; 