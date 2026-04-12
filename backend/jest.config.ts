export default {
    extensionsToTreatAsEsm: [".ts"],
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/tests/**/*.test.ts"],
    setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
    transform: {
      "^.+\\.tsx?$": ["ts-jest", {
        useESM: true,
        tsconfig: "tsconfig.json"
      }]
    }
  }