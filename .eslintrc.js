module.exports = {
  extends: [
    'standard',
    'standard-react'
  ],
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 2022
  },
  settings: {
    react: {
      version: '16'
    }
  },
  rules: {
    'space-before-function-paren': 0,
    'react/prop-types': 0,
    'react/jsx-handler-names': 0,
    'react/jsx-fragments': 0,
    'react/no-unused-prop-types': 0,
    'import/export': 0
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true
      }
    }
  ]
}
