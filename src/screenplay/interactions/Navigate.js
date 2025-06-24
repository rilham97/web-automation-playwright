/**
 * Navigate - Screenplay Pattern Interaction
 * Low-level interaction for navigating to web pages
 */

import { BrowseTheWeb } from '../abilities/BrowseTheWeb.js';

class Navigate {
  constructor(url) {
    this.url = url;
  }

  /**
   * Static factory method to create a navigation interaction
   * @param {string} url - The URL to navigate to
   * @returns {Navigate} The navigation interaction
   */
  static to(url) {
    return new Navigate(url);
  }

  /**
   * Performs the navigation as the given actor
   * @param {Actor} actor - The actor performing the interaction
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();
    
    await page.goto(this.url, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
  }

  /**
   * Returns a string representation of the interaction
   * @returns {string}
   */
  toString() {
    return `navigate to ${this.url}`;
  }
}

export { Navigate }; 