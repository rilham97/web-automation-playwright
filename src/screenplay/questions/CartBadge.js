/**
 * CartBadge - Screenplay Pattern Question
 * Retrieves information about the shopping cart badge
 */

class CartBadge {
  constructor(query = 'count') {
    this.query = query;
  }

  /**
   * Static factory method to get cart badge count
   * @returns {CartBadge} The question instance
   */
  static count() {
    return new CartBadge('count');
  }

  /**
   * Static factory method to check if cart badge is visible
   * @returns {CartBadge} The question instance
   */
  static isVisible() {
    return new CartBadge('visibility');
  }

  /**
   * Static factory method to check if cart badge shows specific count
   * @param {string} expectedCount - The expected count
   * @returns {CartBadge} The question instance
   */
  static showsCount(expectedCount) {
    const instance = new CartBadge('specific-count');
    instance.expectedCount = expectedCount;
    return instance;
  }

  /**
   * Answered by the actor using their BrowseTheWeb ability
   * @param {Actor} actor - The actor asking the question
   * @returns {Promise<string|boolean>} The cart badge information
   */
  async answeredBy(actor) {
    const { BrowseTheWeb } = await import('../abilities/BrowseTheWeb.js');
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();

    if (this.query === 'visibility') {
      try {
        await page.waitForSelector('.shopping_cart_badge', { timeout: 1000 });
        return true;
      } catch {
        return false;
      }
    }

    if (this.query === 'count') {
      try {
        const badge = await page.$('.shopping_cart_badge');
        if (!badge) return '0';
        return await badge.textContent();
      } catch {
        return '0';
      }
    }

    if (this.query === 'specific-count') {
      try {
        const badge = await page.$('.shopping_cart_badge');
        if (!badge && this.expectedCount === '0') return true;
        if (!badge) return false;
        const actualCount = await badge.textContent();
        return actualCount === this.expectedCount;
      } catch {
        return this.expectedCount === '0';
      }
    }

    return false;
  }

  /**
   * Returns a string representation of the question
   * @returns {string}
   */
  toString() {
    if (this.query === 'count') return 'cart badge count';
    if (this.query === 'visibility') return 'cart badge visibility';
    if (this.query === 'specific-count') return `cart badge shows ${this.expectedCount}`;
    return 'cart badge information';
  }
}

export { CartBadge }; 