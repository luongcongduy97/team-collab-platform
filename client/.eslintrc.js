module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es2021: true,
    jest: true, // ✅ Thêm dòng này để ESLint biết bạn dùng jest
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // ✅ Tắt rule yêu cầu import React trong JSX
    'react/react-in-jsx-scope': 'off',
  },
};
