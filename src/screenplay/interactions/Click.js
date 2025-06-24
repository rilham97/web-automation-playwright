/**
 * Click - Screenplay Pattern Interaction
 * Low-level interaction for clicking on elements
 */

import { BrowseTheWeb } from '../abilities/BrowseTheWeb.js';

class Click {
  constructor(selector) {
    this.selector = selector;
  }

  /**
   * Static factory method to create a click interaction
   * @param {string} selector - The CSS selector or locator for the element
   * @returns {Click} The click interaction
   */
  static on(selector) {
    return new Click(selector);
  }

  /**
   * Performs the click as the given actor
   * @param {Actor} actor - The actor performing the interaction
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();
    
    // Wait for element to be visible and clickable
    await page.waitForSelector(this.selector, { 
      state: 'visible', 
      timeout: 30000 
    });
    
    await page.click(this.selector);
  }

  /**
   * Returns a string representation of the interaction
   * @returns {string}
   */
  toString() {
    return `click on ${this.selector}`;
  }
}

export { Click }; 