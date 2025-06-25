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
    // Feature files
    features: ['features/**/*.feature'],
    
    // Step definitions and support files - using glob patterns
    import: [
      'features/support/**/*.js',
      'features/step_definitions/**/*.js'
    ],
    
    // Default formatters
    format: [
      '@cucumber/pretty-formatter',
      'allure-cucumberjs/reporter'
    ],
    
    // Output directory for JSON results
    formatOptions: {
      resultsDir: resultsDir
    },
    
    // Retry failed scenarios
    retry: 0,
    
    // Parallel execution
    parallel: 1,
    
    // Exit on first failure
    failFast: false,
    
    // Default world parameters
    worldParameters: {
      baseUrl: URLS.BASE
    }
  },

  // Profile for headless execution (CI/CD)
  headless: {
    features: ['features/**/*.feature'],
    import: [
      'features/support/**/*.js',
      'features/step_definitions/**/*.js'
    ],
    format: [
      '@cucumber/pretty-formatter',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      resultsDir: resultsDir
    },
    retry: 0,
    parallel: 1,
    failFast: false,
    worldParameters: {
      baseUrl: URLS.BASE,
      headless: true
    }
  },

  // Profile for smoke tests
  smoke: {
    features: ['features/**/*.feature'],
    import: [
      'features/support/**/*.js',
      'features/step_definitions/**/*.js'
    ],
    format: [
      '@cucumber/pretty-formatter',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      resultsDir: resultsDir
    },
    tags: '@smoke',
    retry: 0,
    parallel: 1,
    failFast: false,
    worldParameters: {
      baseUrl: URLS.BASE
    }
  },

  // Profile for login tests
  login: {
    features: ['features/**/*.feature'],
    import: [
      'features/support/**/*.js',
      'features/step_definitions/**/*.js'
    ],
    format: [
      '@cucumber/pretty-formatter',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      resultsDir: resultsDir
    },
    tags: '@login',
    retry: 0,
    parallel: 1,
    failFast: false,
    worldParameters: {
      baseUrl: URLS.BASE
    }
  },

  // Profile for cart tests
  cart: {
    features: ['features/**/*.feature'],
    import: [
      'features/support/**/*.js',
      'features/step_definitions/**/*.js'
    ],
    format: [
      '@cucumber/pretty-formatter',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      resultsDir: resultsDir
    },
    tags: '@cart',
    retry: 0,
    parallel: 1,
    failFast: false,
    worldParameters: {
      baseUrl: URLS.BASE
    }
  },

  // Profile for checkout tests
  checkout: {
    features: ['features/**/*.feature'],
    import: [
      'features/support/**/*.js',
      'features/step_definitions/**/*.js'
    ],
    format: [
      '@cucumber/pretty-formatter',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      resultsDir: resultsDir
    },
    tags: '@checkout',
    retry: 0,
    parallel: 1,
    failFast: false,
    worldParameters: {
      baseUrl: URLS.BASE
    }
  },

  // Profile for sorting tests
  sorting: {
    features: ['features/**/*.feature'],
    import: [
      'features/support/**/*.js',
      'features/step_definitions/**/*.js'
    ],
    format: [
      '@cucumber/pretty-formatter',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      resultsDir: resultsDir
    },
    tags: '@sorting',
    retry: 0,
    parallel: 1,
    failFast: false,
    worldParameters: {
      baseUrl: URLS.BASE
    }
  }
}; 