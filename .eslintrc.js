module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  parserOptions: {
    ecmaVersion: 2022,
  },
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: '18',
    },
  },
  rules: {
    'react/prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    'max-len': 0,
    'object-curly-newline': 0,
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
};
