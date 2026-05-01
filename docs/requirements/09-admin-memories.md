# Requirement: Admin Memories View

## Context

The current memories/timeline feature is read-only and driven by static JSON. A privileged admin view is needed to create, update, delete, and hide/show memories through a UI. Reactions and comments on memories are covered separately in `10-memory-reactions.md` and `11-memory-comments.md`. This requirement focuses solely on CRUD and visibility management.

## Goals

- Provide a `/admin/memories` route accessible only to admin users.
- List all memories (including hidden ones) with full management controls.
- Allow creating new memories via a form.
- Allow editing existing memories.
- Allow hard-deleting memories.
- Allow toggling a memory's visibility (hidden memories are not shown in the public timeline/gallery).

## Access Control

- The route is protected by an **admin guard** on top of the existing auth guard.
- Non-admin authenticated users are redirected to `/` with no error message exposed.
- Admin status is derived from `AuthUser.isAdmin: boolean` — set by the backend.

> **[PLACEHOLDER]** Backend must set `isAdmin` on the `AuthUser` object returned by `GET /api/auth/me`.

## UI Spec

### Admin Memories Page (`/admin/memories`)

**Header**

- Page title "Memorias — Admin".
- A prominent **"+ Nueva memoria"** button that opens the Create form.

**Memories Table / List**

- Each row displays: thumbnail image, title, date, visibility badge ("Visible" / "Oculta"), and an action menu (⋯ button).
- Hidden memories are visually distinguished (e.g. dimmed row or strikethrough on the title).
- Action menu items per row:
  - **Editar** — opens the Edit form pre-filled with the memory's data.
  - **Ocultar / Mostrar** — toggles the `hidden` flag; label reflects current state.
  - **Eliminar** — shows a confirmation dialog before deleting.

**Confirmation Dialog (Delete)**

- "¿Eliminar esta memoria?" with a brief warning that this action is irreversible.
- Two buttons: **Cancelar** and **Eliminar** (destructive style).

### Create / Edit Form (Modal or Slide-over)

Fields:

| Field | Input type | Required |
|-------|-----------|----------|
| Título | Text input | Yes |
| Fecha | Date picker | Yes |
| Descripción | Textarea | No |
| Imágenes | File upload (multiple) | No |
| Oculta | Toggle / checkbox | No (default: false) |

- Save button shows a spinner while the API call is in-flight.
- Inline validation errors shown below each field.
- On success: form closes, list refreshes.
- On API error: inline error banner at the top of the form.

## Data Shape (Frontend)

```ts
interface Memory {
  id: string;
  coupleId: string;
  title: string;
  date: string;          // ISO 8601
  description: string | null;
  imageUrls: string[];   // [PLACEHOLDER — resolved by backend/storage]
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Routing

| Path               | Component           | Notes                                         |
| ------------------ | ------------------- | --------------------------------------------- |
| `/admin/memories`  | `AdminMemoriesView` | Requires auth + `isAdmin === true`            |

## Backend Placeholder

> **[PLACEHOLDER]** The following are required from the backend but not implemented yet:
>
> - `GET /api/memories` — returns all memories for the couple (including hidden); admin only.
> - `POST /api/memories` — creates a new memory; accepts multipart form data for images.
> - `PATCH /api/memories/:id` — updates fields on an existing memory.
> - `DELETE /api/memories/:id` — permanently deletes a memory.
> - `PATCH /api/memories/:id/visibility` — toggles `hidden`; body `{ hidden: boolean }`.

## Implementation Checklist

- [ ] Create `AdminMemoriesView` at `apps/web-app/src/app/admin/memories/page.tsx`
- [ ] Implement admin guard: redirect non-admin users to `/`
- [ ] Build memories list/table with thumbnail, title, date, visibility badge, and action menu
- [ ] Visually distinguish hidden memories in the list
- [ ] Implement **Ocultar / Mostrar** toggle action with optimistic UI
- [ ] Implement **Eliminar** action with confirmation dialog
- [ ] Build Create/Edit form modal or slide-over with all defined fields
- [ ] Add file upload input supporting multiple images
- [ ] Add inline field validation
- [ ] Add loading spinner on form save button
- [ ] Add inline error banner on form API error
- [ ] Refresh list after successful create, edit, delete, or visibility toggle
- [ ] Wire `GET /api/memories` (admin) — **backend must be ready first**
- [ ] Wire `POST /api/memories` — **backend must be ready first**
- [ ] Wire `PATCH /api/memories/:id` — **backend must be ready first**
- [ ] Wire `DELETE /api/memories/:id` — **backend must be ready first**
- [ ] Wire `PATCH /api/memories/:id/visibility` — **backend must be ready first**
