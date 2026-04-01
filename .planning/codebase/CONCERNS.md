# Codebase Concerns

**Analysis Date:** 2026-03-08

## Security

### In-Memory Token Blacklist
- **Issue:** Token blacklist is implemented as an in-memory `Set<string>` which resets on every server restart
- **Files:** `src/lib/auth/blacklist.ts`
- **Impact:** Users who logged out may have tokens become valid again after server restart (if tokens haven't expired). In serverless/edge environments with multiple instances, blacklist state is not shared between instances
- **Current mitigation:** 7-day token expiry provides eventual expiration
- **Fix approach:** Migrate to Redis with TTL matching token expiry (7 days). The code already includes comments indicating this is planned for production

### Dual Authentication System Complexity
- **Issue:** Two separate auth systems exist: PASETO tokens (primary) and NextAuth.js (legacy)
- **Files:** `src/lib/auth/paseto.ts`, `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`
- **Impact:** Inconsistent auth patterns across API routes. Some routes use `getServerSession(authOptions)` while others use PASETO guards from `src/lib/auth/guards.ts`. This creates confusion and potential security gaps
- **Fix approach:** Standardize on PASETO throughout, deprecate NextAuth.js endpoints, or clearly document which routes use which system

### Missing Rate Limiting
- **Issue:** No rate limiting on authentication endpoints (login, register, OAuth)
- **Files:** `src/app/api/auth/login/route.ts`, `src/app/api/register/route.ts`
- **Impact:** Vulnerable to brute force attacks on login and registration spam
- **Fix approach:** Implement rate limiting using middleware or edge-compatible rate limiter (e.g., Upstash Redis)

### Missing NEXTAUTH_SECRET in Environment
- **Issue:** NextAuth.js configuration references `process.env.NEXTAUTH_SECRET` which is not documented in `.env.example`
- **Files:** `src/lib/auth.ts` (line 80), `.env.example`
- **Impact:** NextAuth sessions may fail or use insecure defaults in production
- **Fix approach:** Add `NEXTAUTH_SECRET` to `.env.example` with generation instructions

### Seed Endpoint Security
- **Issue:** Seed endpoint only checks `NODE_ENV` for production protection
- **Files:** `src/app/api/seed/route.ts`
- **Impact:** In staging/preview environments that run production builds, the seed endpoint is blocked. In development, anyone with network access can seed the database
- **Fix approach:** Add authentication requirement (admin role) as an additional safeguard

### User-Supplied Data in JSON Fields
- **Issue:** Services, images, and availableSlots stored as stringified JSON without schema validation
- **Files:** `prisma/schema.prisma` (lines 183, 197-198), `src/app/api/admin/establishments/route.ts`
- **Impact:** Malformed JSON could cause runtime errors. No type safety for these fields
- **Fix approach:** Add Zod validation schemas for JSON fields before storage and after retrieval

## Technical Debt

### Widespread Use of `any` Type
- **Issue:** 15+ instances of `any` type in API routes, weakening TypeScript's type safety
- **Files:**
  - `src/app/api/establishments/route.ts` (lines 16, 43)
  - `src/app/api/admin/establishments/route.ts` (lines 28, 144)
  - `src/app/api/admin/reviews/route.ts` (lines 26, 77)
  - `src/app/api/admin/bookings/route.ts` (line 27, 83)
  - `src/app/api/admin/customers/route.ts` (lines 27, 96)
  - `src/app/api/bookings/[id]/route.ts` (line 94)
  - `src/app/api/customer/addresses/route.ts` (multiple)
  - `src/lib/api.ts` (most API functions return `any`)
- **Impact:** Loss of type safety, potential runtime errors, harder refactoring
- **Fix approach:** Define proper TypeScript interfaces for all API responses and database models

### API Client Lacks Type Safety
- **Issue:** Client-side API functions in `src/lib/api.ts` almost universally return `any`
- **Files:** `src/lib/api.ts`
- **Impact:** Frontend has no compile-time type checking for API responses
- **Fix approach:** Define response types matching backend responses, share types between frontend and backend

### Duplicate Password Hashing Implementations
- **Issue:** Two different bcrypt imports/usage patterns exist
- **Files:** `src/lib/auth/password.ts` (uses `@/lib/auth` hash/verify), `src/app/api/register/route.ts` (imports bcrypt directly)
- **Impact:** Inconsistency, potential for different salt rounds
- **Fix approach:** Use the centralized `hash()` function from `src/lib/auth/password.ts` everywhere

### Inconsistent Auth Guard Usage
- **Issue:** Some routes use `getServerSession(authOptions)` while others use `requireAuth`/`requireAdmin` from guards
- **Files:**
  - Uses NextAuth: `src/app/api/bookings/route.ts`, `src/app/api/customer/route.ts`, `src/app/api/admin/establishments/route.ts`
  - Should use PASETO guards: All routes should use `requireAuth`, `requireAdmin` from `src/lib/auth/guards.ts`
- **Impact:** Routes may accept NextAuth sessions but not PASETO tokens or vice versa
- **Fix approach:** Standardize on PASETO guards for all protected routes

### Prisma Query Logging in Production
- **Issue:** Prisma client configured with `log: ['query']` unconditionally
- **Files:** `src/lib/db.ts` (line 10)
- **Impact:** All database queries logged to console in production, potential performance impact and information exposure
- **Fix approach:** Make logging conditional on `NODE_ENV !== 'production'`

## Performance

### N+1 Query in Customer Profile
- **Issue:** Profile endpoint makes multiple sequential database calls
- **Files:** `src/app/api/customer/route.ts` (lines 38-58)
- **Impact:** Three separate queries: user with relations, visits for total spent, visits for favorite city
- **Fix approach:** Combine into single query using Prisma aggregations

### Uncapped Database Query Results
- **Issue:** Several endpoints lack pagination limits
- **Files:**
  - `src/app/api/customer/visits/route.ts` - No limit on visits
  - `src/app/api/customer/bookings/route.ts` - No limit on bookings
  - `src/app/api/customer/addresses/route.ts` - No limit on addresses
- **Impact:** Memory issues with users who have many records
- **Fix approach:** Add pagination (limit/offset) to all list endpoints

### View Counter Race Condition
- **Issue:** View increment on establishment detail uses non-atomic read-modify-write
- **Files:** `src/app/api/establishments/route.ts` (lines 101-105)
- **Impact:** Under high concurrency, view counts may be lost
- **Fix approach:** Already uses atomic increment (`views: { increment: 1 }`) - this is correct

### Large Component Files
- **Issue:** Several components exceed 300 lines, indicating potential complexity
- **Files:**
  - `src/lib/structuredData.ts` - 1055 lines (SEO schema generation)
  - `src/components/ui/sidebar.tsx` - 726 lines (shadcn component)
  - `src/components/pages/AdminPanel.tsx` - 572 lines
  - `src/components/listings/ReservationModal.tsx` - 512 lines
- **Impact:** Harder to maintain, test, and understand
- **Fix approach:** Extract sub-components and utilities

## Scalability

### Serverless Token Blacklist
- **Issue:** In-memory blacklist doesn't work in serverless environments with multiple instances
- **Files:** `src/lib/auth/blacklist.ts`
- **Impact:** Vercel/edge deployments will have inconsistent blacklist state
- **Fix approach:** Use Redis (Upstash recommended for Vercel) with 7-day TTL

### Missing Database Connection Pooling Configuration
- **Issue:** Prisma client uses default connection pool settings
- **Files:** `src/lib/db.ts`
- **Impact:** Under high load, may exhaust database connections
- **Fix approach:** Configure connection pool limits based on deployment environment

### Static Locale Paths in Middleware
- **Issue:** Protected route paths are hardcoded for each locale
- **Files:** `src/middleware.ts` (lines 9-23)
- **Impact:** Adding new locales requires code changes in multiple places
- **Fix approach:** Use dynamic locale detection from `next-intl` configuration

## Incomplete Features

### Email Verification Not Implemented
- **Issue:** `emailVerified` field exists in User model but no verification flow
- **Files:** `prisma/schema.prisma` (line 85)
- **Impact:** Users can register and use accounts without email verification
- **Fix approach:** Implement email verification with tokens and reminder emails

### Owner Establishment Management
- **Issue:** No API routes for owners to manage their own establishments
- **Files:** Missing: `src/app/api/owner/establishments/route.ts`
- **Impact:** Owners cannot manage their establishments without admin intervention
- **Fix approach:** Create owner-scoped establishment management endpoints

### Password Reset Flow Missing
- **Issue:** No forgot password or password reset functionality
- **Files:** Not implemented
- **Impact:** Users cannot recover accounts if password is lost
- **Fix approach:** Implement password reset with email tokens

### No Test Coverage
- **Issue:** Zero test files found in `src/` directory
- **Files:** Glob patterns `**/*.test.ts` and `**/*.spec.ts` return no matches in src
- **Impact:** No automated regression testing, refactoring is risky
- **Fix approach:** Add Jest or Vitest configuration, write tests for critical paths (auth, bookings, payments)

### Booking Availability System
- **Issue:** `availableSlots` field exists but no validation against it during booking creation
- **Files:** `prisma/schema.prisma` (line 198), `src/app/api/bookings/route.ts`
- **Impact:** Double-booking possible, no capacity management
- **Fix approach:** Add availability checking in booking creation endpoint

## Test Coverage Gaps

### Authentication Flow Untested
- **What's not tested:** Login, registration, OAuth flow, token verification, blacklist
- **Files:** All files in `src/lib/auth/` and `src/app/api/auth/`
- **Risk:** Security regressions could go undetected
- **Priority:** High

### Booking System Untested
- **What's not tested:** Booking creation, status transitions, access control
- **Files:** `src/app/api/bookings/`, `src/app/api/bookings/[id]/`
- **Risk:** Financial transactions and user bookings could break
- **Priority:** High

### Authorization Rules Untested
- **What's not tested:** Role-based access control, resource ownership checks
- **Files:** `src/middleware.ts`, `src/lib/auth/guards.ts`
- **Risk:** Unauthorized access to admin or other users' data
- **Priority:** High

---

*Concerns audit: 2026-03-08*
