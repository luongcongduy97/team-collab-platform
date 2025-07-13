const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    supportFile: 'cypress/support/e2e.js',
    baseUrl: 'http://localhost:3001/',
    env: {
      apiUrl: 'http://localhost:5555/api',
    },
  },
});
