import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export const rules = {
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-restricted-imports": [
      "error",
      {
        patterns: [{ group: ["../../*"], message: "Use the project's path alias instead." }],
      },
    ],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};

export default [
  { ignores: ["dist/**", "coverage/**", "cdk.out/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  rules,
  prettier,
];
