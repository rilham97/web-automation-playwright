/**
 * BrowseTheWeb - Screenplay Pattern Ability
 * Enables actors to interact with web browsers using Playwright
 */

class BrowseTheWeb {
  constructor(page) {
    this.page = page;
    this.actorUsingAbility = null;
  }

  /**
   * Static factory method to create the ability
   * @param {Page} page - The Playwright page instance
   * @returns {BrowseTheWeb} The ability instance
   */
  static using(page) {
    return new BrowseTheWeb(page);
  }

  /**
   * Gets the current page
   * @returns {Page} The Playwright page instance
   */
  currentPage() {
    return this.page;
  }

  /**
   * Takes a screenshot of the current page
   * @param {string} name - The name for the screenshot
   * @returns {Promise<Buffer>} The screenshot buffer
   */
  async takeScreenshot(name = 'screenshot') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${name}-${timestamp}.png`;
    
    return await this.page.screenshot({
      path: `screenshots/${fileName}`,
      fullPage: true
    });
  }

  /**
   * Waits for a specific condition
   * @param {Function} condition - The condition to wait for
   * @param {number} timeout - The timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitFor(condition, timeout = 30000) {
    return await this.page.waitForFunction(condition, {}, { timeout });
  }

  /**
   * Gets the page title
   * @returns {Promise<string>} The page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Gets the current URL
   * @returns {Promise<string>} The current URL (normalized)
   */
  async getCurrentUrl() {
    const url = this.page.url();
    // Normalize URL by removing trailing slash for consistent comparison
    return url.endsWith('/') && url !== 'about:blank' ? url.slice(0, -1) : url;
  }

  /**
   * Reloads the current page
   * @returns {Promise<void>}
   */
  async reload() {
    await this.page.reload();
  }

  /**
   * Goes back in browser history
   * @returns {Promise<void>}
   */
  async goBack() {
    await this.page.goBack();
  }

  /**
   * Goes forward in browser history
   * @returns {Promise<void>}
   */
  async goForward() {
    await this.page.goForward();
  }

  /**
   * Returns a string representation of the ability
   * @returns {string}
   */
  toString() {
    return 'browse the web';
  }
}

export { BrowseTheWeb }; 