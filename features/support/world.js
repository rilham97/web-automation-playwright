import { setWorldConstructor, Before, After, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { URLS } from '../../src/constants/urls.js';
import fs from 'fs';
import path from 'path';

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
    
    // Log execution mode for confirmation
    if (isHeadless) {
      console.log('🤫 Running in HEADLESS mode - browser will not be visible');
    }
    
    // Launch browser
    this.browser = await chromium.launch({ 
      headless: isHeadless,
      slowMo: isHeadless ? 0 : (worldParams.slowMo || 50), // No slowMo in headless mode for speed
      devtools: !isHeadless  // Open devtools only in headed mode
    });
    
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
      
      console.log(`Screenshot saved: ${this.screenshotPath}`);
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

        console.log(`Screenshot saved: ${screenshotPath}`);
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
  
  console.log('🔐 Attempting login with username: standard_user');
  
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
After(async function(scenario) {
  // Take screenshot on failure
  if (scenario.result.status === Status.FAILED) {
    const scenarioName = scenario.pickle.name.replace(/\s+/g, '-');
    const screenshotPath = await this.takeScreenshot(`failure-${scenarioName}`);
    
    // Add screenshot to report if available (skip for now to avoid errors)
    if (screenshotPath && fs.existsSync(screenshotPath)) {
      console.log(`Screenshot saved: ${screenshotPath}`);
      // Note: this.attach function needs proper setup - for now just log
    }
  }
  
  await this.cleanup();
}); 