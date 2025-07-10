module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
    'cypress/globals': true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['cypress'],
  extends: ['eslint:recommended', 'plugin:cypress/recommended'],
};
