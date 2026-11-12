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
    "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
    "preserve-caught-error": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};

export const exemptFromMaxLines = {
  files: ["**/*.test.*", "**/*.spec.*", "tests/**", "**/components/ui/**"],
  rules: { "max-lines": "off" },
};

export default [
  // Claude Code worktrees are other checkouts of the same repo, with their own build output;
  // the root-anchored ignores in the presets don't reach into them
  { ignores: ["dist/**", "coverage/**", "cdk.out/**", ".claude/worktrees/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  rules,
  exemptFromMaxLines,
  prettier,
];
