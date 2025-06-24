/**
 * CurrentUrl - Screenplay Pattern Question
 * Retrieves and validates the current page URL
 */

import { URL_PATTERNS, URLS } from '../../constants/urls.js';

class CurrentUrl {
  constructor() {
    this.description = 'current page URL';
  }

  /**
   * Static factory method to get current URL
   * @returns {CurrentUrl} The question instance
   */
  static displayed() {
    return new CurrentUrl();
  }

  /**
   * Static factory method to check if current URL matches login page
   * @returns {CurrentUrl} The question instance with login validation
   */
  static isLoginPage() {
    const instance = new CurrentUrl();
    instance.description = 'current URL is login page';
    instance.validator = (url) => URL_PATTERNS.LOGIN.test(url) || url === URLS.BASE;
    return instance;
  }

  /**
   * Static factory method to check if current URL matches inventory page
   * @returns {CurrentUrl} The question instance with inventory validation
   */
  static isInventoryPage() {
    const instance = new CurrentUrl();
    instance.description = 'current URL is inventory page';
    instance.validator = (url) => URL_PATTERNS.INVENTORY.test(url) || url === URLS.INVENTORY;
    return instance;
  }

  /**
   * Static factory method to check if current URL matches cart page
   * @returns {CurrentUrl} The question instance with cart validation
   */
  static isCartPage() {
    const instance = new CurrentUrl();
    instance.description = 'current URL is cart page';
    instance.validator = (url) => URL_PATTERNS.CART.test(url) || url === URLS.CART;
    return instance;
  }

  /**
   * Answered by the actor using their BrowseTheWeb ability
   * @param {Actor} actor - The actor asking the question
   * @returns {Promise<string|boolean>} The current URL or validation result
   */
  async answeredBy(actor) {
    const { BrowseTheWeb } = await import('../abilities/BrowseTheWeb.js');
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const currentUrl = await browseTheWeb.getCurrentUrl();
    
    // If validator is present, return validation result
    if (this.validator) {
      return this.validator(currentUrl);
    }
    
    // Otherwise return the actual URL
    return currentUrl;
  }

  /**
   * Returns a string representation of the question
   * @returns {string}
   */
  toString() {
    return this.description;
  }
}

export { CurrentUrl }; 