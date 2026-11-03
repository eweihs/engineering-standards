import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import { rules } from "./base.js";

export default [
  { ignores: [".next/**", ".open-next/**", "out/**", "next-env.d.ts", "infra/**"] },
  ...nextVitals,
  ...nextTypescript,
  rules,
  {
    files: ["**/components/**/*.tsx"],
    ignores: ["**/components/ui/**"],
    rules: {
      "import/prefer-default-export": "error",
    },
  },
  prettier,
];
