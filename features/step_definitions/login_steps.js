/**
 * Screenplay Pattern Step Definitions for Login
 * BDD step implementations using the Screenplay Pattern
 * NOTE: Common steps moved to global_steps.js
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { 
  Navigate,
  Click,
  Login,
  Text,
  Visibility,
  Ensure,
  PageTitle,
  CurrentUrl
} from '../../src/screenplay/index.js';
import { URLS } from '../../src/constants/urls.js';

// ==================== GIVEN Steps (Arrange) ====================

Given('I am a customer named {string}', async function (actorName) {
  this.actor = await this.actorCalled(actorName);
});

Given('{word} is on the Sauce Demo login page', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(
    Navigate.to(URLS.BASE)
  );
});

Given('{word} is a registered user with valid credentials', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  // Store valid credentials for this actor
  actor.remember('username', 'standard_user');
  actor.remember('password', 'secret_sauce');
});

Given('{word} has invalid credentials', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  // Store invalid credentials for this actor
  actor.remember('username', 'invalid_user');
  actor.remember('password', 'wrong_password');
});

// ==================== WHEN Steps (Act) ====================

When('{word} attempts to log in with valid credentials', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(
    Login.withValidCredentials()
  );
});

When('{word} attempts to log in with invalid credentials', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(
    Login.withInvalidCredentials()
  );
});

When('{word} enters username {string} and password {string}', async function (actorName, username, password) {
  const actor = await this.actorCalled(actorName);
  await actor.attemptsTo(
    Login.withCredentials(username, password)
  );
});

When('{word} logs in with their stored credentials', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  const username = actor.recall('username');
  const password = actor.recall('password');
  
  await actor.attemptsTo(
    Login.withCredentials(username, password)
  );
});

When('{word} attempts to log in with username {string} and password {string}', async function (actorName, username, password) {
  const actor = await this.actorCalled(actorName);
  
  // Remember user data for validation
  actor.remember('attemptedUsername', username);
  actor.remember('attemptedPassword', password);
  
  await actor.attemptsTo(
    Login.withCredentials(username, password)
  );
});

When('{word} clicks the hamburger menu', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Click.on('#react-burger-menu-btn')
  );
});

When('{word} clicks the logout link', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Click.on('#logout_sidebar_link')
  );
});

// ==================== THEN Steps (Assert) ====================

Then('{word} should be redirected to the products page', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Use the new CurrentUrl question for better validation
  await actor.attemptsTo(
    Ensure.that(CurrentUrl.isInventoryPage()).isTrue()
  );
});

Then('{word} should see the products page header', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Ensure.that(Text.of('.header_secondary_container')).contains('Products'),
    Ensure.that(Visibility.of('.header_secondary_container')).isVisible()
  );
});

// Generic error message steps moved to global_steps.js

Then('{word} should remain on the login page', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Use the new CurrentUrl question for better validation
  await actor.attemptsTo(
    Ensure.that(CurrentUrl.isLoginPage()).isTrue()
  );
});

Then('the page title should be {string}', async function (expectedTitle) {
  const actor = this.getCurrentActor();
  
  await actor.attemptsTo(
    Ensure.that(PageTitle.displayed()).equals(expectedTitle)
  );
});

Then('{word} should see the result {string}', async function (actorName, expectedResult) {
  const actor = await this.actorCalled(actorName);
  
  if (expectedResult === 'success') {
    // Check for successful login (redirected to products page)
    await actor.attemptsTo(
      Ensure.that(CurrentUrl.isInventoryPage()).isTrue()
    );
  } else if (expectedResult === 'error') {
    // Check for error message
    await actor.attemptsTo(
      Ensure.that(Visibility.of('[data-test="error"]')).isVisible()
    );
  }
});

Then('{word} should be redirected to the login page', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  // Use the new CurrentUrl question for better validation
  await actor.attemptsTo(
    Ensure.that(CurrentUrl.isLoginPage()).isTrue()
  );
});

Then('{word} should see the login form', async function (actorName) {
  const actor = await this.actorCalled(actorName);
  
  await actor.attemptsTo(
    Ensure.that(Visibility.of('[data-test="username"]')).isVisible(),
    Ensure.that(Visibility.of('[data-test="password"]')).isVisible(),
    Ensure.that(Visibility.of('[data-test="login-button"]')).isVisible()
  );
}); 