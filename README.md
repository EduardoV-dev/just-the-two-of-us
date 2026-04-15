# Solo Nosotros Dos

A private web experience built for two — photos, letters, memories, and a countdown to something special.

## Stack

- **Next.js 16** (App Router) — React 19, TypeScript strict
- **Tailwind v4** (CSS-first, no config file)
- **Framer Motion** — page transitions, scroll reveals, floating petals
- **Embla Carousel** — fullscreen memory viewer with fade transitions
- **Netlify** — deploy via `@netlify/plugin-nextjs`

## Features

| Section              | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| **Inicio**           | Landing hero with animated welcome message                  |
| **Historia**         | Alternating timeline of memories with photos                |
| **Cartas**           | Airmail-styled letter cards that open into a full read view |
| **Galería**          | Photo grid with a fullscreen lightbox                       |
| **Cuenta regresiva** | Live countdown to a special date                            |
| **Música**           | Floating music player — _Just the Two of Us_                |

Access is gated by a single password. Authentication sets an httpOnly cookie valid for 30 days.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Edit .env.local — ACCESS_PASSWORD is required

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable                  | Required | Description                                             |
| ------------------------- | -------- | ------------------------------------------------------- |
| `ACCESS_PASSWORD`         | yes      | Site password checked by `POST /api/auth`               |
| `ENVIRONMENT`             | no       | Set to `production` to enable the countdown lock        |
| `NEXT_PUBLIC_UNLOCK_DATE` | no       | ISO date string; defaults to `2026-04-26T02:00:00.000Z` |

When `ENVIRONMENT=production` and the current time is before `UNLOCK_DATE`, all routes redirect to the countdown page.

## Commands

```bash
npm run dev          # dev server (http://localhost:3000)
npm run build        # production build
npm run typecheck    # tsc --noEmit
npm run lint         # eslint src/
npm run lint:fix     # eslint src/ --fix
npm run format       # prettier --write .
```

**Before committing:** run `lint` → `typecheck` → `build` in that order. The pre-commit hook enforces all three automatically (expect ~30–60 s per commit).

## Project structure

```
src/
  app/                         # Next.js App Router
    (protected)/               # Auth-gated routes
      home/
      gallery/
      letters/
      timeline/
    countdown/
    _components/               # LoginForm
    api/auth/                  # Password check → sets cookie
    globals.css                # Tailwind v4 + design tokens
    layout.tsx

  features/                    # Reusable domain logic (barrel exports)
    gallery/                   # MemoryCard, MemoryDetailModal, ImageLightbox
    letters/                   # LetterCard, LetterModal

  components/                  # App shell only
    Navigation.tsx
    Footer.tsx
    MusicPlayer.tsx / MusicProvider.tsx
    FloatingPetals.tsx
    PageTransitionWrapper.tsx

  lib/
    animations.ts              # Framer Motion variants
    content.ts                 # Static data loaders + formatDate()
    types.ts

  content/                     # Static JSON data
    memories/memories.json
    letters/letters.json
    gallery.json

public/
  images/
    memories/                  # Memory photos
    gallery/                   # Gallery photos
    song-covers/               # Album art
  audio/                       # Music files
```

### Import rules

- Route `_components/` import features via barrel: `import { X } from "@/features/gallery"`
- Never import from feature internals: `@/features/gallery/components/X` is an ESLint error
- `page.tsx` files are thin wrappers — no logic, import + render only

## Adding content

**Memories** — edit `src/content/memories/memories.json`, add images to `public/images/memories/`

**Letters** — edit `src/content/letters/letters.json`

**Gallery** — edit `src/content/gallery.json`, add images to `public/images/gallery/`

Images are served via `next/image` with `fill` layout. Provide reasonably sized originals (the optimizer handles the rest).

## Design tokens

All tokens live in `src/app/globals.css` under `:root` and `@theme inline`. Use these utility classes throughout:

`bg-background` `bg-surface` `bg-accent` `text-text-primary` `text-text-secondary` `text-text-muted` `border-border`

Fonts: `font-heading` (Playfair Display) · `font-body` (Inter)

To add a color: add a CSS var in `:root` and map it in `@theme inline`. No `tailwind.config.js` exists or should be created.

## Deployment

Deployed to Netlify. Push to main — Netlify picks up the build automatically.

Build command: `npm run build`  
Publish directory: `.next`

Set `ACCESS_PASSWORD` and `ENVIRONMENT=production` in Netlify's environment variable settings.
