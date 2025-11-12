module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupEnv.js'],
  verbose: false,
  coverageDirectory: 'coverage',
};
