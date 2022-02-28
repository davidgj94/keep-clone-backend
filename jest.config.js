const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  //setupFiles: [],
  setupFilesAfterEnv: ["<rootDir>/tests/config/beforeAll.ts"],
  testEnvironment: "<rootDir>/tests/config/mongo-environment.ts",
  //moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  preset: "ts-jest",
  // this enables us to use tsconfig-paths with jest
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};
