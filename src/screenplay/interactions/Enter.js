/**
 * Enter - Screenplay Pattern Interaction
 * Low-level interaction for entering text into form fields
 */

import { BrowseTheWeb } from '../abilities/BrowseTheWeb.js';

class Enter {
  constructor(text, selector) {
    this.text = text;
    this.selector = selector;
  }

  /**
   * Static factory method to create an enter text interaction
   * @param {string} text - The text to enter
   * @returns {EnterBuilder} Builder for completing the interaction
   */
  static theValue(text) {
    return new EnterBuilder(text);
  }

  /**
   * Performs the text entry as the given actor
   * @param {Actor} actor - The actor performing the interaction
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();
    
    // Wait for element to be visible
    await page.waitForSelector(this.selector, { 
      state: 'visible', 
      timeout: 30000 
    });
    
    // Clear existing text and enter new text
    await page.fill(this.selector, this.text);
  }

  /**
   * Returns a string representation of the interaction
   * @returns {string}
   */
  toString() {
    return `enter "${this.text}" into ${this.selector}`;
  }
}

/**
 * Builder class for completing the Enter interaction
 */
class EnterBuilder {
  constructor(text) {
    this.text = text;
  }

  /**
   * Specifies the target element for text entry
   * @param {string} selector - The CSS selector for the target element
   * @returns {Enter} The complete Enter interaction
   */
  into(selector) {
    return new Enter(this.text, selector);
  }
}

export { Enter }; 