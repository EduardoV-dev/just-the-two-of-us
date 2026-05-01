# Requirement: Places Page — Core

## Context

The couple wants to track and rank places they visit or have visited together (restaurants, apartments, hotels, etc.). This requirement covers the `/places` route: listing, creating, editing, and deleting places. Rating, budget, social features, and filters are covered in separate requirements (`13-places-rating.md`, `14-places-budget.md`, `15-places-social.md`, `16-places-filters.md`).

## Goals

- Provide a `/places` page that lists all places for the couple.
- Support multiple place types (Restaurant, Apartamento, Hotel, Otro).
- Allow adding, editing, and deleting places.
- Support attaching one or more photos to a place.

## UI Spec

### Places List Page (`/places`)

**Header**

- Page title "Lugares".
- **"+ Agregar lugar"** button that opens the Create form.

**Place Card Grid / List**

Each place is displayed as a card containing:

- Primary photo (or a placeholder icon if no photos).
- Place name.
- Type badge (e.g. "Restaurante", "Hotel").
- Average star rating — rendered as stars (see `13-places-rating.md` for logic).
- Total budget summary (see `14-places-budget.md` for logic).
- A ⋯ action menu with **Editar** and **Eliminar**.

Empty state: "Aún no han agregado ningún lugar. ¡Empiécen a explorar!" with the "Agregar lugar" button below.

**Delete confirmation**

- A dialog: "¿Eliminar este lugar?" with a note that photos, ratings, comments, and expenses will also be deleted.
- Two buttons: **Cancelar** and **Eliminar** (destructive style).

### Create / Edit Form (Modal or Slide-over)

Fields:

| Field | Input type | Required |
|-------|-----------|----------|
| Nombre | Text input | Yes |
| Tipo | Select (Restaurant / Apartamento / Hotel / Otro) | Yes |
| Descripción | Textarea | No |
| Fotos | File upload (multiple images) | No |

- Existing photos displayed as thumbnails with an ✕ button to remove each.
- Save button shows a spinner during the API call.
- Inline field validation.
- On success: form closes, list refreshes.
- On API error: inline error banner at the top of the form.

## Data Shape (Frontend)

```ts
type PlaceType = 'restaurant' | 'apartment' | 'hotel' | 'other';

interface Place {
  id: string;
  coupleId: string;
  name: string;
  type: PlaceType;
  description: string | null;
  photoUrls: string[];    // [PLACEHOLDER — resolved by backend/storage]
  createdAt: string;
  updatedAt: string;
  // averageRating and totalBudget are derived/joined fields — see requirements 13 and 14
}
```

## Routing

| Path      | Component    | Notes                         |
| --------- | ------------ | ----------------------------- |
| `/places` | `PlacesView` | Requires auth + linked couple |

## Backend Placeholder

> **[PLACEHOLDER]** The following are required from the backend but not implemented yet:
>
> - `GET /api/places` — returns all places for the couple, with joined `averageRating` and `totalBudget`.
> - `POST /api/places` — creates a new place; accepts multipart form data for photos.
> - `PATCH /api/places/:id` — updates fields; accepts multipart form data for new photos.
> - `DELETE /api/places/:id` — deletes the place and all related data (ratings, comments, expenses, reactions).

## Implementation Checklist

- [ ] Create `PlacesView` at `apps/web-app/src/app/places/page.tsx`
- [ ] Build place card grid/list with photo, name, type badge, star rating stub, and budget stub
- [ ] Add "Agregar lugar" button in page header
- [ ] Show empty state when no places exist
- [ ] Implement ⋯ action menu with Editar and Eliminar per card
- [ ] Implement delete confirmation dialog with correct warning text
- [ ] Build Create/Edit form modal/slide-over with all defined fields
- [ ] Support multiple photo uploads with thumbnail preview and individual remove (✕)
- [ ] Add inline field validation
- [ ] Add loading spinner on form save button
- [ ] Add inline error banner on form API error
- [ ] Refresh list after create, edit, or delete
- [ ] Wire `GET /api/places` — **backend must be ready first**
- [ ] Wire `POST /api/places` — **backend must be ready first**
- [ ] Wire `PATCH /api/places/:id` — **backend must be ready first**
- [ ] Wire `DELETE /api/places/:id` — **backend must be ready first**
