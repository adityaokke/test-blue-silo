import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/__tests__"],
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
  setupFiles: ["<rootDir>/src/setupPolyfills.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};

export default config;
