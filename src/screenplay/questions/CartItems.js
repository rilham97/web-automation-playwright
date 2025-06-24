/**
 * CartItems - Screenplay Pattern Question
 * Retrieves information about items in the shopping cart
 */

class CartItems {
  constructor(itemName = null, query = 'presence') {
    this.itemName = itemName;
    this.query = query;
  }

  /**
   * Static factory method to check if an item is present in cart
   * @param {string} itemName - The name of the item to check
   * @returns {CartItems} The question instance
   */
  static contains(itemName) {
    return new CartItems(itemName, 'presence');
  }

  /**
   * Static factory method to check if cart is empty
   * @returns {CartItems} The question instance
   */
  static isEmpty() {
    return new CartItems(null, 'empty');
  }

  /**
   * Static factory method to get all items in cart
   * @returns {CartItems} The question instance
   */
  static list() {
    return new CartItems(null, 'list');
  }

  /**
   * Answered by the actor using their BrowseTheWeb ability
   * @param {Actor} actor - The actor asking the question
   * @returns {Promise<boolean|array>} The cart items information
   */
  async answeredBy(actor) {
    const { BrowseTheWeb } = await import('../abilities/BrowseTheWeb.js');
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();

    if (this.query === 'presence') {
      try {
        // Check if specific item is in cart
        const cartItems = await page.$$('.cart_item');
        for (const item of cartItems) {
          const itemTitle = await item.$('.inventory_item_name');
          if (itemTitle) {
            const title = await itemTitle.textContent();
            if (title.includes(this.itemName)) {
              return true;
            }
          }
        }
        return false;
      } catch {
        return false;
      }
    }

    if (this.query === 'empty') {
      try {
        const cartItems = await page.$$('.cart_item');
        return cartItems.length === 0;
      } catch {
        return true;
      }
    }

    if (this.query === 'list') {
      try {
        const cartItems = await page.$$('.cart_item');
        const items = [];
        for (const item of cartItems) {
          const itemTitle = await item.$('.inventory_item_name');
          if (itemTitle) {
            const title = await itemTitle.textContent();
            items.push(title);
          }
        }
        return items;
      } catch {
        return [];
      }
    }

    return false;
  }

  /**
   * Returns a string representation of the question
   * @returns {string}
   */
  toString() {
    if (this.query === 'presence') return `cart contains "${this.itemName}"`;
    if (this.query === 'empty') return 'cart is empty';
    if (this.query === 'list') return 'cart items list';
    return 'cart items information';
  }
}

export { CartItems }; 