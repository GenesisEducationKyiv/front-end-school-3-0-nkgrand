/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest",{}],
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testMatch: [
    "**/src/__tests__/**/*.test.ts",
    "**/src/__tests__/**/*.test.tsx"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/tests/"
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};