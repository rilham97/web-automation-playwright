/**
 * OrderSummary - Screenplay Pattern Question
 * Retrieves information about order summary and price calculations
 */

class OrderSummary {
  constructor(itemName = null, query = 'itemPresent') {
    this.itemName = itemName;
    this.query = query;
  }

  /**
   * Static factory method to check if an item is present in checkout
   * @param {string} itemName - The name of the item to check
   * @returns {OrderSummary} The question instance
   */
  static containsItem(itemName) {
    return new OrderSummary(itemName, 'itemPresent');
  }

  /**
   * Static factory method to get the item total
   * @returns {OrderSummary} The question instance
   */
  static itemTotal() {
    return new OrderSummary(null, 'itemTotal');
  }

  /**
   * Static factory method to get the tax amount
   * @returns {OrderSummary} The question instance
   */
  static taxAmount() {
    return new OrderSummary(null, 'taxAmount');
  }

  /**
   * Static factory method to get the final total
   * @returns {OrderSummary} The question instance
   */
  static finalTotal() {
    return new OrderSummary(null, 'finalTotal');
  }

  /**
   * Static factory method to check if calculations are correct
   * @returns {OrderSummary} The question instance
   */
  static hasCorrectCalculations() {
    return new OrderSummary(null, 'correctCalculations');
  }

  /**
   * Static factory method to get price breakdown details
   * @returns {OrderSummary} The question instance
   */
  static priceBreakdown() {
    return new OrderSummary(null, 'priceBreakdown');
  }

  /**
   * Answers the question by interacting with the browser
   * @param {Actor} actor - The actor asking the question
   * @returns {Promise<boolean|string|number>} The answer to the question
   */
  async answeredBy(actor) {
    const { BrowseTheWeb } = await import('../abilities/BrowseTheWeb.js');
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();

    switch (this.query) {
    case 'itemPresent': {
      // Check if item is present in checkout items list
      const items = await page.locator('.cart_item').all();
      for (const item of items) {
        const itemText = await item.textContent();
        if (itemText.includes(this.itemName)) {
          return true;
        }
      }
      return false;
    }

    case 'itemTotal': {
      // Get the subtotal amount
      if (await page.isVisible('.summary_subtotal_label')) {
        const subtotalText = await page.textContent('.summary_subtotal_label');
        const match = subtotalText.match(/\$(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
      }
      return 0;
    }

    case 'taxAmount': {
      // Get the tax amount
      if (await page.isVisible('.summary_tax_label')) {
        const taxText = await page.textContent('.summary_tax_label');
        const match = taxText.match(/\$(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
      }
      return 0;
    }

    case 'finalTotal': {
      // Get the final total
      if (await page.isVisible('.summary_total_label')) {
        const totalText = await page.textContent('.summary_total_label');
        const match = totalText.match(/\$(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
      }
      return 0;
    }

    case 'correctCalculations': {
      // Verify that final total = item total + tax
      const itemTotalValue = await this.getSubtotal(page);
      const taxValue = await this.getTax(page);
      const finalTotalValue = await this.getTotal(page);
        
      const expectedTotal = itemTotalValue + taxValue;
      const tolerance = 0.01; // Allow for small floating point differences
        
      return Math.abs(finalTotalValue - expectedTotal) < tolerance;
    }

    case 'priceBreakdown':
      // Get all price information as an object
      return {
        itemTotal: await this.getSubtotal(page),
        tax: await this.getTax(page),
        finalTotal: await this.getTotal(page)
      };

    default:
      throw new Error(`Unknown query: ${this.query}`);
    }
  }

  /**
   * Helper method to get subtotal from page
   * @private
   */
  async getSubtotal(page) {
    if (await page.isVisible('.summary_subtotal_label')) {
      const subtotalText = await page.textContent('.summary_subtotal_label');
      const match = subtotalText.match(/\$(\d+\.?\d*)/);
      return match ? parseFloat(match[1]) : 0;
    }
    return 0;
  }

  /**
   * Helper method to get tax from page
   * @private
   */
  async getTax(page) {
    if (await page.isVisible('.summary_tax_label')) {
      const taxText = await page.textContent('.summary_tax_label');
      const match = taxText.match(/\$(\d+\.?\d*)/);
      return match ? parseFloat(match[1]) : 0;
    }
    return 0;
  }

  /**
   * Helper method to get total from page
   * @private
   */
  async getTotal(page) {
    if (await page.isVisible('.summary_total_label')) {
      const totalText = await page.textContent('.summary_total_label');
      const match = totalText.match(/\$(\d+\.?\d*)/);
      return match ? parseFloat(match[1]) : 0;
    }
    return 0;
  }

  /**
   * Returns a string representation of the question
   * @returns {string}
   */
  toString() {
    switch (this.query) {
    case 'itemPresent':
      return `order summary contains "${this.itemName}"`;
    case 'itemTotal':
      return 'item total in order summary';
    case 'taxAmount':
      return 'tax amount in order summary';
    case 'finalTotal':
      return 'final total in order summary';
    case 'correctCalculations':
      return 'order summary has correct calculations';
    case 'priceBreakdown':
      return 'price breakdown in order summary';
    default:
      return `order summary ${this.query}`;
    }
  }
}

export { OrderSummary }; 