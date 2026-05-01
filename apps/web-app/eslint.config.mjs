import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // ─── Global Ignores ──────────────────────────────────────────────────────────
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "src/lib/generated/**",
      "public/**",
      "vite.config.ts",
      "commitlint.config.ts",
    ],
  },

  // ─── Base JS rules ───────────────────────────────────────────────────────────
  js.configs.recommended,

  // ─── TypeScript ──────────────────────────────────────────────────────────────
  ...tseslint.configs.recommended,

  // ─── React + Hooks + a11y ────────────────────────────────────────────────────
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // React 17+ JSX transform — no need to import React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      "react/self-closing-comp": ["error", { component: true, html: true }],
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "react/no-array-index-key": "warn",
    },
  },

  // ─── TypeScript strict rules ─────────────────────────────────────────────────
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/no-non-null-assertion": "warn",

      // General quality
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      curly: ["error", "all"],
      "object-shorthand": ["error", "always"],
      "prefer-destructuring": ["warn", { array: false, object: true }],
    },
  },

  // ─── Import Plugin ────────────────────────────────────────────────────────────
  {
    files: ["**/*.{ts,tsx,js,mjs}"],
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: true,
      },
    },
    rules: {
      "import/no-duplicates": "error",
      "import/no-self-import": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          pathGroups: [
            {
              pattern: "react",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "react-router-dom",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react", "type"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  // ─── Prettier (must be last) ──────────────────────────────────────────────────
  prettierConfig,
);
