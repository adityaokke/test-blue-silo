import type { Config } from "jest";
const testRoot = "<rootDir>/__tests__";
const testSetups = `${testRoot}/setup`;

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: [testRoot],
  testMatch: ["**/*.test.{ts,tsx}"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          module: "commonjs",
          target: "ES2022",
          moduleResolution: "node",
          esModuleInterop: true,
          strict: true,
        },
        diagnostics: false,
      },
    ],
  },
  setupFiles: [`${testSetups}/setupPolyfills.ts`, `${testSetups}/setup.ts`],
  setupFilesAfterEnv: [`${testSetups}/setupTests.ts`],
};

export default config;
