/**
 * Ensure - Screenplay Pattern Assertion Interaction
 * High-level interaction for making assertions in a readable way
 */

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
      throw new Error(`Assertion failed: ${result.message}`);
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