# Requirement: Monorepo Tooling Consolidation

## Context

Current tooling setup has four issues:

- `prettier-plugin-tailwindcss` still lives in root `package.json`, but Tailwind sorting concerns only `apps/web-app/`.
- Shared lint/format config is split and harder to consume for future apps.
- Root lint-staged config lives in `package.json` and is too broad for current rollout.
- Push-time verification does not enforce a `web-app` production build.

## Goals

- Combine ESLint and Prettier shared configs into one package: `@leonly/tooling`.
- Keep app-specific Tailwind Prettier plugin only in `apps/web-app`.
- Move root lint-staged config to `.lintstagedrc` and scope rules to `apps/web-app` for now.
- Add a Husky `pre-push` hook that builds `apps/web-app` before push.

## New Packages Structure

```
packages/
└── tooling/
    ├── package.json                 ← name: @leonly/tooling
    ├── eslint.mjs                   ← shared ESLint flat config
    └── prettier.mjs                 ← shared Prettier config
```

`packages/tooling/package.json` should export both entry points:

```json
{
  "name": "@leonly/tooling",
  "type": "module",
  "exports": {
    "./eslint": "./eslint.mjs",
    "./prettier": "./prettier.mjs"
  }
}
```

## Shared ESLint Rules (`@leonly/tooling/eslint`)

Base config includes:

- `@eslint/js` recommended
- `typescript-eslint` recommended
- `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`
- `eslint-plugin-import`
- `eslint-config-prettier` last

Required rule additions/changes:

- `max-lines`: `['error', { max: 500, skipBlankLines: true, skipComments: true }]`
- `no-console`: `['error', { allow: ['warn', 'error'] }]`
- JS unused vars rule:
  - `no-unused-vars`: `['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }]`
- TS unused vars rule:
  - `@typescript-eslint/no-unused-vars`: `['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }]`

Other existing project rules remain shared (type imports, interface-only type definitions, import order, React formatting rules).

App-specific `ignores` stay in each app `eslint.config.mjs`.

## Shared Prettier Rules (`@leonly/tooling/prettier`)

`prettier.mjs` exports base formatting options only (semi, quotes, width, commas, etc.).

Do not include:

- `plugins`
- `tailwindStylesheet`

These remain app-local.

## Root Changes

### `package.json`

- Remove `prettier-plugin-tailwindcss` from root `devDependencies`.
- Add `@leonly/tooling` as root devDependency.
- Remove `lint-staged` key from `package.json` (moved to file-based config).

### `.prettierrc`

Reference shared prettier config:

```json
"@leonly/tooling/prettier"
```

### `.lintstagedrc` (new)

Create root `.lintstagedrc` and scope to `apps/web-app` only for now.

Required checks:

- formatting
- linting
- TypeScript check

Example baseline:

```json
{
  "apps/web-app/src/**/*.{ts,tsx}": [
    "pnpm --filter @leonly/web-app exec eslint --fix",
    "pnpm --filter @leonly/web-app exec prettier --write",
    "pnpm --filter @leonly/web-app typecheck"
  ],
  "apps/web-app/**/*.{json,css,md}": ["pnpm --filter @leonly/web-app exec prettier --write"]
}
```

## `apps/web-app` Changes

### `apps/web-app/package.json`

- Add `prettier-plugin-tailwindcss` in `devDependencies`.
- Add `@leonly/tooling` in `devDependencies`.

### `apps/web-app/.prettierrc` (new)

Extend shared config and add Tailwind plugin locally:

```json
{
  "extends": "@leonly/tooling/prettier",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/app/globals.css"
}
```

### `apps/web-app/eslint.config.mjs`

Extend shared ESLint config locally:

```js
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
```

## Husky Changes

### `.husky/pre-push` (new)

Add a pre-push hook to verify the app builds:

```sh
#!/usr/bin/env sh
pnpm --filter @leonly/web-app build
```

Push must fail if this command fails.

## Implementation Checklist

- [ ] Create `packages/tooling/package.json` with `./eslint` and `./prettier` exports
- [ ] Create `packages/tooling/eslint.mjs` shared flat config
- [ ] Add `max-lines` error rule (`500`) in shared ESLint config
- [ ] Set `no-console` to error and allow only `warn` and `error`
- [ ] Configure both JS `no-unused-vars` and TS `@typescript-eslint/no-unused-vars` with `_` ignore pattern
- [ ] Create `packages/tooling/prettier.mjs` shared prettier config
- [ ] Remove `prettier-plugin-tailwindcss` from root `package.json`
- [ ] Add `@leonly/tooling` dependency where needed
- [ ] Update root `.prettierrc` to `"@leonly/tooling/prettier"`
- [ ] Create root `.lintstagedrc` with `apps/web-app`-scoped format/lint/typecheck rules
- [ ] Remove `lint-staged` key from root `package.json`
- [ ] Create `apps/web-app/.prettierrc` extending shared config plus Tailwind plugin
- [ ] Refactor `apps/web-app/eslint.config.mjs` to extend `@leonly/tooling/eslint`
- [ ] Add `.husky/pre-push` with `pnpm --filter @leonly/web-app build`
- [ ] Run `pnpm install` to update workspace lockfile
- [ ] Verify `pnpm lint`, `pnpm typecheck`, and `pnpm --filter @leonly/web-app build` pass
