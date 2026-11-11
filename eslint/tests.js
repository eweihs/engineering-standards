import vitest from "@vitest/eslint-plugin";
import jest from "eslint-plugin-jest";
import playwright from "eslint-plugin-playwright";

// The same checks under each runner's plugin: a test must assert something,
// say what it tests, and actually run. A helper that asserts counts as an
// assertion when its name starts with `expect`, such as `expectInvoice`.
const quality = (plugin, assertFunctionNames = ["expect", "expect*"]) => ({
  [`${plugin}/expect-expect`]: ["error", { assertFunctionNames }],
  [`${plugin}/no-commented-out-tests`]: "error",
  [`${plugin}/no-conditional-expect`]: "error",
  [`${plugin}/no-disabled-tests`]: "error",
  [`${plugin}/no-focused-tests`]: "error",
  [`${plugin}/no-identical-title`]: "error",
  [`${plugin}/valid-expect`]: "error",
  [`${plugin}/valid-title`]: "error",
});

// Unit tests in a frontend: Vitest, next to the code.
export const vitestTests = {
  files: ["**/*.test.{ts,tsx}"],
  ignores: ["tests/**"],
  plugins: { vitest },
  rules: quality("vitest"),
};

// Unit and integration tests in a backend: Jest, with supertest for HTTP.
export const jestTests = {
  files: ["**/*.{test,spec}.ts", "test/**/*.ts", "tests/**/*.ts"],
  plugins: { jest },
  rules: quality("jest", ["expect", "expect*", "request.**.expect"]),
};

// Integration, e2e and visual tests in a frontend: Playwright, under tests/.
export const playwrightTests = {
  files: ["tests/**/*.{ts,tsx}"],
  plugins: { playwright },
  rules: {
    "playwright/expect-expect": ["error", { assertFunctionPatterns: ["^expect[A-Z]"] }],
    "playwright/missing-playwright-await": "error",
    "playwright/no-commented-out-tests": "error",
    "playwright/no-conditional-expect": "error",
    "playwright/no-focused-test": "error",
    "playwright/no-identical-title": "error",
    "playwright/no-page-pause": "error",
    // `test.skip(condition)` inside a test stays allowed, such as a mobile-only check.
    "playwright/no-skipped-test": ["error", { allowConditional: true }],
    "playwright/no-wait-for-timeout": "error",
    "playwright/valid-expect": "error",
    "playwright/valid-title": "error",
  },
};
