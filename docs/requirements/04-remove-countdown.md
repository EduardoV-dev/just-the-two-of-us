# Requirement: Remove Countdown Feature

## Context

The countdown was a pre-launch lock that redirected all traffic to a timer page until `VITE_UNLOCK_DATE`. When `VITE_ENVIRONMENT=production` and the current time was before the unlock date, the entire app was inaccessible — every route redirected to `/countdown`. The launch date (`2026-04-26T02:00:00.000Z`) has passed. The feature is now dead code and should be removed entirely.

## Goals

- Delete all countdown source files and directories.
- Remove countdown routing logic from `App.tsx`.
- Remove countdown-related helpers from `src/lib/auth.ts`.
- Remove countdown-related environment variables from `.env.example` and `AGENTS.md`.

## Files to Delete

```
apps/web-app/src/app/countdown/_components/CountdownView.tsx
apps/web-app/src/app/countdown/page.tsx
apps/web-app/src/app/countdown/                   ← directory
apps/web-app/src/features/countdown/index.ts
apps/web-app/src/features/countdown/              ← directory
```

## Files to Modify

### `apps/web-app/src/lib/auth.ts`

Remove:

- `UNLOCK_DATE` constant (`new Date(import.meta.env.VITE_UNLOCK_DATE || ...)`)
- `isCountdownLocked()` function
- Any imports only used by the above (none expected)

### `apps/web-app/src/App.tsx`

Remove:

- Import of `isCountdownLocked` from `src/lib/auth`
- Import of `CountdownView` and `CountdownLayout` components
- The `const locked = isCountdownLocked()` call
- The `if (locked) { return <Routes>...</Routes> }` branch that renders only the `/countdown` route
- The `/countdown` route from the unlocked routes tree (the `<Route path="/countdown" ... />` entry)

### `apps/web-app/.env.example`

Remove lines:

```
VITE_ENVIRONMENT=
VITE_UNLOCK_DATE=
```

### `AGENTS.md`

Remove from the environment variables table:

| Variable                  | Required | Purpose                                          |
| ------------------------- | -------- | ------------------------------------------------ |
| `ENVIRONMENT`             | no       | Set to `production` to enable countdown lock     |
| `NEXT_PUBLIC_UNLOCK_DATE` | no       | ISO date; defaults to `2026-04-26T02:00:00.000Z` |

Remove any prose referencing countdown lock logic from the routing/auth model section.

## Implementation Checklist

- [ ] Delete `apps/web-app/src/app/countdown/_components/CountdownView.tsx`
- [ ] Delete `apps/web-app/src/app/countdown/page.tsx`
- [ ] Delete `apps/web-app/src/app/countdown/` directory
- [ ] Delete `apps/web-app/src/features/countdown/index.ts`
- [ ] Delete `apps/web-app/src/features/countdown/` directory
- [ ] Remove `UNLOCK_DATE` and `isCountdownLocked()` from `src/lib/auth.ts`
- [ ] Remove countdown imports, `locked` variable, locked branch, and `/countdown` route from `src/App.tsx`
- [ ] Remove `VITE_ENVIRONMENT` and `VITE_UNLOCK_DATE` from `.env.example`
- [ ] Remove countdown env vars and lock logic references from `AGENTS.md`
- [ ] Verify `pnpm typecheck` and `pnpm build` pass
