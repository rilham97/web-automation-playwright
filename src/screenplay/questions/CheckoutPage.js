/**
 * CheckoutPage - Screenplay Pattern Question
 * Retrieves information about the current checkout page state
 */

class CheckoutPage {
  constructor(query = 'isVisible', expectedText = null) {
    this.query = query;
    this.expectedText = expectedText;
  }

  /**
   * Static factory method to check if we're on checkout information page
   * @returns {CheckoutPage} The question instance
   */
  static isInformationStep() {
    return new CheckoutPage('isInformationStep');
  }

  /**
   * Static factory method to check if we're on checkout overview page
   * @returns {CheckoutPage} The question instance
   */
  static isOverviewStep() {
    return new CheckoutPage('isOverviewStep');
  }

  /**
   * Static factory method to check if we're on checkout complete page
   * @returns {CheckoutPage} The question instance
   */
  static isCompleteStep() {
    return new CheckoutPage('isCompleteStep');
  }

  /**
   * Static factory method to check for checkout error message
   * @param {string} expectedError - Expected error message text
   * @returns {CheckoutPage} The question instance
   */
  static hasErrorMessage(expectedError = null) {
    return new CheckoutPage('hasErrorMessage', expectedError);
  }

  /**
   * Static factory method to get the checkout step title
   * @returns {CheckoutPage} The question instance
   */
  static stepTitle() {
    return new CheckoutPage('stepTitle');
  }

  /**
   * Static factory method to check if checkout form fields are visible
   * @returns {CheckoutPage} The question instance
   */
  static hasFormFields() {
    return new CheckoutPage('hasFormFields');
  }

  /**
   * Static factory method to check if payment information is visible
   * @returns {CheckoutPage} The question instance
   */
  static hasPaymentInfo() {
    return new CheckoutPage('hasPaymentInfo');
  }

  /**
   * Static factory method to check if shipping information is visible
   * @returns {CheckoutPage} The question instance
   */
  static hasShippingInfo() {
    return new CheckoutPage('hasShippingInfo');
  }

  /**
   * Static factory method to check completion confirmation
   * @returns {CheckoutPage} The question instance
   */
  static hasCompletionConfirmation() {
    return new CheckoutPage('hasCompletionConfirmation');
  }

  /**
   * Answers the question by interacting with the browser
   * @param {Actor} actor - The actor asking the question
   * @returns {Promise<boolean|string>} The answer to the question
   */
  async answeredBy(actor) {
    const { BrowseTheWeb } = await import('../abilities/BrowseTheWeb.js');
    const browseTheWeb = actor.abilityTo(BrowseTheWeb);
    const page = browseTheWeb.currentPage();

    switch (this.query) {
    case 'isInformationStep':
      return await page.isVisible('[data-test="firstName"]') && 
               await page.isVisible('[data-test="lastName"]') &&
               await page.isVisible('[data-test="postalCode"]');

    case 'isOverviewStep':
      return await page.isVisible('[data-test="finish"]') &&
               await page.isVisible('.summary_info');

    case 'isCompleteStep':
      return await page.isVisible('.complete-header') ||
               await page.isVisible('[data-test="complete-header"]');

    case 'hasErrorMessage': {
      const errorElement = await page.locator('[data-test="error"]');
      const isVisible = await errorElement.isVisible();
      if (!isVisible) return false;
        
      if (this.expectedText) {
        const errorText = await errorElement.textContent();
        return errorText && errorText.includes(this.expectedText);
      }
      return true;
    }

    case 'stepTitle':
      if (await page.isVisible('.title')) {
        return await page.textContent('.title');
      }
      return null;

    case 'hasFormFields':
      return await page.isVisible('[data-test="firstName"]') &&
               await page.isVisible('[data-test="lastName"]') &&
               await page.isVisible('[data-test="postalCode"]');

    case 'hasPaymentInfo':
      return await page.isVisible('.summary_info') &&
               (await page.locator('.summary_info').textContent()).includes('Payment Information');

    case 'hasShippingInfo':
      return await page.isVisible('.summary_info') &&
               (await page.locator('.summary_info').textContent()).includes('Shipping Information');

    case 'hasCompletionConfirmation':
      return await page.isVisible('.complete-header') &&
               await page.isVisible('.complete-text');

    default:
      throw new Error(`Unknown query: ${this.query}`);
    }
  }

  /**
   * Returns a string representation of the question
   * @returns {string}
   */
  toString() {
    switch (this.query) {
    case 'isInformationStep':
      return 'checkout information step is visible';
    case 'isOverviewStep':
      return 'checkout overview step is visible';
    case 'isCompleteStep':
      return 'checkout complete step is visible';
    case 'hasErrorMessage':
      return this.expectedText ? 
        `checkout error message contains "${this.expectedText}"` : 
        'checkout error message is visible';
    case 'stepTitle':
      return 'checkout step title';
    case 'hasFormFields':
      return 'checkout form fields are visible';
    case 'hasPaymentInfo':
      return 'payment information is visible';
    case 'hasShippingInfo':
      return 'shipping information is visible';
    case 'hasCompletionConfirmation':
      return 'completion confirmation is visible';
    default:
      return `checkout page ${this.query}`;
    }
  }
}

export { CheckoutPage }; 