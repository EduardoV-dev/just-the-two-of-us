# Requirement: Relationship Day Counter

## Context

The app needs to surface how many days the couple has been together. The start date is captured during couple setup (see `07-couple-setup.md`). The counter must be permanently visible while the user navigates the app, and the start date must be editable from a settings page.

## Goals

- Show the elapsed number of days since `Couple.startDate` on every page.
- Calculate the count entirely on the frontend (no backend call needed for the count itself).
- Allow the couple to update the start date from a settings page.

## UI Spec

### Counter Widget (Navbar)

- Position: fixed element inside the top navigation bar, always visible regardless of scroll position.
- Content: a compact pill or badge showing e.g. **"❤ 487 días"** (day count in `es-ES` locale, heart icon prefix).
- The day count is recomputed on every render from `Couple.startDate` to today's date (local time, midnight-to-midnight, inclusive of start day).
- Tooltip or subtitle on hover/tap: the formatted start date, e.g. "Desde el 14 de marzo de 2022".
- The widget is only rendered when the user is authenticated and has a linked couple.

### Settings Page (`/settings`)

A dedicated settings page (new route). Initially contains only one section: **Relación**.

**Relación section**

- Labeled field "Fecha de inicio de la relación" showing the current `startDate` formatted in `es-ES` (e.g. "14 de marzo de 2022").
- An **Edit** button / pencil icon that switches the field to an editable date picker.
- On save: optimistic UI update, then API call to persist.
- On API error: revert to previous value, show inline error.
- Cancel button discards the change without saving.

Settings page is accessible from the navbar (e.g. gear icon or user avatar menu).

## Data Shape (Frontend)

No new types beyond `Couple.startDate: string` (ISO 8601) defined in `07-couple-setup.md`.

Counter derivation (pure function, no side effects):

```ts
function getDayCount(startDate: string): number {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - start.getTime()) / 86_400_000) + 1;
}
```

## Routing

| Path        | Component      | Notes                         |
| ----------- | -------------- | ----------------------------- |
| `/settings` | `SettingsView` | Requires auth + linked couple |

## Backend Placeholder

> **[PLACEHOLDER]** The following is required from the backend but not implemented yet:
>
> - `PATCH /api/couples/:id` — updates `startDate` on the couple record; returns the updated `Couple`.

## Implementation Checklist

- [ ] Add `getDayCount(startDate: string): number` utility to `apps/web-app/src/lib/`
- [ ] Add `RelationshipCounter` widget component to `apps/web-app/src/components/`
- [ ] Render `RelationshipCounter` inside the existing `Navigation` component (visible on all pages)
- [ ] Show counter only when user is authenticated and `coupleId` is set
- [ ] Add hover/tap tooltip displaying formatted start date in `es-ES`
- [ ] Create `SettingsView` at `apps/web-app/src/app/settings/page.tsx`
- [ ] Add "Relación" section with read-only display of current `startDate`
- [ ] Implement edit mode: date picker replacing the display field
- [ ] Add Save and Cancel buttons in edit mode
- [ ] Implement optimistic update on save; revert on API error with inline error message
- [ ] Add Settings link in navbar (gear icon or avatar menu)
- [ ] Wire `PATCH /api/couples/:id` on save — **backend must be ready first**
