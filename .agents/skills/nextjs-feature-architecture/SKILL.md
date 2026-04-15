---
name: nextjs-feature-architecture
description: >
  Feature-based architecture guide for this Next.js project. Defines where every
  file belongs — features/ for reusable domain logic, app/ routes own their view
  via _components/, components/ for global shared UI only.
  Load this skill before creating, moving, or refactoring any file.
  Reference: bulletproof-react (alan2207/bulletproof-react).
  Triggers: "add component", "create hook", "add feature", "where does this go",
  "new page", "add util", "add type", "where should I put", "create file",
  "new feature", "new route".
user-invocable: false
---

# Feature-Based Architecture — `just-the-two-of-us`

Apply these rules on every file creation, move, or refactor. No exceptions.

---

## Mental Model

```
src/app/[route]/_components/  ← WHERE the route's view and route-specific UI live
src/features/                 ← WHERE reusable domain components, hooks, types, api live
src/components/               ← WHERE global shared primitives and app shell live
src/lib/                      ← WHERE framework-agnostic utils, types, animations live
```

`app/[route]/page.tsx` is thin routing glue — it imports one component from its own `_components/` and renders it. The route **owns** its view via `_components/`. Reusable domain logic lives in `features/` and is consumed by `_components/`.

---

## Folder Reference

```
src/
├── app/                              ← Next.js App Router
│   ├── layout.tsx                    ← Root layout: providers, fonts, globals.css
│   ├── page.tsx                      ← Login page — imports from ./_components/
│   ├── _components/
│   │   └── LoginForm.tsx             ← Login UI, imports from @/features/auth if needed
│   ├── globals.css                   ← Tailwind v4 entry, design tokens
│   ├── favicon.ico
│   │
│   ├── (protected)/                  ← Route group: auth-gated routes
│   │   ├── layout.tsx                ← Auth check + shared shell (Nav, Footer, Music)
│   │   ├── home/
│   │   │   ├── page.tsx              ← renders <HomeView /> from ./_components/
│   │   │   └── _components/
│   │   │       └── HomeView.tsx
│   │   ├── gallery/
│   │   │   ├── page.tsx              ← renders <GalleryView /> from ./_components/
│   │   │   └── _components/
│   │   │       ├── GalleryView.tsx   ← imports reusable pieces from @/features/gallery
│   │   │       └── GalleryFilter.tsx ← route-specific UI not reused elsewhere
│   │   ├── timeline/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       └── TimelineView.tsx
│   │   └── letters/
│   │       ├── page.tsx
│   │       └── _components/
│   │           └── LettersView.tsx   ← imports from @/features/letters
│   │
│   ├── countdown/
│   │   ├── page.tsx
│   │   └── _components/
│   │       └── CountdownView.tsx
│   │
│   └── api/
│       └── auth/
│           └── route.ts
│
├── features/                         ← Reusable domain components, hooks, types, api
│   ├── auth/                         ← Auth domain (if reusable auth logic is needed)
│   │   └── components/
│   │       └── LoginForm.tsx         ← only if auth UI is reused across routes
│   │
│   ├── gallery/
│   │   ├── components/
│   │   │   ├── GalleryCard.tsx       ← (currently: MemoryCard.tsx)
│   │   │   ├── GalleryModal.tsx      ← (currently: MemoryDetailModal.tsx)
│   │   │   └── ImageLightbox.tsx
│   │   ├── hooks/                    ← hooks reused across routes (e.g. useGallery)
│   │   ├── types/                    ← types scoped to gallery domain
│   │   └── index.ts                  ← barrel: exports reusable public API
│   │
│   ├── timeline/
│   │   ├── components/
│   │   │   └── TimelineEntry.tsx
│   │   └── index.ts
│   │
│   ├── letters/
│   │   ├── components/
│   │   │   ├── LetterCard.tsx        ← (currently: src/components/LetterCard.tsx)
│   │   │   └── LetterModal.tsx       ← (currently: src/components/LetterModal.tsx)
│   │   └── index.ts
│   │
│   ├── home/
│   │   └── index.ts                  ← may stay empty if home has no reusable domain pieces
│   │
│   └── countdown/
│       └── index.ts
│
├── components/                       ← Global shared UI: app shell + cross-feature primitives
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── MusicPlayer.tsx
│   ├── MusicProvider.tsx
│   ├── PageTransitionWrapper.tsx
│   └── FloatingPetals.tsx
│
├── lib/                              ← Pure, framework-agnostic utilities
│   ├── types.ts                      ← Shared TypeScript interfaces (Memory, GalleryImage…)
│   ├── animations.ts                 ← Framer Motion variants shared across features
│   ├── content.ts                    ← Static content loaders
│   └── generated/                    ← Auto-generated — do not edit by hand
│
└── content/                          ← Static content data (JSON, MDX, image manifests)
```

---

## Core Rules

### Rule 1 — `page.tsx` imports from its own `_components/`

`page.tsx` contains no logic, no state, no JSX beyond one import and one render:

```tsx
// src/app/(protected)/gallery/page.tsx
import { GalleryView } from "./_components/GalleryView";

export default function GalleryPage() {
  return <GalleryView />;
}
```

The `_components/` folder is private to its route — the `_` prefix hides it from Next.js routing. Files in `_components/` may import from `@/features/[feature]` to consume reusable domain pieces.

```tsx
// src/app/(protected)/gallery/_components/GalleryView.tsx
import { GalleryCard, GalleryModal } from "@/features/gallery";
import { ImageLightbox } from "@/features/gallery";
```

### Rule 2 — `features/` holds reusable domain logic only

A feature folder exists when its domain components, hooks, or types are consumed by more than one `_components/` location, or when isolating domain logic improves maintainability. A feature is **not** required to have a top-level view component — that lives in `app/[route]/_components/`.

Sub-folders inside a feature:

| Folder        | What goes here                                            |
| ------------- | --------------------------------------------------------- |
| `components/` | Reusable domain UI (cards, modals, items, pickers)        |
| `hooks/`      | Custom hooks scoped to this domain                        |
| `types/`      | TypeScript interfaces scoped to this domain               |
| `utils/`      | Pure functions scoped to this domain                      |
| `api/`        | Server Actions or data-fetching functions for this domain |

Only create sub-folders that are needed. If a feature has no reusable components yet, it may have only `index.ts`.

### Rule 3 — Barrel exports define the public API of a feature

Every feature with exported content exposes an `index.ts` barrel. Files outside the feature (including `_components/`) import **only** from the barrel, never from internal paths.

```ts
// src/features/gallery/index.ts
export { GalleryCard } from "./components/GalleryCard";
export { GalleryModal } from "./components/GalleryModal";
export { ImageLightbox } from "./components/ImageLightbox";
// Internal helpers are NOT exported
```

```ts
// CORRECT — imports from feature barrel
import { GalleryCard } from "@/features/gallery";

// WRONG — reaches into feature internals
import { GalleryCard } from "@/features/gallery/components/GalleryCard";
```

Cross-feature imports follow the same rule: feature A may import from feature B's barrel, never from B's internals.

### Rule 4 — `_components/` is private to its route

Files inside `app/[route]/_components/` are only used by that route's `page.tsx`, `layout.tsx`, or sibling `_components/` files. They are **not** imported by other routes or by `features/`.

If a `_components/` file starts being used by a second route → promote it to `src/features/[feature]/components/` and export it from the barrel.

### Rule 5 — `src/components/` is app shell and cross-feature primitives only

Components that are part of the app shell (Navigation, Footer, MusicPlayer, PageTransitionWrapper, FloatingPetals) or reusable UI primitives (Button, Input, Badge) belong here. Feature-specific UI does **not** belong here.

### Rule 6 — Rule of Proximity

- Used by **one route only** → `app/[route]/_components/`
- Reusable domain piece across routes → `src/features/[feature]/components/`
- Used by **multiple features** or app shell → `src/components/`
- Pure logic shared everywhere → `src/lib/`

---

## Decision Tree: Where Does This File Go?

```
Is this a Next.js special file?
(page.tsx / layout.tsx / loading.tsx / error.tsx / not-found.tsx / route.ts)
  YES → src/app/[route]/

Is this the entry-point view for a route, or UI only used by one route?
  YES → src/app/[route]/_components/

Is this a reusable domain UI component (used by 2+ routes or worth isolating)?
  YES → src/features/[feature]/components/
  Does the feature barrel export it?
    NO → add it to src/features/[feature]/index.ts

Is this a custom React hook?
  Scoped to one route → src/app/[route]/_components/ (inline or separate file)
  Scoped to one feature domain → src/features/[feature]/hooks/
  Shared globally → src/hooks/  (create when needed)

Is this a TypeScript type or interface?
  Scoped to one route → inline in the _components/ file
  Scoped to one feature → src/features/[feature]/types/ or inline
  Shared across features → src/lib/types.ts

Is this a pure utility / helper function?
  Scoped to one feature → src/features/[feature]/utils/
  Shared globally → src/lib/

Is this a Server Action or data-fetching function?
  Scoped to one feature → src/features/[feature]/api/
  Shared globally → src/actions/  (create when needed)

Is this a Framer Motion variant or animation config?
  → src/lib/animations.ts

Is this static content or data?
  → src/content/

Is this auto-generated?
  → src/lib/generated/  (do not edit by hand)
```

---

## Current State → Target State

Migrate one feature at a time. Update all imports immediately after each move.

| Current location                           | Target location                                              | Reason                               |
| ------------------------------------------ | ------------------------------------------------------------ | ------------------------------------ |
| `src/components/LetterCard.tsx`            | `src/features/letters/components/LetterCard.tsx`             | Reusable letters domain piece        |
| `src/components/LetterModal.tsx`           | `src/features/letters/components/LetterModal.tsx`            | Reusable letters domain piece        |
| `src/components/ImageLightbox.tsx`         | `src/features/gallery/components/ImageLightbox.tsx`          | Gallery domain piece — confirm scope |
| `src/components/MemoryCard.tsx`            | `src/features/gallery/components/` (shared gallery+timeline) | Domain piece shared across routes    |
| `src/components/MemoryDetailModal.tsx`     | `src/features/gallery/components/` (shared gallery+timeline) | Domain piece shared across routes    |
| `src/app/(protected)/gallery/page.tsx`     | Add `_components/GalleryView.tsx` next to it                 | Route view belongs in `_components/` |
| `src/app/(protected)/timeline/page.tsx`    | Add `_components/TimelineView.tsx` next to it                | Route view belongs in `_components/` |
| `src/app/(protected)/letters/page.tsx`     | Add `_components/LettersView.tsx` next to it                 | Route view belongs in `_components/` |
| `src/app/(protected)/home/page.tsx`        | Add `_components/HomeView.tsx` next to it                    | Route view belongs in `_components/` |
| `src/components/MusicPlayer.tsx`           | Keep in `src/components/`                                    | App shell                            |
| `src/components/MusicProvider.tsx`         | Keep in `src/components/`                                    | App shell                            |
| `src/components/Navigation.tsx`            | Keep in `src/components/`                                    | App shell                            |
| `src/components/Footer.tsx`                | Keep in `src/components/`                                    | App shell                            |
| `src/components/PageTransitionWrapper.tsx` | Keep in `src/components/`                                    | App shell                            |
| `src/components/FloatingPetals.tsx`        | Keep in `src/components/`                                    | Global ambient                       |

---

## Adding a New Feature (Checklist)

1. Create the route: `src/app/(protected)/[feature]/page.tsx`
2. Create `src/app/(protected)/[feature]/_components/[Feature]View.tsx` — the route's entry view
3. In `page.tsx`, import and render `<[Feature]View />` from `./_components/[Feature]View`
4. If the feature needs reusable domain pieces → create `src/features/[feature]/components/`
5. Create `src/features/[feature]/index.ts` and export only what `_components/` needs
6. Add sub-folders (`hooks/`, `types/`, `api/`) inside the feature only as needed
7. Add nav link in `src/components/Navigation.tsx` if needed
8. Add shared types to `src/lib/types.ts` only if they cross feature boundaries
9. Run `npm run lint` and `npm run typecheck`

## Deleting a Feature (Checklist)

1. Delete `src/app/(protected)/[feature]/` (includes `_components/`)
2. Delete `src/features/[feature]/` if it exists
3. Remove the nav link from `src/components/Navigation.tsx`
4. Remove types from `src/lib/types.ts` exclusive to this feature
5. Run `npm run typecheck` to surface broken imports

---

## Naming Conventions

| Thing                | Convention                         | Example                                  |
| -------------------- | ---------------------------------- | ---------------------------------------- |
| Feature folders      | lowercase, hyphens                 | `gallery/`, `letters/`, `memory-detail/` |
| Route `_components/` | `_components/` (underscore prefix) | `app/(protected)/gallery/_components/`   |
| Component files      | PascalCase `.tsx`                  | `GalleryView.tsx`, `LetterCard.tsx`      |
| Hook files           | camelCase, `use` prefix `.ts`      | `useCarousel.ts`                         |
| Utility files        | camelCase `.ts`                    | `formatDate.ts`                          |
| API/action files     | kebab-case `.ts`                   | `get-letters.ts`, `create-memory.ts`     |
| Types file           | lowercase                          | `types.ts`                               |
| Feature barrel       | `index.ts`                         | `src/features/gallery/index.ts`          |

---

## Absolute Imports

`@/*` maps to `./src/*`. `_components/` imports its own route siblings with relative paths.

```ts
// page.tsx → its own _components/ (relative)
import { GalleryView } from "./_components/GalleryView";

// _components/ → feature barrel (absolute)
import { GalleryCard, GalleryModal } from "@/features/gallery";

// _components/ → global shared components (absolute)
import { Navigation } from "@/components/Navigation";

// _components/ → lib (absolute)
import { Memory } from "@/lib/types";
import { fadeInUp } from "@/lib/animations";

// NEVER — relative climbing from _components/
import { Memory } from "../../../../lib/types";

// NEVER — reaching into feature internals
import { GalleryCard } from "@/features/gallery/components/GalleryCard";
```
