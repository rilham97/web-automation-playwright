import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        
        // Web APIs available in Node.js
        URL: 'readonly',
        URLSearchParams: 'readonly',
        
        // Cucumber globals
        Given: 'readonly',
        When: 'readonly',
        Then: 'readonly',
        Before: 'readonly',
        After: 'readonly',
        BeforeAll: 'readonly',
        AfterAll: 'readonly',
        
        // Playwright globals
        test: 'readonly',
        expect: 'readonly',
        page: 'readonly',
        browser: 'readonly',
        context: 'readonly'
      }
    },
    rules: {
      // Basic rules
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-undef': 'error',
      
      // ES Module specific rules
      'no-duplicate-imports': 'error',
      
      // Code quality rules
      'prefer-const': 'warn',
      'no-var': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      
      // Best practices
      'eqeqeq': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      
      // Style rules
      'indent': ['error', 2],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never']
    },
    ignores: [
      'node_modules/',
      'allure-results/',
      'allure-report/',
      'reports/',
      'screenshots/',
      'test-results/',
      '*.min.js'
    ]
  }
]; 