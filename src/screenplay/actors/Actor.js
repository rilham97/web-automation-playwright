/**
 * Actor - Screenplay Pattern Implementation
 * Represents a person or external system interacting with the system under test
 */

class Actor {
  constructor(name, page, context) {
    this.name = name;
    this.page = page;
    this.context = context;
    this.abilities = new Map();
    this.notes = new Map();
  }

  /**
   * Gives the actor abilities
   * @param {...Ability} abilities - The abilities to give to the actor
   * @returns {Actor} The actor instance for method chaining
   */
  whoCan(...abilities) {
    abilities.forEach(ability => {
      ability.actorUsingAbility = this;
      this.abilities.set(ability.constructor.name, ability);
    });
    return this;
  }

  /**
   * Retrieves an actor's ability of the specified type
   * @param {Function} abilityType - The constructor of the ability type
   * @returns {Ability} The ability instance
   */
  abilityTo(abilityType) {
    const abilityName = abilityType.name;
    if (!this.abilities.has(abilityName)) {
      throw new Error(`${this.name} does not have the ability to ${abilityName}`);
    }
    return this.abilities.get(abilityName);
  }

  /**
   * Instructs the actor to attempt to perform a sequence of activities
   * @param {...Activity} activities - The activities to perform
   * @returns {Promise<void>}
   */
  async attemptsTo(...activities) {
    const isVerbose = this.shouldLogVerbosely();
    
    for (const activity of activities) {
      try {
        if (isVerbose) console.log(`${this.name} attempts to ${activity.toString()}`);
        await activity.performAs(this);
        if (isVerbose) console.log(`${this.name} successfully ${activity.toString()}`);
      } catch (error) {
        console.error(`${this.name} failed to ${activity.toString()}: ${error.message}`);
        throw error;
      }
    }
  }

  /**
   * Instructs the actor to ask a question about the state of the system
   * @param {Question} question - The question to ask
   * @returns {Promise<any>} The answer to the question
   */
  async asks(question) {
    const isVerbose = this.shouldLogVerbosely();
    
    try {
      if (isVerbose) console.log(`${this.name} asks: ${question.toString()}`);
      const answer = await question.answeredBy(this);
      if (isVerbose) console.log(`${this.name} receives answer: ${answer}`);
      return answer;
    } catch (error) {
      console.error(`${this.name} failed to get answer for: ${question.toString()}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Stores a note for the actor to remember
   * @param {string} key - The key to store the note under
   * @param {any} value - The value to store
   */
  remember(key, value) {
    this.notes.set(key, value);
  }

  /**
   * Retrieves a previously stored note
   * @param {string} key - The key of the note to retrieve
   * @returns {any} The stored value
   */
  recall(key) {
    return this.notes.get(key);
  }

  /**
   * Checks if the actor remembers a note
   * @param {string} key - The key to check
   * @returns {boolean} True if the note exists
   */
  remembers(key) {
    return this.notes.has(key);
  }

  /**
   * Determines whether to log verbose actor actions
   * @returns {boolean} True if verbose logging should be enabled
   */
  shouldLogVerbosely() {
    // Check if running in headless mode (suppress verbose output)
    const isHeadless = process.env.HEADLESS === 'true' || 
                      process.argv.includes('--profile=headless') ||
                      (process.argv.includes('--profile') && 
                       process.argv[process.argv.indexOf('--profile') + 1] === 'headless');
    
    // Check if explicitly requested to be verbose
    const isVerbose = process.env.VERBOSE === 'true' || process.argv.includes('--verbose');
    
    // Show verbose output if explicitly requested, or if NOT in headless mode
    return isVerbose || !isHeadless;
  }

  /**
   * Clean up the actor's resources
   */
  async dismiss() {
    if (this.page && !this.page.isClosed()) {
      await this.page.close();
    }
    this.abilities.clear();
    this.notes.clear();
  }

  /**
   * Returns a string representation of the actor
   * @returns {string}
   */
  toString() {
    return this.name;
  }
}

export { Actor }; 