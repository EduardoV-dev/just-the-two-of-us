# Requirement: Places — Filters & Sorting

## Context

As the places list grows, the couple needs to quickly sort and find places by relevant criteria. Two sort dimensions are required: average star rating and total budget. This requirement covers the filter/sort UI only; the underlying data (`averageRating`, `totalBudget`) comes from `13-places-rating.md` and `14-places-budget.md`.

## Goals

- Allow sorting the places list by average star rating (ascending or descending).
- Allow sorting the places list by total budget/expenses (ascending or descending).
- Sorting is applied client-side on the already-fetched list (no new API call needed).
- Only one sort criterion is active at a time.

## UI Spec

### Filter / Sort Bar

Displayed above the place card grid on the `/places` page, below the page header.

**Layout**

- A horizontal row of sort controls, left-aligned.
- Label: "Ordenar por:" followed by the sort buttons.

**Sort Buttons**

Two toggle button groups, each with three states: inactive, ascending (↑), descending (↓).

| Button | Sort key | Ascending label | Descending label |
|--------|----------|-----------------|------------------|
| Estrellas | `averageRating` | "Estrellas ↑" | "Estrellas ↓" |
| Presupuesto | `totalBudget` | "Presupuesto ↑" | "Presupuesto ↓" |

- Clicking an inactive button activates it in ascending order.
- Clicking an active ascending button switches to descending.
- Clicking an active descending button deactivates it (returns to default order).
- Activating one button deactivates the other (mutually exclusive).
- Active button has a distinct visual style (filled/highlighted).

**Default order**

When no sort is active, places are shown in `createdAt` descending order (most recently added first).

**Null handling**

- Places with no ratings sort last when sorting by stars (both ascending and descending).
- Places with no expenses ($0 total) sort first when sorting ascending by budget, last when descending.

**Responsive**

On small screens the sort bar stacks or scrolls horizontally; it does not wrap awkwardly.

## Sort Logic (Frontend)

```ts
type SortKey = 'averageRating' | 'totalBudget';
type SortDirection = 'asc' | 'desc';

interface SortState {
  key: SortKey | null;
  direction: SortDirection;
}

function sortPlaces(places: PlaceWithDerived[], sort: SortState): PlaceWithDerived[] {
  if (!sort.key) {
    // Default: createdAt descending
    return [...places].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return [...places].sort((a, b) => {
    const aVal = a[sort.key!] ?? (sort.direction === 'asc' ? Infinity : -Infinity);
    const bVal = b[sort.key!] ?? (sort.direction === 'asc' ? Infinity : -Infinity);
    return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
  });
}
```

`PlaceWithDerived` extends `Place` with `averageRating: number | null` and `totalBudget: number`.

## No Backend Changes Required

Sorting is entirely client-side. No new API endpoints are needed.

## Implementation Checklist

- [ ] Create `PlacesSortBar` component in the places feature
- [ ] Render two toggle buttons: "Estrellas" and "Presupuesto"
- [ ] Implement three-state toggle per button: inactive → asc → desc → inactive
- [ ] Enforce mutual exclusivity: activating one button deactivates the other
- [ ] Visually distinguish the active button (filled/highlighted style)
- [ ] Implement `sortPlaces` utility with null-value handling as specified
- [ ] Apply `sortPlaces` to the places list in `PlacesView` based on current `SortState`
- [ ] Default sort: `createdAt` descending when no sort is active
- [ ] Integrate `PlacesSortBar` into `PlacesView` above the place card grid
- [ ] Ensure the sort bar is usable on small screens (horizontal scroll or stack)
