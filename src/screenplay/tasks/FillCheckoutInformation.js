/**
 * FillCheckoutInformation - Screenplay Pattern Task
 * High-level business task for filling checkout information form
 */

import { Enter } from '../interactions/Enter.js';

class FillCheckoutInformation {
  constructor(firstName, lastName, postalCode) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.postalCode = postalCode;
  }

  /**
   * Static factory method to fill complete checkout information
   * @param {string} firstName - Customer's first name
   * @param {string} lastName - Customer's last name  
   * @param {string} postalCode - Customer's postal code
   * @returns {FillCheckoutInformation} The fill checkout information task
   */
  static withDetails(firstName, lastName, postalCode) {
    return new FillCheckoutInformation(firstName, lastName, postalCode);
  }

  /**
   * Static factory method to fill only first name (for validation testing)
   * @param {string} firstName - Customer's first name
   * @returns {FillCheckoutInformation} The fill checkout information task
   */
  static withFirstName(firstName) {
    return new FillCheckoutInformation(firstName, '', '');
  }

  /**
   * Static factory method to fill only last name (for validation testing)
   * @param {string} lastName - Customer's last name
   * @returns {FillCheckoutInformation} The fill checkout information task
   */
  static withLastName(lastName) {
    return new FillCheckoutInformation('', lastName, '');
  }

  /**
   * Static factory method to fill only postal code (for validation testing)
   * @param {string} postalCode - Customer's postal code
   * @returns {FillCheckoutInformation} The fill checkout information task
   */
  static withPostalCode(postalCode) {
    return new FillCheckoutInformation('', '', postalCode);
  }

  /**
   * Performs the fill checkout information task as the given actor
   * @param {Actor} actor - The actor performing the task
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    const actions = [];

    if (this.firstName) {
      actions.push(Enter.theValue(this.firstName).into('[data-test="firstName"]'));
    }
    
    if (this.lastName) {
      actions.push(Enter.theValue(this.lastName).into('[data-test="lastName"]'));
    }
    
    if (this.postalCode) {
      actions.push(Enter.theValue(this.postalCode).into('[data-test="postalCode"]'));
    }

    if (actions.length > 0) {
      await actor.attemptsTo(...actions);
    }
  }

  /**
   * Returns a string representation of the task
   * @returns {string}
   */
  toString() {
    if (this.firstName && this.lastName && this.postalCode) {
      return `fill checkout information with "${this.firstName}", "${this.lastName}", and "${this.postalCode}"`;
    } else {
      const parts = [];
      if (this.firstName) parts.push(`first name "${this.firstName}"`);
      if (this.lastName) parts.push(`last name "${this.lastName}"`);
      if (this.postalCode) parts.push(`postal code "${this.postalCode}"`);
      return `fill checkout information with ${parts.join(', ')}`;
    }
  }
}

export { FillCheckoutInformation }; 