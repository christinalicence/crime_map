
// jest.config.js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(your-esm-dependency)/)', // if needed to transform specific modules
  ],
};

