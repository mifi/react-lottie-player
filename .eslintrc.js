module.exports = {
  extends: ['mifi'],
  env: {
    browser: true,
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
