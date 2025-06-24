/**
 * Login - Screenplay Pattern Task
 * High-level business task for user authentication
 */

import { Navigate } from '../interactions/Navigate.js';
import { Enter } from '../interactions/Enter.js';
import { Click } from '../interactions/Click.js';
import { URLS } from '../../constants/urls.js';

class Login {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  /**
   * Static factory method to create a login task with credentials
   * @param {string} username - The username to login with
   * @param {string} password - The password to login with
   * @returns {Login} The login task
   */
  static withCredentials(username, password) {
    return new Login(username, password);
  }

  /**
   * Static factory method to create a login task with valid credentials
   * @returns {Login} The login task with standard user credentials
   */
  static withValidCredentials() {
    return new Login('standard_user', 'secret_sauce');
  }

  /**
   * Static factory method to create a login task with invalid credentials
   * @returns {Login} The login task with invalid credentials
   */
  static withInvalidCredentials() {
    return new Login('invalid_user', 'wrong_password');
  }

  /**
   * Performs the login task as the given actor
   * @param {Actor} actor - The actor performing the task
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    await actor.attemptsTo(
      Navigate.to(URLS.BASE),
      Enter.theValue(this.username).into('[data-test="username"]'),
      Enter.theValue(this.password).into('[data-test="password"]'),
      Click.on('[data-test="login-button"]')
    );
  }

  /**
   * Returns a string representation of the task
   * @returns {string}
   */
  toString() {
    return `log in with username "${this.username}"`;
  }
}

export { Login }; 