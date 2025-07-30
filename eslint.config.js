module.exports = [
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: [
      'node_modules/**',
      'client/node_modules/**',
      'client/build/**',
      'generated/prisma/**',
    ],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
  {
    files: ['client/**/*.js', 'client/**/*.jsx'],
    languageOptions: {
      parser: require('@babel/eslint-parser'),
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
    },
  },
];
