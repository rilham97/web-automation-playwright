/**
 * Visibility - Screenplay Pattern Question
 * Question for checking the visibility state of elements
 */

import { BrowseTheWeb } from '../abilities/BrowseTheWeb.js';

class Visibility {
  constructor(selector) {
    this.selector = selector;
  }

  /**
   * Static factory method to create a visibility question
   * @param {string} selector - The CSS selector for the element
   * @returns {Visibility} The visibility question
   */
  static of(selector) {
    return new Visibility(selector);
  }

  /**
   * Checks if the element is visible as answered by the given actor
   * @param {Actor} actor - The actor answering the question
   * @returns {Promise<boolean>} True if the element is visible, false otherwise
   */
  async answeredBy(actor) {
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();
    
    try {
      // Check if element exists and is visible
      const element = await page.locator(this.selector);
      return await element.isVisible();
    } catch {
      // If element doesn't exist, it's not visible
      return false;
    }
  }

  /**
   * Returns a string representation of the question
   * @returns {string}
   */
  toString() {
    return `visibility of ${this.selector}`;
  }
}

export { Visibility }; 