# Requirement: Memory Reactions

## Context

Users should be able to react to memories with emojis, similar to social media reaction systems. Each user in the couple can add one or more reactions per memory. This feature applies to the public-facing memory/gallery view as well as the admin view (see `09-admin-memories.md`).

## Goals

- Display the current reaction counts on each memory card and in the memory detail view.
- Allow authenticated users to add a reaction by selecting an emoji.
- Allow users to remove their own reaction by clicking it again (toggle).
- A user can have at most one reaction of each emoji type per memory.

## UI Spec

### Reaction Bar

Displayed at the bottom of each memory card and in the memory detail modal/page.

- Shows a row of emoji + count pills for all reactions that have at least one user.
  - Example: `❤️ 2  😍 1  😂 1`
- A **"+ Add reaction"** button (smiley face icon) opens the emoji picker.
- If the current user has already reacted with a given emoji, that pill is highlighted (e.g. filled background vs. outline).
- Clicking a highlighted pill removes the user's reaction (toggle off).
- Clicking an unhighlighted pill adds the user's reaction.

### Emoji Picker

- A small popover anchored to the "+ Add reaction" button.
- Contains a predefined set of emojis (curated list, not a full Unicode picker).

Suggested default set:

```
❤️  😍  😂  😭  🥰  🔥  😮  👏
```

- Clicking an emoji in the picker adds that reaction and closes the picker.
- If the user already has that emoji, clicking it in the picker removes it instead.

### Loading & Optimistic UI

- Reaction counts update immediately (optimistic) when a user taps a reaction.
- On API error the count reverts and a brief toast/snackbar error is shown.

## Data Shape (Frontend)

```ts
interface Reaction {
  id: string;
  memoryId: string;
  userId: string;
  emoji: string;   // e.g. "❤️"
  createdAt: string;
}

// Derived for display — computed from the full reaction list
interface ReactionSummary {
  emoji: string;
  count: number;
  reactedByCurrentUser: boolean;
}
```

## Backend Placeholder

> **[PLACEHOLDER]** The following are required from the backend but not implemented yet:
>
> - `GET /api/memories/:id/reactions` — returns all `Reaction[]` for a memory.
> - `POST /api/memories/:id/reactions` — body `{ emoji: string }`; adds a reaction for the current user. Returns the new `Reaction`.
> - `DELETE /api/memories/:id/reactions/:reactionId` — removes a specific reaction; only the reaction's owner may delete it.

## Implementation Checklist

- [ ] Create `ReactionBar` component in the memories feature
- [ ] Display emoji + count pills for all reactions with count > 0
- [ ] Highlight pills where `reactedByCurrentUser === true`
- [ ] Implement toggle: clicking highlighted pill removes reaction; clicking unhighlighted adds it
- [ ] Build emoji picker popover with the predefined emoji set
- [ ] Close picker after an emoji is selected
- [ ] Implement optimistic UI for add/remove reactions
- [ ] Revert optimistic update and show error toast on API failure
- [ ] Integrate `ReactionBar` into the memory card component
- [ ] Integrate `ReactionBar` into the memory detail modal/view
- [ ] Wire `GET /api/memories/:id/reactions` — **backend must be ready first**
- [ ] Wire `POST /api/memories/:id/reactions` — **backend must be ready first**
- [ ] Wire `DELETE /api/memories/:id/reactions/:reactionId` — **backend must be ready first**
