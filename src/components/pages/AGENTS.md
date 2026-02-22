<agents-mem-context>
# Recent Activity

<!-- Directory: src/components/pages/ -->

### Feb 22, 2026

| ID | Time | T | Title | Read |
|----|------|---|-------|------|
| #1 | 1:45 PM | ✅ | Extracted page-level components from page.tsx | ~600 |
| #2 | 1:52 PM | 🔴 | Fixed Tailwind v4 gradient classes (bg-gradient → bg-linear) | ~200 |

</agents-mem-context>

## Module Info

- **Path**: src/components/pages/
- **Purpose**: Full-page components for different views
- **Related**: src/app/[locale]/page.tsx, src/components/listings/

## Components

| File | Purpose | Lines |
|------|---------|-------|
| CityPage.tsx | City-specific listing view with filters | ~27 |
| DetailPage.tsx | Single bordell detail view with contact info | ~27 |
| LoginPage.tsx | Login/register form with mode toggle | ~27 |
| DashboardPage.tsx | User dashboard with sidebar navigation | ~21 |
| AdminPanel.tsx | Admin panel with management tabs | ~25 |

## Dependencies

- lucide-react: Icons
- @/components/ui/*: Button, Input, Badge, etc.
- @/types: Bordell, DashboardTab, AdminTab, DashboardUser
- @/data/mock-data: bordells, admin data
