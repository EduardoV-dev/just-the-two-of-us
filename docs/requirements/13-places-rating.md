# Requirement: Places — Star Rating

## Context

Each place can be rated by each partner independently on a scale of 0 to 5 stars. The couple's average of both ratings is the place's displayed score. This averaged score is what appears on the place card and is used for sorting (see `16-places-filters.md`).

## Goals

- Allow each authenticated user to set or update their own star rating (0–5) for a place.
- Compute and display the couple's average rating.
- Render ratings as visual stars on the place card and place detail view.

## UI Spec

### Star Rating Widget

Used in two contexts: place card (read-only display) and place detail view (interactive).

**Place card (read-only)**

- Displays the couple's average rating as filled/half/empty stars (0–5 scale, half-star precision).
- A numeric label next to the stars, e.g. "4.5".
- If no ratings have been submitted yet, show "Sin calificación" in place of stars.

**Place detail view (interactive)**

- Section titled "Tu calificación".
- An interactive 5-star row. Hovering over a star previews the selection; clicking sets it.
- The selected value is highlighted; unselected stars are outlined.
- A "0" or clear button allows removing the rating (sets it back to unrated).
- Below the interactive row, show both individual ratings:
  - "[Nombre del usuario A]: ★★★★☆ (4)"
  - "[Nombre del usuario B]: ★★★★★ (5)"
  - "Promedio: ★★★★½ (4.5)"
- If a partner has not rated yet, show "Sin calificación" for their row.

**Save behaviour**

- Rating saves immediately on click (no separate Save button) with an optimistic update.
- On API error: revert to previous value and show a brief toast/snackbar error.

## Data Shape (Frontend)

```ts
interface PlaceRating {
  id: string;
  placeId: string;
  userId: string;
  score: number;    // 0–5, integers only
  createdAt: string;
  updatedAt: string;
}

// Derived for display
interface PlaceRatingSummary {
  userARating: number | null;
  userBRating: number | null;
  average: number | null;   // null when no ratings exist; otherwise (A + B) / 2 or single score
}
```

Average computation (frontend utility):

```ts
function computeAverage(a: number | null, b: number | null): number | null {
  if (a === null && b === null) return null;
  if (a === null) return b;
  if (b === null) return a;
  return (a + b) / 2;
}
```

## Backend Placeholder

> **[PLACEHOLDER]** The following are required from the backend but not implemented yet:
>
> - `GET /api/places/:id/ratings` — returns up to two `PlaceRating` records (one per partner).
> - `PUT /api/places/:id/ratings` — body `{ score: number }`; upserts the current user's rating. Returns the updated `PlaceRating`.
> - `DELETE /api/places/:id/ratings` — removes the current user's rating (sets to unrated).

## Implementation Checklist

- [ ] Create `StarRating` display component (read-only, supports half-star rendering)
- [ ] Create `StarRatingInput` interactive component (hover preview, click to set, clear button)
- [ ] Implement `computeAverage` utility
- [ ] Render read-only average star rating on the place card (with "Sin calificación" fallback)
- [ ] Add "Tu calificación" section to the place detail view with `StarRatingInput`
- [ ] Display individual ratings for both partners and the average in the detail view
- [ ] Show "Sin calificación" for a partner who has not yet rated
- [ ] Implement optimistic update on rating click
- [ ] Revert and show error toast on API failure
- [ ] Wire `GET /api/places/:id/ratings` — **backend must be ready first**
- [ ] Wire `PUT /api/places/:id/ratings` — **backend must be ready first**
- [ ] Wire `DELETE /api/places/:id/ratings` — **backend must be ready first**
