/**
 * ActorManager - Screenplay Pattern Implementation
 * Manages the creation and lifecycle of actors in our test scenarios
 */

import { chromium, firefox, webkit } from '@playwright/test';

class ActorManager {
  constructor() {
    this.actors = new Map();
    this.browser = null;
    this.context = null;
  }

  /**
   * Creates or retrieves an actor by name
   * @param {string} name - The name of the actor
   * @returns {Actor} The actor instance
   */
  async actorCalled(name) {
    if (this.actors.has(name)) {
      return this.actors.get(name);
    }

    // Import Actor class (to avoid circular dependency)
    const { Actor } = await import('./Actor.js');
    
    // Create browser and context if not already created
    if (!this.browser) {
      await this.initializeBrowser();
    }

    const page = await this.context.newPage();
    const actor = new Actor(name, page, this.context);
    
    this.actors.set(name, actor);
    return actor;
  }

  /**
   * Initialize browser and context for all actors
   */
  async initializeBrowser() {
    // Detect headless mode from command line arguments or environment
    const isHeadless = process.env.HEADLESS === 'true' || 
                      process.argv.includes('--profile=headless') ||
                      process.argv.includes('--profile') && process.argv[process.argv.indexOf('--profile') + 1] === 'headless' ||
                      process.argv.includes('--profile') && process.argv[process.argv.indexOf('--profile') + 1] === 'fast' ||
                      process.argv.includes('--profile') && process.argv[process.argv.indexOf('--profile') + 1] === 'ci';
    
    // Determine which browser to use based on environment variable
    const browserType = process.env.BROWSER || 'chromium';
    
    let browserEngine;
    
    switch (browserType.toLowerCase()) {
    case 'firefox':
      browserEngine = firefox;
      break;
    case 'webkit':
      browserEngine = webkit;
      break;
    case 'chromium':
    default:
      browserEngine = chromium;
      break;
    }
    
    // Browser-specific launch options
    const launchOptions = {
      headless: isHeadless,
      slowMo: isHeadless ? 0 : 50 // No slowMo in headless mode for speed
    };
    
    // Add browser-specific configurations for CI stability
    if (process.env.CI) {
      launchOptions.args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ];
      
      // Firefox-specific args for CI
      if (browserType.toLowerCase() === 'firefox') {
        launchOptions.firefoxUserPrefs = {
          'media.navigator.streams.fake': true,
          'media.navigator.permission.disabled': true
        };
      }
    }
    
    // Launch browser with error handling
    try {
      this.browser = await browserEngine.launch(launchOptions);
    } catch (error) {
      console.error(`❌ ActorManager: Failed to launch ${browserType} browser:`, error.message);
      try {
        this.browser = await chromium.launch(launchOptions);
      } catch (fallbackError) {
        console.error('❌ ActorManager: Even Chromium fallback failed:', fallbackError.message);
        throw fallbackError;
      }
    }
    
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 }
      // Add any other context options as needed
    });
  }

  /**
   * Clean up all actors and browser resources
   */
  async cleanup() {
    // Dismiss all actors
    for (const actor of this.actors.values()) {
      await actor.dismiss();
    }
    this.actors.clear();

    // Close browser context and browser
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export { ActorManager }; 