# Requirement: Next.js → React + Vite Migration (`apps/web-app`)

## Context

The web-app was originally built with Next.js 16 App Router. Server-side rendering is not needed — all content is static JSON, auth is client-side, and the app is a SPA. Migrating to plain React + Vite removes the server runtime, simplifies the build, and makes hosting on any static CDN trivial.

## Goals

- Replace Next.js with Vite + `@vitejs/plugin-react`.
- Replace file-system routing with React Router v7 (`react-router-dom`).
- Replace `next/font` with Google Fonts CSS loaded from `index.html`.
- Replace `next/image` with plain `<img>` tags styled with Tailwind utility classes.
- Replace `next/navigation` hooks with React Router equivalents.
- Replace server-side auth (httpOnly cookie + API route) with client-side auth (localStorage).
- Keep Tailwind v4 CSS-first config unchanged (use `@tailwindcss/vite` plugin instead of PostCSS).
- Maintain all existing UI, animations, and features with no visual regression.

## What is NOT Changing

- React 19, TypeScript strict, Framer Motion, Embla Carousel.
- Tailwind v4 design tokens in `src/app/globals.css`.
- All feature components under `src/features/`.
- All shared components under `src/components/`.
- Static content: `src/content/*.json`, `public/images/`, `public/music/`.
- ESLint rules, Prettier config (minus Next.js-specific rules).

## Directory Changes

| Before (Next.js)                 | After (Vite)                                                   |
| -------------------------------- | -------------------------------------------------------------- |
| `src/app/layout.tsx`             | Deleted → split into `index.html` + `src/main.tsx`             |
| `src/app/page.tsx`               | Deleted → `LoginForm` rendered directly by router              |
| `src/app/api/auth/route.ts`      | Deleted → replaced by `src/lib/auth.ts`                        |
| `src/app/(protected)/layout.tsx` | Kept as `ProtectedLayout` component (used in `App.tsx`)        |
| `src/app/countdown/layout.tsx`   | Kept as `CountdownLayout` component (used in `App.tsx`)        |
| `next.config.ts`                 | Deleted                                                        |
| `next-env.d.ts`                  | Deleted                                                        |
| `proxy.ts`                       | Deleted → routing guards moved to `App.tsx`                    |
| `postcss.config.mjs`             | Deleted → Tailwind loaded via `@tailwindcss/vite` Vite plugin  |
| `netlify.toml`                   | Rewritten for Vite SPA (`dist/` + `/* → /index.html` redirect) |

## New Files

| File                       | Purpose                                                               |
| -------------------------- | --------------------------------------------------------------------- |
| `index.html`               | Vite entry HTML; loads fonts from Google Fonts; mounts `#root`        |
| `vite.config.ts`           | Vite config: `@vitejs/plugin-react`, `@tailwindcss/vite`, `@/*` alias |
| `src/main.tsx`             | React entry point; renders `<App />` into `#root`                     |
| `src/App.tsx`              | `<BrowserRouter>` + `<AuthProvider>` + route definitions              |
| `src/lib/auth.ts`          | `login()`, `logout()`, `isAuthenticated()`, `isCountdownLocked()`     |
| `src/lib/auth-context.tsx` | React context + `<AuthProvider>` + `useAuthContext()` hook            |

## Routing Map

| Path         | Component       | Auth required | Notes                                        |
| ------------ | --------------- | ------------- | -------------------------------------------- |
| `/`          | `LoginForm`     | No            | Redirect to `/home` if already authed        |
| `/countdown` | `CountdownView` | No            | Redirect to `/` or `/home` if countdown done |
| `/home`      | `HomeView`      | Yes           | Protected                                    |
| `/gallery`   | `GalleryView`   | Yes           | Protected                                    |
| `/letters`   | `LettersView`   | Yes           | Protected                                    |
| `/timeline`  | `TimelineView`  | Yes           | Protected                                    |

## Countdown Lock Logic

Replaces `proxy.ts` middleware. Lives in `App.tsx` routing logic:

- Read `VITE_ENVIRONMENT` and `VITE_UNLOCK_DATE` from `import.meta.env`.
- If `VITE_ENVIRONMENT === "production"` and `new Date() < UNLOCK_DATE`:
  - Only `/countdown` is accessible.
  - All other paths redirect to `/countdown`.
- Lock state is checked on every render of `AppRoutes`.

## Authentication

### Strategy: Client-side (localStorage)

**Trade-off acknowledged:** The `VITE_ACCESS_PASSWORD` env var is embedded in the JS bundle. This is acceptable for this use case (private romantic site, no sensitive data beyond the content itself). Must be replaced with proper backend auth before any sensitive data is added.

### Flow

1. User submits password in `LoginForm`.
2. `login(password)` in `src/lib/auth.ts` compares against `import.meta.env.VITE_ACCESS_PASSWORD`.
3. On match: stores `"leonly_auth" = "true"` in `localStorage`, returns `true`.
4. `AuthProvider` re-renders with `isAuthenticated = true`.
5. Router redirects to `/home`.
6. `ProtectedRoute` (`ProtectedLayout`) checks `isAuthenticated` from context on every render.

### Token Storage

- Key: `leonly_auth`
- Value: `"true"` (string)
- Persists across sessions (no expiry) — matches old 30-day cookie behavior.

## Environment Variables

| Old (`NEXT_PUBLIC_*`)     | New (`VITE_*`)         | Purpose                               |
| ------------------------- | ---------------------- | ------------------------------------- |
| `ACCESS_PASSWORD`         | `VITE_ACCESS_PASSWORD` | Site password                         |
| `ENVIRONMENT`             | `VITE_ENVIRONMENT`     | `"production"` enables countdown lock |
| `NEXT_PUBLIC_UNLOCK_DATE` | `VITE_UNLOCK_DATE`     | ISO unlock date                       |

## Component Migration Details

### `next/navigation` → `react-router-dom`

| Next.js                             | React Router                              |
| ----------------------------------- | ----------------------------------------- |
| `useRouter()` → `router.push(path)` | `useNavigate()` → `navigate(path)`        |
| `usePathname()`                     | `useLocation()` → `location.pathname`     |
| `<Link href="...">`                 | `<Link to="...">` from `react-router-dom` |

### `next/image` → `<img>`

`Image` with `fill` prop becomes:

```tsx
<img
  src={src}
  alt={alt}
  className="absolute inset-0 h-full w-full object-cover" // or object-contain
/>
```

Parent must have `position: relative` and explicit dimensions (already the case in all usages).

### `next/font` → Google Fonts CSS

`index.html` loads:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
  rel="stylesheet"
/>
```

`globals.css` `@theme inline` updated:

```css
--font-heading: "Playfair Display", serif;
--font-body: "Inter", sans-serif;
```

### `"use client"` Directives

Removed from all files — meaningless in Vite (all components are client-side by default). No-op string literals, but cleaner without them.

### Next.js-specific ESLint Rules

`eslint-config-next` removed. Replaced with:

- `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser`
- `eslint-plugin-react` + `eslint-plugin-react-hooks`
- `eslint-plugin-jsx-a11y`
- `eslint-plugin-import`
- `eslint-config-prettier`

## Build & Deploy

| Aspect              | Before          | After                         |
| ------------------- | --------------- | ----------------------------- |
| Dev server          | `next dev`      | `vite`                        |
| Build output        | `.next/`        | `dist/`                       |
| Start               | `next start`    | `vite preview`                |
| Netlify build cmd   | `npm run build` | `pnpm build`                  |
| Netlify publish dir | `.next`         | `dist`                        |
| SPA redirect rule   | N/A (SSR)       | `/* → /index.html` (HTTP 200) |

## Implementation Checklist

- [x] `index.html` created with Google Fonts + favicon links
- [x] `vite.config.ts` with react + tailwindcss plugins + `@/*` alias
- [x] `src/main.tsx` entry point
- [x] `src/App.tsx` with all routes + countdown lock + protected route logic
- [x] `src/lib/auth.ts` client-side auth helpers
- [x] `src/lib/auth-context.tsx` React auth context
- [x] `LoginForm.tsx` updated: client-side login, `useNavigate`
- [x] `CountdownView.tsx` updated: `useNavigate`, `import.meta.env.VITE_UNLOCK_DATE`
- [x] `HomeView.tsx` updated: `Link` from `react-router-dom`
- [x] `GalleryView.tsx` updated: `<img>` replaces `next/image`
- [x] `Navigation.tsx` updated: `Link` + `useLocation` from `react-router-dom`
- [x] `PageTransitionWrapper.tsx` updated: `useLocation` from `react-router-dom`
- [x] `ImageLightbox.tsx` updated: `<img>` replaces `next/image`
- [x] `MemoryCard.tsx` updated: `<img>` replaces `next/image`
- [x] `MemoryDetailModal.tsx` updated: `<img>` replaces `next/image`
- [x] `globals.css` fonts updated (no `--font-playfair` / `--font-inter` CSS vars)
- [x] `.env.example` env var names updated
- [x] `tsconfig.json` updated (no next plugin, `vite/client` types)
- [x] `eslint.config.mjs` updated (no next configs)
- [x] `netlify.toml` updated for Vite SPA
- [x] `"use client"` removed from all components
- [x] `postcss.config.mjs` removed
- [x] Next.js-specific files deleted
