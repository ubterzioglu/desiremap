<agents-mem-context>
# Recent Activity

<!-- Directory: src/components/listings/ -->

### Feb 22, 2026

| ID | Time | T | Title | Read |
|----|------|---|-------|------|
| #1 | 1:45 PM | ✅ | Extracted listing components from page.tsx | ~400 |
| #2 | 1:52 PM | 🔴 | Fixed Tailwind v4 gradient classes (bg-gradient → bg-linear) | ~150 |

</agents-mem-context>

## Module Info

- **Path**: src/components/listings/
- **Purpose**: Listing card and reservation UI components
- **Related**: src/components/pages/DetailPage.tsx, src/data/mock-data.ts

## Components

| File | Purpose | Lines |
|------|---------|-------|
| ListingCard.tsx | Card displaying bordell info, badges, favorite button | ~30 |
| ListingsSection.tsx | Grid of listings with category filter | ~32 |
| ReservationModal.tsx | 3-step reservation flow with date/time picker | ~39 |

## Dependencies

- lucide-react: Icons
- @/components/ui/*: Dialog, Button, Badge, Input, Select
- @/types: Bordell interface
- @/data/mock-data: bordells, categories
