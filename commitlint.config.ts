import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Type rules
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation changes
        "style", // Code style (formatting, missing semi-colons, etc — no logic change)
        "refactor", // Code refactoring (no feature/fix)
        "perf", // Performance improvements
        "test", // Adding or updating tests
        "build", // Build system or external dependencies
        "ci", // CI/CD configuration changes
        "chore", // Maintenance tasks (bumping versions, etc)
        "revert", // Reverting a previous commit
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],

    // Scope rules
    "scope-case": [2, "always", "lower-case"],

    // Subject rules
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "subject-max-length": [2, "always", 100],

    // Body rules
    "body-leading-blank": [1, "always"],
    "body-max-line-length": [2, "always", 120],

    // Footer rules
    "footer-leading-blank": [1, "always"],
    "footer-max-line-length": [2, "always", 120],

    // Header rules
    "header-max-length": [2, "always", 100],
  },
  helpUrl: "https://www.conventionalcommits.org/en/v1.0.0/",
};

export default config;
