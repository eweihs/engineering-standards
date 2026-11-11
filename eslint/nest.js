import globals from "globals";
import tseslint from "typescript-eslint";
import base from "./base.js";
import { jestTests } from "./tests.js";

export default [
  ...base,
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      parserOptions: { projectService: true },
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
    },
  },
  jestTests,
];
