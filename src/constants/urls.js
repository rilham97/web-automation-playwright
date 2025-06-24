/**
 * URL Constants for SauceDemo Application
 * Centralized URL management for all test files
 */

const BASE_URL = 'https://www.saucedemo.com';

const URLS = {
  // Base application URL
  BASE: BASE_URL,
  
  // Authentication URLs
  LOGIN: `${BASE_URL}/`,
  
  // Main application pages
  INVENTORY: `${BASE_URL}/inventory.html`,
  INVENTORY_ITEM: `${BASE_URL}/inventory-item.html`,
  
  // Cart and checkout URLs
  CART: `${BASE_URL}/cart.html`,
  CHECKOUT_STEP_ONE: `${BASE_URL}/checkout-step-one.html`,
  CHECKOUT_STEP_TWO: `${BASE_URL}/checkout-step-two.html`,
  CHECKOUT_COMPLETE: `${BASE_URL}/checkout-complete.html`,
  
  // Additional pages
  ABOUT: 'https://saucelabs.com/',
  
  // Relative paths (for navigation)
  PATHS: {
    ROOT: '/',
    INVENTORY: '/inventory.html',
    CART: '/cart.html',
    CHECKOUT_STEP_ONE: '/checkout-step-one.html',
    CHECKOUT_STEP_TWO: '/checkout-step-two.html',
    CHECKOUT_COMPLETE: '/checkout-complete.html'
  }
};

/**
 * URL validation patterns
 */
const URL_PATTERNS = {
  LOGIN: /^https:\/\/www\.saucedemo\.com\/$/,
  INVENTORY: /^https:\/\/www\.saucedemo\.com\/inventory\.html$/,
  CART: /^https:\/\/www\.saucedemo\.com\/cart\.html$/,
  CHECKOUT: /^https:\/\/www\.saucedemo\.com\/checkout-step-\w+\.html$/
};

/**
 * Environment configuration
 */
const ENV_CONFIG = {
  development: {
    BASE_URL: 'https://www.saucedemo.com',
    TIMEOUT: 30000,
    HEADLESS: false
  },
  staging: {
    BASE_URL: 'https://staging.saucedemo.com', // Example
    TIMEOUT: 30000,
    HEADLESS: true
  },
  production: {
    BASE_URL: 'https://www.saucedemo.com',
    TIMEOUT: 10000,
    HEADLESS: true
  }
};

/**
 * Get environment-specific configuration
 * @param {string} env - Environment name (development, staging, production)
 * @returns {object} Environment configuration
 */
function getEnvConfig(env = 'development') {
  return ENV_CONFIG[env] || ENV_CONFIG.development;
}

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {object} params - Query parameters
 * @returns {string} URL with query parameters
 */
function buildUrlWithParams(baseUrl, params = {}) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}

export {
  URLS,
  URL_PATTERNS,
  ENV_CONFIG,
  BASE_URL,
  getEnvConfig,
  buildUrlWithParams
}; 