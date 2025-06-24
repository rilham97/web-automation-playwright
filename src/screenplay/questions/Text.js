/**
 * Text - Screenplay Pattern Question
 * Question for retrieving text content from elements
 */

import { BrowseTheWeb } from '../abilities/BrowseTheWeb.js';

class Text {
  constructor(selector) {
    this.selector = selector;
  }

  /**
   * Static factory method to create a text question
   * @param {string} selector - The CSS selector for the element
   * @returns {Text} The text question
   */
  static of(selector) {
    return new Text(selector);
  }

  /**
   * Gets the text content as answered by the given actor
   * @param {Actor} actor - The actor answering the question
   * @returns {Promise<string>} The text content of the element
   */
  async answeredBy(actor) {
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();
    
    // Wait for element to be visible
    await page.waitForSelector(this.selector, { 
      state: 'visible', 
      timeout: 30000 
    });
    
    return await page.textContent(this.selector);
  }

  /**
   * Returns a string representation of the question
   * @returns {string}
   */
  toString() {
    return `text of ${this.selector}`;
  }
}

export { Text }; 