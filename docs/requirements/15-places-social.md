# Requirement: Places — Comments & Reactions

## Context

Each place supports social interaction: users can leave text comments and add Facebook-style emoji reactions. These features mirror the pattern established for memories (see `10-memory-reactions.md` and `11-memory-comments.md`) but are applied to the places domain.

## Goals

- Allow both partners to comment on a place.
- Allow both partners to react to a place with emoji.
- Reuse the same interaction patterns defined for memory comments and reactions.

## UI Spec

### Place Detail View — Social Sections

Both sections appear inside the place detail view (modal or dedicated page), below the budget section.

---

#### Reactions

Identical behaviour to memory reactions (`10-memory-reactions.md`) applied to places:

- A row of emoji + count pills for all reactions with count ≥ 1.
- A **"+ Agregar reacción"** button opens the emoji picker popover.
- Highlighted pill = current user has reacted with that emoji; clicking toggles off.
- Clicking an unhighlighted pill or an emoji in the picker toggles on.
- Optimistic UI; revert + toast on API error.

Predefined emoji set (same as memories):

```
❤️  😍  😂  😭  🥰  🔥  😮  👏
```

---

#### Comments

Identical behaviour to memory comments (`11-memory-comments.md`) applied to places:

- Flat comment list: avatar, display name, text, relative timestamp, delete icon (author / admin only).
- Inline delete micro-confirmation ("¿Eliminar?" → Sí / No).
- New comment input at the bottom with Send button; Enter submits, Shift+Enter = newline.
- Input disabled + spinner while POST is in-flight.
- Clear input and append on success; inline error + preserve value on failure.
- Empty state: "Sé el primero en comentar."

---

### Place Card (List View)

- Show a compact reaction pill summary (up to 3 most-used emojis + total count) on the card, e.g. `❤️ 😍 +3`.
- Show a comment count badge, e.g. `💬 4`.
- Both are read-only on the card; clicking opens the place detail view.

## Data Shape (Frontend)

Reuse `Reaction` and `Comment` interfaces from `10-memory-reactions.md` and `11-memory-comments.md` with `placeId` replacing `memoryId`:

```ts
interface PlaceReaction {
  id: string;
  placeId: string;
  userId: string;
  emoji: string;
  createdAt: string;
}

interface PlaceComment {
  id: string;
  placeId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  createdAt: string;
}
```

## Backend Placeholder

> **[PLACEHOLDER]** The following are required from the backend but not implemented yet:
>
> - `GET /api/places/:id/reactions` — returns `PlaceReaction[]`.
> - `POST /api/places/:id/reactions` — body `{ emoji: string }`; adds a reaction. Returns the new `PlaceReaction`.
> - `DELETE /api/places/:id/reactions/:reactionId` — removes a reaction (owner only).
> - `GET /api/places/:id/comments` — returns `PlaceComment[]` sorted by `createdAt` ascending.
> - `POST /api/places/:id/comments` — body `{ text: string }`; creates a comment. Returns the new `PlaceComment`.
> - `DELETE /api/places/:id/comments/:commentId` — deletes a comment (author or admin only).

## Implementation Checklist

- [ ] Add `ReactionBar` to the place detail view (reuse or adapt the memory `ReactionBar` component)
- [ ] Add emoji picker popover to the place detail view (same predefined emoji set)
- [ ] Implement optimistic add/remove reactions for places
- [ ] Revert and show error toast on reaction API failure
- [ ] Add `CommentSection` to the place detail view (reuse or adapt the memory `CommentSection` component)
- [ ] Implement add comment with spinner, success clear, and error preservation
- [ ] Implement inline delete micro-confirmation for place comments
- [ ] Show compact reaction summary (up to 3 emojis + count) on place card
- [ ] Show comment count badge on place card
- [ ] Wire `GET /api/places/:id/reactions` — **backend must be ready first**
- [ ] Wire `POST /api/places/:id/reactions` — **backend must be ready first**
- [ ] Wire `DELETE /api/places/:id/reactions/:reactionId` — **backend must be ready first**
- [ ] Wire `GET /api/places/:id/comments` — **backend must be ready first**
- [ ] Wire `POST /api/places/:id/comments` — **backend must be ready first**
- [ ] Wire `DELETE /api/places/:id/comments/:commentId` — **backend must be ready first**
