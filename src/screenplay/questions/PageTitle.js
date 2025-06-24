/**
 * PageTitle - Screenplay Pattern Question
 * Question for retrieving the current page title
 */

import { BrowseTheWeb } from '../abilities/BrowseTheWeb.js';

class PageTitle {
  /**
   * Static factory method to create a page title question
   * @returns {PageTitle} The page title question
   */
  static displayed() {
    return new PageTitle();
  }

  /**
   * Gets the page title as answered by the given actor
   * @param {Actor} actor - The actor answering the question
   * @returns {Promise<string>} The page title
   */
  async answeredBy(actor) {
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();
    
    return await page.title();
  }

  /**
   * Returns a string representation of the question
   * @returns {string}
   */
  toString() {
    return 'page title';
  }
}

export { PageTitle }; 