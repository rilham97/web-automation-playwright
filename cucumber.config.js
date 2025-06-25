import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { URLS } from './src/constants/urls.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create results directory if it doesn't exist
const resultsDir = path.join(__dirname, 'reports/cucumber');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

/**
 * Cucumber.js Configuration with Screenplay Pattern Support
 * Reference: https://cucumber.io/docs/cucumber/configuration/
 * Note: Allure reporting is configured via command-line in package.json scripts
 */
export default {
  default: {
    // Feature files path
    paths: ['features/**/*.feature'],
    
    // Step definitions path - explicit imports instead of glob patterns
    import: [
      'features/support/world.js',
      'features/step_definitions/global_steps.js',
      'features/step_definitions/login_steps.js',
      'features/step_definitions/cart_steps.js',
      'features/step_definitions/checkout_steps.js',
      'features/step_definitions/sorting_steps.js'
    ],
    
    // Remove requireModule for now to avoid ES module conflicts
    // requireModule: ['allure-cucumberjs'],
    
    // Formatters and reporters (Allure configured separately via CLI)
    format: [
      'progress-bar',
      '@cucumber/pretty-formatter',
      'json:reports/cucumber/cucumber-report.json',
      'html:reports/cucumber/cucumber-report.html'
    ],
    
    // Format options
    formatOptions: {
      snippetInterface: 'async-await'
    },
    
    // Global timeout for steps (30 seconds)
    timeout: 30000,
    
    // Parallel execution
    parallel: 1,
    
    // World parameters (accessible in step definitions)
    worldParameters: {
      baseURL: URLS.BASE,
      headless: false,
      timeout: 30000,
      screenshot: true,
      video: false,
      // Screenplay Pattern configuration
      screenplayEnabled: true
    }
  },
  
  // 🤫 Silent/Headless execution - runs tests without opening browser UI
  headless: {
    paths: ['features/**/*.feature'],
    import: [
      'features/support/world.js',
      'features/step_definitions/global_steps.js',
      'features/step_definitions/login_steps.js',
      'features/step_definitions/cart_steps.js',
      'features/step_definitions/checkout_steps.js',
      'features/step_definitions/sorting_steps.js'
    ],
    // requireModule: ['allure-cucumberjs'],
    format: [
      'progress-bar',
      '@cucumber/pretty-formatter',
      'json:reports/cucumber/cucumber-report.json',
      'html:reports/cucumber/cucumber-report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    timeout: 30000,
    parallel: 1,
    worldParameters: {
      baseURL: URLS.BASE,
      headless: true,        // 🎯 Browser runs in background
      timeout: 30000,
      screenshot: true,      // Still capture screenshots on failure
      video: false,
      screenplayEnabled: true,
      slowMo: 0             // No slow motion in headless mode
    }
  },

  // 🚀 Fast headless execution - optimized for speed
  fast: {
    paths: ['features/**/*.feature'],
    import: [
      'features/support/world.js',
      'features/step_definitions/global_steps.js',
      'features/step_definitions/login_steps.js',
      'features/step_definitions/cart_steps.js',
      'features/step_definitions/checkout_steps.js',
      'features/step_definitions/sorting_steps.js'
    ],
    // requireModule: ['allure-cucumberjs'],
    format: [
      'progress-bar',
      'json:reports/cucumber/cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    timeout: 20000,        // Shorter timeout for speed
    parallel: 2,           // More parallel workers
    worldParameters: {
      baseURL: URLS.BASE,
      headless: true,
      timeout: 20000,
      screenshot: false,    // No screenshots for max speed
      video: false,
      screenplayEnabled: true,
      slowMo: 0
    }
  },
  
  // Configuration for CI environment
  ci: {
    paths: ['features/**/*.feature'],
    import: [
      'features/support/world.js',
      'features/step_definitions/global_steps.js',
      'features/step_definitions/login_steps.js',
      'features/step_definitions/cart_steps.js',
      'features/step_definitions/checkout_steps.js',
      'features/step_definitions/sorting_steps.js'
    ],
    // requireModule: ['allure-cucumberjs'],
    format: [
      'progress-bar',
      'json:reports/cucumber/cucumber-report.json',
      'html:reports/cucumber/cucumber-report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    timeout: 30000,
    parallel: 2,
    worldParameters: {
      baseURL: URLS.BASE,
      headless: true,
      timeout: 30000,
      screenshot: true,
      video: true,
      screenplayEnabled: true
    }
  }
}; 