/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  setupFiles: [
    "<rootDir>/tests/dotenv.config.ts"
  ],
  testEnvironment: 'node'
};
