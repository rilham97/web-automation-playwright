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
 * Streamlined Cucumber.js Configuration
 * 
 * Why only 3 profiles instead of 8?
 * - Tags handle feature selection (--tags '@login', '@cart', etc.)
 * - Profiles should only differ in execution environment, not content
 * - This eliminates 150+ lines of duplicated configuration
 * 
 * Usage Examples:
 * npx cucumber-js                              # default profile, visible browser
 * npx cucumber-js --profile headless           # headless execution (CI/CD)
 * npx cucumber-js --profile fast               # parallel execution
 * npx cucumber-js --tags '@login'              # login tests only
 * npx cucumber-js --profile headless --tags '@smoke'  # headless smoke tests
 */

// Base configuration shared by all profiles
const baseConfig = {
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
  failFast: false,
  timeout: 60000, // 60 seconds per step
  worldParameters: {
    baseUrl: URLS.BASE
  }
};

export default {
  // Default profile - local development with visible browser
  default: {
    ...baseConfig,
    parallel: 1,
    worldParameters: {
      ...baseConfig.worldParameters,
      headless: false
    }
  },

  // Headless profile - CI/CD and background execution
  headless: {
    ...baseConfig,
    parallel: 1,
    worldParameters: {
      ...baseConfig.worldParameters,
      headless: true
    }
  },

  // Fast profile - parallel execution for speed
  fast: {
    ...baseConfig,
    parallel: 2,
    worldParameters: {
      ...baseConfig.worldParameters,
      headless: true
    }
  }
}; 