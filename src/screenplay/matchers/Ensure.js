/**
 * Ensure - Screenplay Pattern Assertion Interaction
 * High-level interaction for making assertions in a readable way
 */

import * as allure from 'allure-js-commons';
import { ContentType } from 'allure-js-commons';

class Ensure {
  constructor(actual, matcher) {
    this.actual = actual;
    this.matcher = matcher;
  }

  /**
   * Static factory method to create an assertion
   * @param {any} actual - The actual value or question to check
   * @returns {EnsureBuilder} Builder for completing the assertion
   */
  static that(actual) {
    return new EnsureBuilder(actual);
  }

  /**
   * Performs the assertion as the given actor
   * @param {Actor} actor - The actor performing the assertion
   * @returns {Promise<void>}
   */
  async performAs(actor) {
    let actualValue;
    
    // If actual is a question, ask the actor to answer it
    if (this.actual && typeof this.actual.answeredBy === 'function') {
      actualValue = await this.actual.answeredBy(actor);
    } else {
      actualValue = this.actual;
    }

    // Perform the assertion using the matcher
    const result = this.matcher.matches(actualValue);
    
    if (!result.passed) {
      // Try to attach screenshot if available (for failed assertions)
      await this.attachScreenshotOnFailure(actor);
      throw new Error(`Assertion failed: ${result.message}`);
    }
  }

  /**
   * Attempts to attach a screenshot when assertion fails
   * @param {Actor} actor - The actor that failed the assertion
   */
  async attachScreenshotOnFailure(actor) {
    try {
      // Capture screenshot immediately and save to file for later attachment
      if (actor && actor.page) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Generate scenario-based filename with feature/story/scenario prefix
        let scenarioPrefix = 'unknown-test';
        if (globalThis.currentWorld && globalThis.currentWorld.getScenarioIdentifier) {
          scenarioPrefix = globalThis.currentWorld.getScenarioIdentifier();
        }
        
        const screenshotPath = `screenshots/assertion-failure-${scenarioPrefix}-${timestamp}.png`;
        
        // Ensure screenshots directory exists
        const fs = await import('fs');
        const path = await import('path');
        const screenshotsDir = path.default.join(process.cwd(), 'screenshots');
        if (!fs.default.existsSync(screenshotsDir)) {
          fs.default.mkdirSync(screenshotsDir, { recursive: true });
        }
        
        // Take screenshot and save to file
        await actor.page.screenshot({ path: screenshotPath, fullPage: true });
        
        // Use file-based attachment as recommended in official docs
        await allure.attachmentPath('Assertion Failure Screenshot', screenshotPath, {
          contentType: ContentType.PNG,
          fileExtension: 'png'
        });
      } else if (globalThis.currentWorld && globalThis.currentWorld.currentActor && globalThis.currentWorld.currentActor.page) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Generate scenario-based filename with feature/story/scenario prefix (fallback)
        let scenarioPrefix = 'unknown-test';
        if (globalThis.currentWorld && globalThis.currentWorld.getScenarioIdentifier) {
          scenarioPrefix = globalThis.currentWorld.getScenarioIdentifier();
        }
        
        const screenshotPath = `screenshots/assertion-failure-${scenarioPrefix}-fallback-${timestamp}.png`;
        
        await globalThis.currentWorld.currentActor.page.screenshot({ path: screenshotPath, fullPage: true });
        
        await allure.attachmentPath('Assertion Failure Screenshot', screenshotPath, {
          contentType: ContentType.PNG,
          fileExtension: 'png'
        });
      }
    } catch (error) {
      console.error('❌ Failed to attach screenshot from Ensure matcher:', error.message);
    }
  }

  /**
   * Returns a string representation of the assertion
   * @returns {string}
   */
  toString() {
    return `ensure that ${this.actual.toString ? this.actual.toString() : this.actual} ${this.matcher.toString()}`;
  }
}

/**
 * Builder class for completing the Ensure assertion
 */
class EnsureBuilder {
  constructor(actual) {
    this.actual = actual;
  }

  /**
   * Specifies the matcher for the assertion
   * @param {Matcher} matcher - The matcher to use for the assertion
   * @returns {Ensure} The complete Ensure assertion
   */
  equals(expected) {
    return new Ensure(this.actual, new EqualsMatcher(expected));
  }

  contains(expected) {
    return new Ensure(this.actual, new ContainsMatcher(expected));
  }

  isVisible() {
    return new Ensure(this.actual, new VisibilityMatcher(true));
  }

  isNotVisible() {
    return new Ensure(this.actual, new VisibilityMatcher(false));
  }

  isTrue() {
    return new Ensure(this.actual, new BooleanMatcher(true));
  }

  isFalse() {
    return new Ensure(this.actual, new BooleanMatcher(false));
  }
}

/**
 * Matcher for equality assertions
 */
class EqualsMatcher {
  constructor(expected) {
    this.expected = expected;
  }

  matches(actual) {
    const passed = actual === this.expected;
    return {
      passed,
      message: passed 
        ? `Expected "${actual}" to equal "${this.expected}"`
        : `Expected "${actual}" to equal "${this.expected}", but it didn't`
    };
  }

  toString() {
    return `equals "${this.expected}"`;
  }
}

/**
 * Matcher for containment assertions
 */
class ContainsMatcher {
  constructor(expected) {
    this.expected = expected;
  }

  matches(actual) {
    const passed = actual && actual.includes && actual.includes(this.expected);
    return {
      passed,
      message: passed 
        ? `Expected "${actual}" to contain "${this.expected}"`
        : `Expected "${actual}" to contain "${this.expected}", but it didn't`
    };
  }

  toString() {
    return `contains "${this.expected}"`;
  }
}

/**
 * Matcher for visibility assertions
 */
class VisibilityMatcher {
  constructor(shouldBeVisible) {
    this.shouldBeVisible = shouldBeVisible;
  }

  matches(actual) {
    const passed = actual === this.shouldBeVisible;
    return {
      passed,
      message: passed 
        ? `Expected element to ${this.shouldBeVisible ? 'be visible' : 'not be visible'}`
        : `Expected element to ${this.shouldBeVisible ? 'be visible' : 'not be visible'}, but it ${actual ? 'was visible' : 'was not visible'}`
    };
  }

  toString() {
    return this.shouldBeVisible ? 'is visible' : 'is not visible';
  }
}

/**
 * Matcher for boolean assertions
 */
class BooleanMatcher {
  constructor(expectedValue) {
    this.expectedValue = expectedValue;
  }

  matches(actual) {
    const passed = Boolean(actual) === this.expectedValue;
    return {
      passed,
      message: passed 
        ? `Expected "${actual}" to be ${this.expectedValue}`
        : `Expected "${actual}" to be ${this.expectedValue}, but it was ${actual}`
    };
  }

  toString() {
    return `is ${this.expectedValue}`;
  }
}

export { Ensure }; 