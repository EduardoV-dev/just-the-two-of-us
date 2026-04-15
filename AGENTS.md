# AGENTS.md — just-the-two-of-us

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 · Framer Motion · Netlify

## Commands

```bash
npm run dev          # dev server
npm run build        # production build
npm run typecheck    # tsc --noEmit
npm run lint         # eslint src/
npm run lint:fix     # eslint src/ --fix
npm run format       # prettier --write .
```

Verification order before committing: `lint` → `typecheck` → `build`

**Pre-commit hook is heavy.** It runs lint-staged + typecheck + a full production build on every commit. Commits take ~30–60 s. Do not skip hooks.

No test suite exists.

## Architecture

Feature-based layout — load `.agents/skills/nextjs-feature-architecture/SKILL.md` before creating or moving files.

```
src/app/[route]/page.tsx           ← thin: import + render only, no logic
src/app/[route]/_components/       ← route-owned view components
src/features/[feature]/            ← reusable domain pieces + barrel index.ts
src/components/                    ← app shell only (Nav, Footer, Music*)
src/lib/                           ← types, animations, content loaders
src/content/                       ← static JSON data
```

Import rules (enforced by ESLint):

- `_components/` imports features via barrel: `import { X } from "@/features/gallery"` — never from internal paths
- `page.tsx` imports its `_components/` with a relative path
- Never `import { X } from "@/features/gallery/components/X"` — barrel only

## Tailwind v4

No `tailwind.config.js`. CSS-first config only. Design tokens live in `src/app/globals.css` under `:root` and `@theme inline`. Use these utility classes:

`bg-background` `bg-surface` `bg-accent` `text-text-primary` `text-text-secondary` `text-text-muted` `border-border` `font-heading` (Playfair Display) `font-body` (Inter)

Adding a new color: add a CSS var in `:root` and map it in `@theme inline`.

## TypeScript conventions

- `interface` over `type` for object shapes — ESLint error if violated
- Type-only imports must use `import type { ... }` — ESLint error if violated
- Unused vars are errors; prefix with `_` to suppress
- `src/lib/generated/` — auto-generated, never edit by hand

## Import order

ESLint enforces groups with blank lines between each:

```ts
// 1. react
// 2. next/**
// 3. third-party (alphabetical)
// 4. @/* internal (alphabetical)
// 5. relative
// 6. type imports
```

`import/order` is an error, not a warning. Run `lint:fix` to auto-correct.

## Commit messages

Commitlint enforces Conventional Commits on every commit:

```
<type>: <subject>          # header ≤ 100 chars
```

Valid types: `feat fix docs style refactor perf test build ci chore revert`

Subject: lowercase start, no trailing period, no sentence-case/PascalCase/UPPER.

## Environment variables

| Variable                  | Required     | Purpose                                          |
| ------------------------- | ------------ | ------------------------------------------------ |
| `ACCESS_PASSWORD`         | yes (server) | Site password checked by `/api/auth`             |
| `ENVIRONMENT`             | no           | Set to `production` to enable countdown lock     |
| `NEXT_PUBLIC_UNLOCK_DATE` | no           | ISO date; defaults to `2026-04-26T02:00:00.000Z` |

Copy `.env.example` → `.env.local` for local dev. `ACCESS_PASSWORD` must be set or `/api/auth` returns 500.

## Routing / auth model

- Auth: single password → `authenticated=true` cookie (httpOnly, 30 days) set by `POST /api/auth`
- `proxy.ts` contains routing guard logic (auth check + countdown lock) but **`middleware.ts` does not exist** — the guards are currently not enforced at the edge. If adding route protection, create `middleware.ts` that imports and re-exports from `proxy.ts` as `export { proxy as middleware, config }`.
- Countdown lock only activates when `ENVIRONMENT=production` AND current time is before `UNLOCK_DATE`

## Static content

All data is static JSON — no database, no API fetching. Content loaders in `src/lib/content.ts`:

- Memories → `src/content/memories/memories.json` (sorted ascending by `date`)
- Letters → `src/content/letters/letters.json`
- Gallery → `src/content/gallery.json`
- Images → `public/images/memories/` and `public/images/gallery/`

`formatDate()` in `lib/content.ts` formats dates in `es-ES` locale.

## Deploy

Netlify via `@netlify/plugin-nextjs`. Build: `npm run build`, publish: `.next`. No custom build scripts.
