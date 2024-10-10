module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/?(*.)+(test).ts"],
  moduleFileExtensions: ["js", "ts", "json"],
  restoreMocks: true,
  resetMocks: true,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
};
