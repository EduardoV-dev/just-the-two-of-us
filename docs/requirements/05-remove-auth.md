# Requirement: Remove Authentication

## Context

Authentication was implemented client-side via `localStorage`. The password was compared against `VITE_ACCESS_PASSWORD`, an environment variable baked into the JS bundle at build time — making the password trivially extractable from the build output. The site is a private romantic app with no sensitive user data; the auth gate is no longer needed. All routes should be publicly accessible without a login step.

## Goals

- Delete all auth logic, context, and login UI.
- Remove `ProtectedLayout` and all route protection from `App.tsx`.
- Move `HomeView` to the root path `/` (was `/home`).
- Remove `VITE_ACCESS_PASSWORD` from environment config.

## Updated Routing Map

| Path        | Component      | Notes                  |
| ----------- | -------------- | ---------------------- |
| `/`         | `HomeView`     | New root — was `/home` |
| `/gallery`  | `GalleryView`  | Path unchanged         |
| `/letters`  | `LettersView`  | Path unchanged         |
| `/timeline` | `TimelineView` | Path unchanged         |

No login route. No protected routes. No redirects based on auth state.

## Files to Delete

```
apps/web-app/src/lib/auth.ts
apps/web-app/src/lib/auth-context.tsx
apps/web-app/src/app/_components/LoginForm.tsx
apps/web-app/src/app/_components/              ← directory (if empty after removal)
```

## Files to Modify

### `apps/web-app/src/App.tsx`

Remove:

- Import of `AuthProvider` from `src/lib/auth-context`
- Import of `useAuthContext` (if used directly in `App.tsx`)
- Import of `LoginForm`
- `<AuthProvider>` wrapper around the router
- `ProtectedLayout` component definition (checks `isAuthenticated`, redirects to `/`)
- All routes nested under `ProtectedLayout`
- The `/` → `LoginForm` route

Add / update:

- Flat route list with no auth guard:
  - `<Route path="/" element={<HomeView />} />`
  - `<Route path="/gallery" element={<GalleryView />} />`
  - `<Route path="/letters" element={<LettersView />} />`
  - `<Route path="/timeline" element={<TimelineView />} />`
  - `<Route path="*" element={<Navigate to="/" replace />} />` (catch-all)

### `apps/web-app/src/components/Navigation.tsx`

Remove:

- Any logout button or logout call (`logout()` from `src/lib/auth`)
- Any import of `useAuthContext` or auth-related hooks
- Any conditional rendering based on auth state

### `apps/web-app/.env.example`

Remove line:

```
VITE_ACCESS_PASSWORD=
```

### `AGENTS.md`

Remove from the environment variables table:

| Variable          | Required     | Purpose                              |
| ----------------- | ------------ | ------------------------------------ |
| `ACCESS_PASSWORD` | yes (server) | Site password checked by `/api/auth` |

Remove from the routing/auth model section any prose describing the auth flow, `ProtectedLayout`, `localStorage`, or `VITE_ACCESS_PASSWORD`.

## Implementation Checklist

- [ ] Delete `apps/web-app/src/lib/auth.ts`
- [ ] Delete `apps/web-app/src/lib/auth-context.tsx`
- [ ] Delete `apps/web-app/src/app/_components/LoginForm.tsx`
- [ ] Delete `apps/web-app/src/app/_components/` directory if empty
- [ ] Remove `AuthProvider`, `ProtectedLayout`, `LoginForm` imports and usage from `src/App.tsx`
- [ ] Flatten routes in `src/App.tsx`: `HomeView` at `/`, remaining views at their existing paths
- [ ] Add catch-all `<Route path="*" element={<Navigate to="/" replace />} />`
- [ ] Remove logout button and auth imports from `src/components/Navigation.tsx`
- [ ] Remove `VITE_ACCESS_PASSWORD` from `.env.example`
- [ ] Remove auth references from `AGENTS.md`
- [ ] Verify `pnpm typecheck` and `pnpm build` pass
