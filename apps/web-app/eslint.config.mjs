import base from "@leonly/tooling/eslint";

export default [
  ...base,
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
];
