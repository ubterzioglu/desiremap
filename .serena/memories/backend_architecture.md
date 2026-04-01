# DesireMap Backend Architecture Summary

## Key Files
- `prisma/schema.prisma` - Database models (User, Bordell, Booking, Review, Visit, Badge, Address, Invoice)
- `src/lib/db.ts` - Prisma singleton client
- `src/lib/auth.ts` - NextAuth configuration with CredentialsProvider
- `src/lib/auth/paseto.ts` - PASETO v4 token service (Ed25519 keys, 7-day expiry)
- `src/lib/auth/guards.ts` - requireAuth, requireRole, requireAdmin helpers
- `src/lib/auth/password.ts` - bcrypt with cost factor 12
- `src/lib/auth/oauth/google.ts` - Google OAuth 2.0 with PKCE
- `src/lib/auth/blacklist.ts` - In-memory token blacklist (JTI-based)
- `src/lib/api.ts` - Client API layer (authApi, customerApi, bookingApi, establishmentsApi, adminApi)
- `src/middleware.ts` - Route protection with role-based access

## API Route Groups
- `/api/auth/*` - Authentication (login, register, logout, me, OAuth)
- `/api/bookings/*` - Booking CRUD
- `/api/establishments/*` - Public search
- `/api/admin/*` - Admin dashboard (stats, establishments, customers, bookings, reviews)
- `/api/customer/*` - Customer profile, bookings, visits, addresses, badges
- `/api/seed/*` - Database seeding (dev only)

## Dual Auth System
1. NextAuth.js - Session-based for web UI
2. PASETO tokens - Stateless API auth with JTI revocation

## Docs
- XML: docs/backend-architecture.xml (comprehensive with code examples)
- Markdown: docs/backend-architecture.md (summary)
- Full architecture: docs/backend-architecture.md
