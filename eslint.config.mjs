import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

eslintConfig.push({
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    indent: ["warning", 2],
    "no-trailing-spaces": "error",
    "eol-last": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "space-before-function-paren": ["error", "never"],
    "keyword-spacing": ["error", { before: true, after: true }],
    "space-infix-ops": "error",
    "no-multiple-empty-lines": ["error", { max: 1 }],
  },
});

export default eslintConfig;
