module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.js(x)'],
  setupFilesAfterEnv: ['./src/setupTests.js'],
};
