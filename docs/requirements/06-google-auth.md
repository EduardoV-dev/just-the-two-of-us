# Requirement: Google OAuth Sign-In

## Context

The app currently has no authentication. A Google-based sign-in is needed so that each user has an identity tied to their Google account. This identity is later used to link two users into a couple (see `07-couple-setup.md`). The backend integration is deferred; this requirement covers the frontend UI and flow only.

## Goals

- Present a sign-in screen when the user is not authenticated.
- Support Google OAuth as the only sign-in method.
- Store the authenticated session client-side after a successful sign-in (implementation detail deferred to backend integration).
- Redirect to the couple setup flow if the user has no linked couple after signing in (see `07-couple-setup.md`).
- Redirect to the home page if the user already belongs to a couple.

## UI Spec

### Sign-In Page (`/sign-in`)

- Full-page centered layout, consistent with the app's visual style.
- App logo / name at the top.
- A single **"Sign in with Google"** button using the official Google branding guidelines (white button, Google `G` logo, text "Sign in with Google").
- A short tagline below the button explaining this is a private app for couples.
- No email/password form — Google is the only method.

### Auth Guard

- All routes except `/sign-in` require an authenticated session.
- Unauthenticated users are redirected to `/sign-in`.
- After a successful sign-in, the user is redirected to the page they originally requested, or to `/` if no prior destination.

### Loading / Error States

- While the OAuth redirect is in-flight, show a centered spinner with "Signing you in…" text.
- On error (e.g. Google returned an error, network failure), show an inline error message with a "Try again" button.

## Data Shape (Frontend)

```ts
interface AuthUser {
  id: string;           // [PLACEHOLDER — set by backend after OAuth callback]
  googleId: string;     // [PLACEHOLDER — from Google OAuth profile]
  displayName: string;
  email: string;
  avatarUrl: string;
  coupleId: string | null; // null until couple is set up
}
```

The auth session is stored in a context (`AuthContext`) wrapping the entire app. Actual persistence (cookie / JWT) is a backend concern.

## Routing

| Path       | Component      | Notes                                         |
| ---------- | -------------- | --------------------------------------------- |
| `/sign-in` | `SignInView`   | Public — redirect to `/` if already signed in |
| `/*`       | (guarded)      | Redirect to `/sign-in` if not authenticated   |

## Backend Placeholder

> **[PLACEHOLDER]** The following are required from the backend but not implemented yet:
>
> - `GET /api/auth/google` — initiates the OAuth redirect.
> - `GET /api/auth/google/callback` — handles the OAuth callback, creates or fetches the user record, and returns a session token.
> - `POST /api/auth/sign-out` — invalidates the session.
> - `GET /api/auth/me` — returns the currently authenticated `AuthUser` or `401`.

## Implementation Checklist

- [ ] Create `SignInView` page at `apps/web-app/src/app/sign-in/page.tsx`
- [ ] Add "Sign in with Google" button component with correct Google branding
- [ ] Add loading state (spinner + message) during OAuth redirect
- [ ] Add inline error state with "Try again" button
- [ ] Create `AuthContext` providing `user`, `isLoading`, `signOut`
- [ ] Implement auth guard: redirect unauthenticated users to `/sign-in`
- [ ] Redirect authenticated users away from `/sign-in` to `/`
- [ ] After sign-in, redirect to `coupleId === null` → `/couple/setup`, else `/`
- [ ] Wire `GET /api/auth/me` call on app mount to hydrate `AuthContext` — **backend must be ready first**
- [ ] Wire `GET /api/auth/google` to the button click — **backend must be ready first**
- [ ] Wire `POST /api/auth/sign-out` to the sign-out action — **backend must be ready first**
