import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import { exemptFromMaxLines, rules } from "./base.js";
import { playwrightTests, vitestTests } from "./tests.js";

export default [
  { ignores: [".next/**", ".open-next/**", "out/**", "next-env.d.ts", "infra/**"] },
  ...nextVitals,
  ...nextTypescript,
  rules,
  exemptFromMaxLines,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: { projectService: true },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
  {
    files: ["**/components/**/*.tsx"],
    ignores: ["**/components/ui/**"],
    rules: {
      "import/prefer-default-export": "error",
    },
  },
  vitestTests,
  playwrightTests,
  prettier,
];
