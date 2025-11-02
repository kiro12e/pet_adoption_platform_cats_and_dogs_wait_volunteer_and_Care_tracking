module.exports = {
  // The root of your source code
  roots: ['<rootDir>/backend'],
  
  // Test match pattern
  testMatch: [
    "**/__tests__/**/*.js",
    "**/test/**/*.test.js"
  ],

  // Test environment
  testEnvironment: 'node',

  // Coverage configuration
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/test/**',
    '!backend/config/**'
  ],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Verbose output
  verbose: true
};