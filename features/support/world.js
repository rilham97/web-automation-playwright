import { setWorldConstructor, Before, After, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from '@playwright/test';
import { URLS } from '../../src/constants/urls.js';
import fs from 'fs';
import path from 'path';
// Import allure-cucumberjs first for proper context initialization
import 'allure-cucumberjs';
// Removed unused imports: allure, ContentType (Nuclear Option handles screenshot attachment)

// Screenplay Pattern imports (minimal for testing)
import { ActorManager, BrowseTheWeb, Navigate, Click, Enter, Ensure, CurrentUrl } from '../../src/screenplay/index.js';

// Set default timeout for all steps
setDefaultTimeout(30 * 1000);

/**
 * Custom World class for Cucumber
 * This class manages browser context and page objects
 */
class CustomWorld {
  constructor(options) {
    this.options = options;
    this.browser = null;
    this.context = null;
    this.page = null;
    
    // Note: Traditional page objects removed - now using Screenplay Pattern
    
    // Test data
    this.testData = {};
    
    // Screenshots
    this.screenshotPath = null;
    
    // Screenplay Pattern support
    this.actorManager = new ActorManager();
    this.currentActor = null;
    this.screenshotCount = 0;
    
    // Store scenario context for screenshot naming
    this.scenarioContext = {
      feature: null,
      story: null,
      scenario: null,
      tags: []
    };
    
    // Make this world instance globally available for screenshot attachment
    globalThis.currentWorld = this;
  }

  /**
   * Set scenario context for enhanced screenshot naming
   * @param {Object} scenario - Cucumber scenario object
   */
  setScenarioContext(scenario) {
    this.scenarioContext.scenario = scenario.pickle?.name || scenario.name || 'Unknown';
    this.scenarioContext.tags = scenario.pickle?.tags?.map(tag => tag.name) || scenario.tags || [];
    
    // Extract feature name from gherkinDocument
    if (scenario.gherkinDocument) {
      this.scenarioContext.feature = scenario.gherkinDocument.feature?.name || 'Unknown';
    }
    
    // Extract story from tags (e.g., @allure.label.story:AddToCart)
    const storyTag = this.scenarioContext.tags.find(tag => tag.includes('allure.label.story:'));
    if (storyTag) {
      this.scenarioContext.story = storyTag.split(':')[1] || 'Unknown';
    }
  }

  /**
   * Generate a unique identifier for the current scenario
   * @returns {string} Formatted scenario identifier
   */
  getScenarioIdentifier() {
    const { feature, story, scenario } = this.scenarioContext;
    
    // Clean up names for filesystem safety
    const cleanName = (name) => name ? name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-') : 'Unknown';
    
    const parts = [];
    if (feature && feature !== 'Unknown') parts.push(cleanName(feature));
    if (story && story !== 'Unknown') parts.push(cleanName(story));
    if (scenario && scenario !== 'Unknown') parts.push(cleanName(scenario));
    
    return parts.length > 0 ? parts.join('_') : 'Unknown-Test';
  }

  /**
   * Initialize browser and page objects
   */
  async init() {
    // Get world parameters from multiple possible sources
    const worldParams = this.options?.parameters || this.parameters || {};
    
    // Check if headless is forced via environment variable
    const isHeadless = process.env.HEADLESS === 'true' || 
                      worldParams.headless === true ||
                      process.argv.includes('--profile=headless') ||
                      process.argv.includes('--profile') && process.argv[process.argv.indexOf('--profile') + 1] === 'headless';
    
    // Determine which browser to use
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
      slowMo: isHeadless ? 0 : (worldParams.slowMo || 50),
      devtools: !isHeadless
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
      console.error(`❌ Failed to launch ${browserType} browser:`, error.message);
      try {
        this.browser = await chromium.launch(launchOptions);
      } catch (fallbackError) {
        console.error('❌ Even Chromium fallback failed:', fallbackError.message);
        throw fallbackError;
      }
    }
    
    // Create context
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      // Record video if enabled
      ...(worldParams.video && {
        recordVideo: {
          dir: 'reports/videos/',
          size: { width: 1280, height: 720 }
        }
      })
    });
    
    // Create page
    this.page = await this.context.newPage();
    
    // Note: Traditional page object initialization removed - now using Screenplay Pattern
    
    // Navigate to base URL
    const baseURL = worldParams.baseURL || URLS.BASE;
    await this.page.goto(baseURL);
  }

  /**
   * Creates or retrieves an actor by name (Screenplay Pattern)
   * @param {string} name - The name of the actor
   * @returns {Promise<Actor>} The actor instance
   */
  async actorCalled(name) {
    const actor = await this.actorManager.actorCalled(name);
    
    // Give the actor the ability to browse the web
    actor.whoCan(BrowseTheWeb.using(actor.page));
    
    // Set as current actor for convenience
    this.currentActor = actor;
    
    return actor;
  }

  /**
   * Gets the current actor (convenience method for Screenplay Pattern)
   * @returns {Actor} The current actor
   */
  getCurrentActor() {
    return this.currentActor;
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name = 'screenshot') {
    if (this.page) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      this.screenshotPath = `screenshots/${name}-${timestamp}.png`;
      
      // Ensure screenshots directory exists
      const screenshotsDir = path.join(process.cwd(), 'screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      
      // Take screenshot
      await this.page.screenshot({ path: this.screenshotPath, fullPage: true });
      
      return this.screenshotPath;
    }
    
    // Try screenshot with current actor if page is not available
    if (!this.page && this.currentActor && this.currentActor.page) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        this.screenshotCount++;
        const fileName = `${name}-${this.screenshotCount}-${timestamp}.png`;
        const screenshotPath = path.join('screenshots', fileName);
        
        // Ensure screenshots directory exists
        const screenshotsDir = path.dirname(screenshotPath);
        if (!fs.existsSync(screenshotsDir)) {
          fs.mkdirSync(screenshotsDir, { recursive: true });
        }

        await this.currentActor.page.screenshot({
          path: screenshotPath,
          fullPage: true
        });

        return screenshotPath;
      } catch (error) {
        console.error('Failed to take screenshot:', error.message);
        return null;
      }
    }
    
    return null;
  }

  /**
   * Clean up browser resources
   */
  async cleanup() {
    // Clean up screenplay pattern resources
    if (this.actorManager) {
      await this.actorManager.cleanup();
    }
    
    // Clean up traditional page object resources
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Set the custom world constructor with parameter support
setWorldConstructor(function(options) {
  // Pass the cucumber options to our CustomWorld
  return new CustomWorld(options);
});

/**
 * Before hook to capture scenario context for enhanced screenshot naming
 */
Before(function(scenario) {
  // Store scenario information for enhanced screenshot naming
  this.setScenarioContext(scenario);
});

/**
 * Before hook - runs before each non-authenticated scenario
 */
Before({ tags: 'not @authenticated' }, async function() {
  await this.init();
});

/**
 * Before hook for authenticated scenarios - runs before scenarios tagged with @authenticated
 * Automatically logs in with standard user credentials using Screenplay Pattern
 */
Before({ tags: '@authenticated' }, async function() {
  await this.init();
  
  // Use Screenplay Pattern for authentication
  const actor = await this.actorCalled('Standard User');
  
  await actor.attemptsTo(
    Navigate.to(URLS.BASE),
    Enter.theValue('standard_user').into('[data-test="username"]'),
    Enter.theValue('secret_sauce').into('[data-test="password"]'),
    Click.on('[data-test="login-button"]')
  );
  
  // Wait for products page to load by checking URL
  await actor.attemptsTo(
    Ensure.that(CurrentUrl.isInventoryPage()).isTrue()
  );
});

/**
 * After hook - runs after each scenario
 */
After({ name: 'Capture screenshot on failure' }, async function(scenario) {
  // NOTE: Screenshot generation moved to Ensure.js for assertion failures
  // The Nuclear Option script will handle screenshot attachment post-test
  // This eliminates redundant screenshot generation and improves accuracy
  
  if (scenario.result.status === Status.FAILED) {
    // Screenshot already captured by Ensure.js, Nuclear Option will handle attachment
  }
  
  await this.cleanup();
});

// World setup complete - all screenshot attachment logic moved to After hook 