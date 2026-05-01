# Requirement: Places — Budget & Expenses

## Context

Each place can have a list of expense line items (e.g. products bought, services consumed) with a name and an amount. The total of all line items represents the budget spent at that place. This total is displayed on the place card and used for sorting (see `16-places-filters.md`).

## Goals

- Allow the couple to add, edit, and delete expense line items for a place.
- Display the running total of all expenses.
- Show a summary total on the place card.

## UI Spec

### Budget Section (Place Detail View)

Displayed as a dedicated section inside the place detail view, below the ratings section.

**Section header**

- Title: "Gastos".
- Running total displayed to the right: e.g. "Total: $1,250.00" (currency formatted; locale `es-MX`, currency `MXN` — adjust if the app has a locale setting in the future).
- **"+ Agregar gasto"** button.

**Expense list**

Each line item row shows:

- Description / product name (text).
- Amount (right-aligned, formatted as currency).
- An **Edit** (pencil) icon and a **Delete** (trash) icon on hover/focus.

Empty state: "Sin gastos registrados." centered in the section.

**Add / Edit Expense Form (inline or small popover)**

Fields:

| Field | Input type | Required |
|-------|-----------|----------|
| Descripción | Text input | Yes |
| Monto | Number input (positive, 2 decimal places) | Yes |

- Save button shows spinner during API call.
- On success: form closes, list and total update.
- On error: inline error message below the form.

**Delete confirmation**

- Inline micro-confirmation: "¿Eliminar?" with **Sí** / **No** — no full modal.

**Place card summary**

- On the place card in the list, show the total budget as a compact label, e.g. "💰 $1,250" (truncated, no decimals on card; full precision in detail view).
- If no expenses, show nothing (do not display "$0").

## Data Shape (Frontend)

```ts
interface Expense {
  id: string;
  placeId: string;
  description: string;
  amount: number;       // positive decimal, stored as float
  createdAt: string;
  updatedAt: string;
}

// Derived for display
function computeTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}
```

## Backend Placeholder

> **[PLACEHOLDER]** The following are required from the backend but not implemented yet:
>
> - `GET /api/places/:id/expenses` — returns `Expense[]` for a place, sorted by `createdAt` ascending.
> - `POST /api/places/:id/expenses` — body `{ description: string; amount: number }`; creates an expense. Returns the new `Expense`.
> - `PATCH /api/places/:id/expenses/:expenseId` — body `{ description?: string; amount?: number }`; updates an expense.
> - `DELETE /api/places/:id/expenses/:expenseId` — deletes an expense.

## Implementation Checklist

- [ ] Create `BudgetSection` component in the places feature
- [ ] Display expense line items with description, amount, edit icon, delete icon
- [ ] Show running total in section header (formatted currency)
- [ ] Show empty state when no expenses exist
- [ ] Implement Add Expense inline form / popover with description + amount fields
- [ ] Implement Edit Expense form pre-filled with existing values
- [ ] Add loading spinner on form save
- [ ] Add inline error message on API failure
- [ ] Implement inline delete micro-confirmation (Sí / No)
- [ ] Implement `computeTotal` utility
- [ ] Show budget total summary on place card (hide if 0)
- [ ] Integrate `BudgetSection` into place detail view
- [ ] Wire `GET /api/places/:id/expenses` — **backend must be ready first**
- [ ] Wire `POST /api/places/:id/expenses` — **backend must be ready first**
- [ ] Wire `PATCH /api/places/:id/expenses/:expenseId` — **backend must be ready first**
- [ ] Wire `DELETE /api/places/:id/expenses/:expenseId` — **backend must be ready first**
