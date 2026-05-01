# Requirement: Monorepo Setup (pnpm + Turborepo)

## Context

The project is renamed **leonly**. The codebase grows to include multiple apps (web-app, backend, marketing site, mobile) and shared packages. A monorepo with a single lockfile, shared tooling, and coordinated pipelines is required.

## Goals

- Single repository for all apps and packages.
- One `pnpm-lock.yaml` at the root — no nested lockfiles.
- Shared developer tooling (Husky, Commitlint, Prettier, lint-staged) defined once at the root.
- Turborepo orchestrates build/lint/typecheck pipelines with caching.
- Adding a new app or package should require only creating its directory and `package.json`.

## Structure

```
leonly/                          ← repo root (folder renamed from just-the-two-of-us)
├── apps/
│   ├── web-app/                 ← React + Vite frontend (this codebase)
│   └── api/                     ← Node/Express backend (future)
├── packages/                    ← shared libs (future: ui, types, utils)
├── docs/
│   └── requirements/
├── pnpm-workspace.yaml
├── turbo.json
├── package.json                 ← private: true; root devDeps + scripts
├── .husky/
├── .prettierrc
├── .prettierignore
├── commitlint.config.ts
├── .gitignore
└── AGENTS.md
```

## Root `package.json`

- `"private": true`
- Scripts: `dev`, `build`, `lint`, `typecheck` all delegate to `turbo run <task>`.
- Root devDependencies: `turbo`, `husky`, `lint-staged`, `prettier`, `prettier-plugin-tailwindcss`, `@commitlint/cli`, `@commitlint/config-conventional`.
- **No `dependencies`** — runtime deps live in individual apps.

## `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

## `turbo.json` Pipeline

| Task        | Depends on                | Outputs               | Cached          |
| ----------- | ------------------------- | --------------------- | --------------- |
| `build`     | `^build` (upstream first) | `dist/**`, `.next/**` | yes             |
| `dev`       | —                         | —                     | no (persistent) |
| `lint`      | —                         | —                     | yes             |
| `typecheck` | —                         | —                     | yes             |

## Tooling Placement

| Tool               | Lives at                                          |
| ------------------ | ------------------------------------------------- |
| Husky hooks        | root `.husky/`                                    |
| Commitlint         | root `commitlint.config.ts`                       |
| Prettier           | root `.prettierrc` / `.prettierignore`            |
| lint-staged        | root `package.json` → `"lint-staged"` key         |
| ESLint             | each workspace (`apps/web-app/eslint.config.mjs`) |
| TypeScript         | each workspace (`apps/web-app/tsconfig.json`)     |
| Tailwind / PostCSS | each workspace                                    |

## Husky Pre-commit Hook

```sh
#!/usr/bin/env sh
npx lint-staged
pnpm -r typecheck
pnpm -r build
```

Uses `pnpm -r` (recursive) so every workspace is checked. Commits take ~30–60 s (expected).

## Naming Conventions

- Root package name: `leonly`
- App package names: `@leonly/<app-name>` (e.g. `@leonly/web-app`, `@leonly/api`)
- Shared package names: `@leonly/<package-name>` (e.g. `@leonly/ui`, `@leonly/types`)

## Implementation Checklist

- [x] Rename repo folder to `leonly`
- [x] Root `package.json` (private, turbo scripts, shared devDeps)
- [x] `pnpm-workspace.yaml`
- [x] `turbo.json` with pipelines
- [x] Move tooling (Husky, Prettier, Commitlint) to root
- [x] Move `src/`, `public/`, app config files → `apps/web-app/`
- [x] Update `apps/web-app/package.json` name → `@leonly/web-app`
- [x] `packages/` directory created (empty, ready for future shared libs)
- [x] `pnpm install` generates root `pnpm-lock.yaml`
- [x] Remove old `package-lock.json`
