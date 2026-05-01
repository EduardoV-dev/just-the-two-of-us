# Requirement: Memory Comments

## Context

Users should be able to leave text comments on memories, creating a simple threaded conversation between the couple. Comments appear in the memory detail view. Both users can delete their own comments; admins can delete any comment.

## Goals

- Display existing comments on each memory in the detail view.
- Allow authenticated users to post a new comment.
- Allow a user to delete their own comment.
- Allow admin users to delete any comment.
- Comments are flat (no nested replies).

## UI Spec

### Comments Section

Displayed inside the memory detail modal or page, below the reactions bar (see `10-memory-reactions.md`).

**Comment list**

- Each comment shows:
  - User avatar (small, circular).
  - Display name.
  - Comment text.
  - Relative timestamp (e.g. "hace 2 días") with full date on hover.
  - A **Delete** icon (trash) visible only to the comment's author or an admin user; shown on hover/focus.
- Empty state: "Sé el primero en comentar." centered in the section.

**New comment input**

- A text input or small textarea at the bottom of the comments section.
- Placeholder: "Escribe un comentario…"
- A **Send** button (arrow icon or "Enviar" label) to the right of the input.
- Pressing Enter (without Shift) submits the comment.
- The input is disabled and shows a spinner while the POST is in-flight.
- On success: input is cleared, new comment appears at the bottom of the list.
- On error: inline error message below the input; input value is preserved.

**Delete confirmation**

- Clicking the delete icon shows a small inline confirmation ("¿Eliminar?" with Sí / No) rather than a full modal, to keep the interaction lightweight.

## Data Shape (Frontend)

```ts
interface Comment {
  id: string;
  memoryId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  createdAt: string;  // ISO 8601
}
```

## Backend Placeholder

> **[PLACEHOLDER]** The following are required from the backend but not implemented yet:
>
> - `GET /api/memories/:id/comments` — returns `Comment[]` sorted by `createdAt` ascending.
> - `POST /api/memories/:id/comments` — body `{ text: string }`; creates a comment as the current user. Returns the new `Comment`.
> - `DELETE /api/memories/:id/comments/:commentId` — deletes a comment; only the author or an admin may delete.

## Implementation Checklist

- [ ] Create `CommentSection` component in the memories feature
- [ ] Render comment list with avatar, name, text, relative timestamp, and delete icon
- [ ] Show delete icon only for the comment author or admin users
- [ ] Implement inline delete confirmation ("¿Eliminar?" with Sí / No)
- [ ] Show empty state when there are no comments
- [ ] Build new comment input with Send button
- [ ] Submit on Enter key (without Shift); allow Shift+Enter for line break
- [ ] Disable input + show spinner during POST in-flight
- [ ] Clear input and append new comment on success
- [ ] Show inline error below input on failure, preserving input value
- [ ] Integrate `CommentSection` into the memory detail modal/view, below `ReactionBar`
- [ ] Wire `GET /api/memories/:id/comments` — **backend must be ready first**
- [ ] Wire `POST /api/memories/:id/comments` — **backend must be ready first**
- [ ] Wire `DELETE /api/memories/:id/comments/:commentId` — **backend must be ready first**
