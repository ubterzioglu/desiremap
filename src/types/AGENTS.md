<agents-mem-context>
# Recent Activity

<!-- Directory: src/types/ -->

### Feb 22, 2026

| ID | Time | T | Title | Read |
|----|------|---|-------|------|
| #1 | 1:45 PM | ✅ | Created type definitions split into index.ts and admin.ts | ~180 |
| #2 | 1:48 PM | 🟡 | Split types to keep under 200 line limit | ~50 |

</agents-mem-context>

## Module Info

- **Path**: src/types/
- **Purpose**: TypeScript type definitions for the entire app
- **Related**: All src/ directories

## Files

| File | Purpose | Lines |
|------|---------|-------|
| index.ts | Core types (Bordell, User, Translations, etc.) | ~60 |
| admin.ts | Admin-specific types (Invoice, etc.) | ~15 |

## Key Types

### Core (index.ts)
- `View` - Page view types
- `Bordell` - Establishment data
- `User`, `Customer` - User data
- `Booking`, `Review` - Transaction data
- `Translations` - i18n translation structure
- `Category`, `City` - Navigation data

### Admin (admin.ts)
- `Invoice` - Invoice/billing data
- `DashboardUser` - User dashboard state
