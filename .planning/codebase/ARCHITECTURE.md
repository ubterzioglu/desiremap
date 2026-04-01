# Architecture: DesireMap

**Analyzed:** 2026-03-08
**Type:** Brownfield Next.js App Router

## Pattern Overview

**Overall:** Next.js App Router with layered architecture

**Key Characteristics:**
- Locale-first routing via `[locale]` dynamic segment (de, en, ar, tr)
- Dual authentication system: Primary PASETO v4 tokens + Legacy NextAuth.js
- Client-side state management with Zustand (persisted)
- Server state management with TanStack Query
- Centralized API client in `src/lib/api.ts`
- Role-based access control at middleware level

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # Locale-scoped pages (de, en, ar, tr)
│   │   ├── page.tsx        # Home page (client component)
│   │   ├── layout.tsx      # Locale layout with providers
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   ├── dashboard/      # Protected dashboard
│   │   ├── admin/          # Admin panel (admin role)
│   │   ├── search/         # Search results
│   │   ├── bordell/[slug]/ # Establishment detail
│   │   └── blog/           # Blog pages
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── register/       # User registration
│   │   ├── customer/       # Customer profile API
│   │   ├── bookings/       # Booking CRUD
│   │   ├── establishments/ # Public search API
│   │   ├── admin/          # Admin operations
│   │   └── seed/           # Database seeding
│   ├── layout.tsx          # Root layout (passes children)
│   ├── globals.css         # Global styles
│   ├── sitemap.ts          # Dynamic sitemap generation
│   └── robots.ts           # Robots.txt generation
│
├── components/             # React components
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Layout components
│   ├── pages/              # Page-level components
│   ├── home/               # Home page sections
│   ├── listings/           # Listing-related components
│   ├── dashboard/          # Dashboard components
│   └── providers/          # Context providers
│
├── lib/                    # Utilities and services
│   ├── auth/               # Authentication module
│   │   ├── index.ts        # Module exports
│   │   ├── paseto.ts       # PASETO token service
│   │   ├── password.ts     # Password hashing
│   │   ├── blacklist.ts    # Token revocation
│   │   ├── guards.ts       # Route protection helpers
│   │   └── oauth/google.ts # Google OAuth flow
│   ├── api.ts              # Centralized API client
│   ├── db.ts               # Prisma client singleton
│   ├── utils.ts            # General utilities
│   ├── search.ts           # Search utilities
│   └── structuredData.ts   # SEO structured data
│
├── stores/                 # Zustand state stores
│   ├── authStore.ts        # Authentication state
│   ├── bookingStore.ts     # Booking state
│   └── adminStore.ts       # Admin panel state
│
├── types/                  # TypeScript type definitions
├── data/                   # Static/mock data
└── middleware.ts           # Route protection middleware

prisma/
└── schema.prisma           # Database schema
```

## Layers

### Presentation Layer
- **Purpose:** UI components and page rendering
- **Location:** `src/components/`, `src/app/[locale]/`
- **Contains:** React components, page compositions, animations (Framer Motion)
- **Depends on:** API client, Zustand stores, next-intl
- **Used by:** End users via browser

### API Layer
- **Purpose:** Server-side business logic and data access
- **Location:** `src/app/api/`
- **Contains:** RESTful endpoints, request validation (Zod), database operations
- **Depends on:** Auth guards, Prisma client
- **Used by:** Presentation layer via fetch

### Authentication Layer
- **Purpose:** Token generation, verification, and access control
- **Location:** `src/lib/auth/`, `src/middleware.ts`
- **Contains:** PASETO token service, password hashing, OAuth flow, guards
- **Depends on:** Database (user lookup), crypto module
- **Used by:** API routes, middleware

### Data Layer
- **Purpose:** Database access and ORM
- **Location:** `src/lib/db.ts`, `prisma/schema.prisma`
- **Contains:** Prisma client singleton, schema definitions
- **Depends on:** PostgreSQL (Supabase)
- **Used by:** API routes, auth module

### State Layer
- **Purpose:** Client-side state management
- **Location:** `src/stores/`
- **Contains:** Zustand stores with persist middleware
- **Depends on:** zustand package
- **Used by:** React components via hooks

## Data Flow

### Authentication Flow

1. User submits credentials to `POST /api/auth/login`
2. Server validates credentials, generates PASETO token
3. Token stored in `auth_token` HTTP-only cookie (7-day expiry)
4. Middleware intercepts protected routes, verifies token
5. User info injected into request headers for downstream use

```
[Login Form] -> [POST /api/auth/login] -> [PASETO Token]
                                              |
                                              v
[Protected Page Request] -> [Middleware] -> [Token Verify]
                                              |
                                              v
                                    [x-user-id, x-user-role headers]
                                              |
                                              v
                                      [Page/API Handler]
```

### Page Request Flow

1. Request reaches `src/middleware.ts`
2. Middleware checks route against `protectedRoutes` config
3. If protected, verify PASETO token from cookie
4. Check token against blacklist (revoked tokens)
5. Verify user role matches required roles
6. Add user info to headers, continue to page handler

### Client-Side State Flow

1. `SessionProvider` wraps app at root layout
2. On mount, calls `GET /api/auth/me` to hydrate user state
3. Zustand store persists auth state to localStorage
4. Components access via `useAuth()` hook

## Data Models

### Core Models (Prisma)

**User:**
- Primary entity with role-based access (CUSTOMER, OWNER, ADMIN)
- Relations: Address[], Visit[], UserBadge[], Booking[], Bordell[], Review[], Invoice[]
- Auth fields: password (optional for OAuth), googleId, emailVerified

**Bordell (Establishment):**
- Business entity with type (LAUFHAUS, BORDELL, FKK, STUDIO, PRIVAT)
- Status: ACTIVE, INACTIVE, PENDING, SUSPENDED
- Premium features: premiumPlan, premiumExpiry, sponsored
- Relations: Owner (User), Visit[], Booking[], Review[]

**Booking:**
- Customer-to-Establishment reservation
- Status: PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
- Payment: PENDING, PAID, REFUNDED
- Relations: Customer (User), Bordell, Invoice

**Review:**
- Customer reviews for establishments
- Status: PENDING, APPROVED, REJECTED
- Owner response field: response, respondedAt

**Invoice:**
- Payment record linked to booking
- One-to-one with Booking

### Enums

```
UserRole: CUSTOMER, OWNER, ADMIN
BordellType: LAUFHAUS, BORDELL, FKK, STUDIO, PRIVAT
BordellStatus: ACTIVE, INACTIVE, PENDING, SUSPENDED
CustomerStatus: ACTIVE, INACTIVE, BANNED
BookingStatus: PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
PaymentStatus: PENDING, PAID, REFUNDED
ReviewStatus: PENDING, APPROVED, REJECTED
PremiumPlan: BASIC, PREMIUM, SPONSORED
```

## Authentication Flow

### PASETO Token System (Primary)

**Token Generation (`src/lib/auth/paseto.ts`):**
```typescript
// Ed25519 asymmetric key pair
const token = await V4.sign(payload, privateKey, {
  expiresIn: '7d',
  issuer: 'desiremap.de',
  audience: 'desiremap.de'
})
```

**Token Verification:**
- Extracted from `Authorization: Bearer` header or `auth_token` cookie
- Verified against public key
- JTI checked against blacklist

**Token Blacklist (`src/lib/auth/blacklist.ts`):**
- In-memory Set for MVP (resets on server restart)
- Production note: Should migrate to Redis with TTL

### Auth Guards (`src/lib/auth/guards.ts`)

```typescript
// Usage in API routes
import { requireAdmin, requireAuth, requireOwnerOrAdmin } from '@/lib/auth/guards'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  // auth.user available here
}
```

### Route Protection (`src/middleware.ts`)

**Protected Routes:**
- `/admin/*` -> requires `admin` role
- `/dashboard/*` -> requires authenticated (any role)
- `/owner/*` -> requires `owner` or `admin` role

**Auth Routes:**
- `/login`, `/register` -> redirects to dashboard if already authenticated

### Google OAuth (`src/lib/auth/oauth/google.ts`)

1. User redirected to `/api/auth/google`
2. Generates OAuth state, redirects to Google consent
3. Callback at `/api/auth/google/callback`
4. Exchanges code for Google user info
5. Creates/updates user, generates PASETO token

## Key Architectural Decisions

### 1. Dual Auth System
**Decision:** Maintain PASETO as primary auth with NextAuth.js legacy support
**Rationale:** Migration path for existing sessions, OAuth compatibility
**Files:** `src/lib/auth/paseto.ts`, `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`

### 2. Locale-First Routing
**Decision:** All pages under `[locale]` segment with 4 supported locales
**Rationale:** SEO optimization, German market focus (default: de)
**Files:** `src/app/[locale]/layout.tsx`, `src/middleware.ts`

### 3. In-Memory Token Blacklist
**Decision:** Use Set<string> for MVP, document Redis migration path
**Rationale:** Simplicity for development, clear production upgrade path
**Files:** `src/lib/auth/blacklist.ts`

### 4. Centralized API Client
**Decision:** Single `api.ts` file with typed functions per domain
**Rationale:** Consistency, easier mocking, type safety
**Files:** `src/lib/api.ts`

### 5. Client Component Home Page
**Decision:** `src/app/[locale]/page.tsx` is a client component with view state
**Rationale:** SPA-like navigation without full page reloads
**Files:** `src/app/[locale]/page.tsx`

### 6. Prisma Singleton Pattern
**Decision:** Global Prisma client to prevent multiple instances in dev
**Rationale:** Hot reload creates new PrismaClient, exhausting connections
**Files:** `src/lib/db.ts`

### 7. Standalone Build Output
**Decision:** Build with `output: 'standalone'` for Docker deployment
**Rationale:** Smaller deployment footprint, self-contained
**Files:** `package.json` build script

## Cross-Cutting Concerns

### Logging
- **Server:** Console logging in API routes (production: integrate external service)
- **Client:** Development console, Toaster for user feedback

### Validation
- **API:** Zod schemas for request body validation
- **Forms:** react-hook-form with @hookform/resolvers

### Error Handling
- **API Routes:** Try-catch with JSON error responses
- **Auth Guards:** Standardized error objects with status codes
- **Client:** Error boundaries, toast notifications

### Internationalization
- **Framework:** next-intl with server-side message loading
- **RTL Support:** Arabic locale uses `dir="rtl"` in layout
- **Files:** `src/app/[locale]/layout.tsx`

### SEO
- **Structured Data:** `src/lib/structuredData.ts` generates JSON-LD
- **Sitemap:** Dynamic generation via `src/app/sitemap.ts`
- **Robots:** `src/app/robots.ts`
- **Meta:** Per-page metadata via `generateMetadata`

## Entry Points

### Web Application
- **Location:** `src/app/[locale]/page.tsx`
- **Triggers:** HTTP request to `/`, `/de`, `/en`, `/tr`, `/ar`
- **Responsibilities:** Renders home page with view routing

### API Endpoints
- **Location:** `src/app/api/*/route.ts`
- **Triggers:** HTTP requests to `/api/*`
- **Responsibilities:** RESTful CRUD operations

### Middleware
- **Location:** `src/middleware.ts`
- **Triggers:** All requests except static assets
- **Responsibilities:** Auth verification, role-based access control

---

*Architecture analysis: 2026-03-08*
