# DesireMap Backend Architecture

## Overview

DesireMap is a Germany-focused marketplace application built with Next.js 16 App Router. The backend follows a layered architecture with API routes as the primary interface, Prisma ORM for database access, and a dual authentication system (NextAuth.js for session + PASETO for API tokens).

---

## 1. Database Layer

### Technology
- **PostgreSQL** via Prisma ORM
- Schema-first development with `prisma/schema.prisma`
- Singleton Prisma client pattern for connection pooling

### Prisma Client Pattern
```typescript
// src/lib/db.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],  // SQL query logging in dev
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### Data Models

```
User (CUSTOMER | OWNER | ADMIN)
├── Address (user addresses)
├── Visit (historical visits)
├── Booking (as customer)
├── Review (customer reviews)
├── UserBadge (gamification)
├── Invoice (payments)
└── Bordell (as owner)

Bordell
├── Visit
├── Booking
└── Review

Badge ← UserBadge

Booking → Invoice
```

### Enums
| Enum | Values |
|-------|--------|
| UserRole | CUSTOMER, OWNER, ADMIN |
| BordellType | LAUFHAUS, BORDELL, FKK, STUDIO, PRIVAT |
| BordellStatus | ACTIVE, INACTIVE, PENDING, SUSPENDED |
| CustomerStatus | ACTIVE, INACTIVE, BANNED |
| BookingStatus | PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW |
| PaymentStatus | PENDING, PAID, REFUNDED |
| ReviewStatus | PENDING, APPROVED, REJECTED |
| PremiumPlan | BASIC, PREMIUM, SPONSORED |

### JSON Fields
Bordell stores arrays as JSON strings:
- `services` - Array of service names
- `images` - Array of image URLs  
- `availableSlots` - Array of time slots

---

## 2. Authentication System

### Dual Strategy

The application uses two separate authentication mechanisms:

1. **NextAuth.js** - Session-based authentication for web UI
2. **PASETO Tokens** - Stateless API authentication

### PASETO Implementation

Located in `src/lib/auth/paseto.ts`:

```typescript
interface TokenPayload {
  sub: string      // User ID
  role: string     // customer | owner | admin
  email: string    // User email
  jti?: string     // Unique token ID (auto-generated)
}

interface DecodedToken extends TokenPayload {
  jti: string
  iat: string      // Issued at
  exp: string      // Expiration
}
```

**Security Features:**
- Ed25519 asymmetric key pair from env vars
- 7-day token expiry
- JTI (JWT ID) for token revocation
- Audience/Issuer validation (`desiremap.de`)

**Token Extraction:**
```typescript
// Authorization header: "Bearer <token>"
// Cookie: "auth_token=<token>"
export function extractToken(request: Request): string | null
```

### Token Blacklist

Located in `src/lib/auth/blacklist.ts`:

- **MVP**: In-memory Set (resets on server restart)
- **Production**: Should use Redis with TTL

```typescript
const blacklist = new Set<string>()
export function revokeToken(jti: string): void
export function isRevoked(jti: string): boolean
```

### Auth Guards

Located in `src/lib/auth/guards.ts`:

```typescript
requireAuth(request)           // Returns AuthResult | AuthError
requireRole(request, ['admin']) // Role-based access
requireAdmin(request)          // Admin only
requireOwnerOrAdmin(request)    // Owner or Admin
```

Return type pattern:
```typescript
interface AuthResult {
  success: true
  user: DecodedToken
}

interface AuthError {
  success: false
  error: string
  status: number
}
```

### Password Hashing

Located in `src/lib/auth/password.ts`:

- **Algorithm**: bcrypt with cost factor 12
- **Validation**: 8-128 character passwords
- Timing-attack safe comparison

```typescript
export async function hash(password: string): Promise<string>
export async function verify(password: string, hash: string): Promise<boolean>
export async function needsRehash(hash: string): Promise<boolean>
```

### Google OAuth

Located in `src/lib/auth/oauth/google.ts`:

- **Protocol**: OAuth 2.0 with PKCE
- **Flow**: Authorization Code + PKCE
- **Scope**: `openid email profile`

```typescript
export function generateOAuthState(): OAuthState
export function getAuthUrl(state: OAuthState): string
export async function exchangeCode(code, codeVerifier): Promise<{ accessToken, refreshToken }>
export async function getUserInfo(accessToken): Promise<GoogleUser>
```

---

## 3. API Routes Structure

### Route Categories

```
/api/
├── auth/
│   ├── login/          POST   - Email/password login
│   ├── register/       POST   - User registration
│   ├── logout/         POST   - Revoke token
│   ├── me/             GET    - Current user (PASETO)
│   ├── config/         GET    - Auth configuration
│   ├── google/         GET    - OAuth redirect
│   ├── google/callback/       - OAuth callback
│   └── [...nextauth]/          - NextAuth handler
│
├── bookings/
│   ├── route.ts        POST   - Create booking
│   └── [id]/route.ts   GET/PUT/DELETE - Booking CRUD
│
├── establishments/     GET    - Public search (no auth)
│
├── admin/
│   ├── stats/          GET    - Dashboard statistics
│   ├── establishments/ GET/POST/PUT/DELETE
│   ├── customers/      GET/PUT/DELETE
│   ├── bookings/       GET/PUT
│   └── reviews/        GET/PUT/DELETE
│
├── customer/
│   ├── route.ts        GET/PUT - Profile
│   ├── bookings/       GET    - My bookings
│   ├── visits/         GET    - Visit history
│   ├── addresses/      GET/POST/PUT/DELETE
│   └── badges/          GET    - User badges
│
└── seed/              POST   - Database seeding (dev only)
```

### Common Route Patterns

**1. Admin Route Protection**
```typescript
async function checkAdminAccess() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'admin') {
    return null
  }
  return session
}
```

**2. Session-Based Auth**
```typescript
const session = await getServerSession(authOptions)
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

**3. Zod Validation**
```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8)
})

const result = schema.safeParse(body)
if (!result.success) {
  return NextResponse.json(
    { error: 'Invalid input', details: result.error.flatten() },
    { status: 400 }
  )
}
```

**4. Role-Based Access in PUT/DELETE**
```typescript
const isAdmin = session.user.role === 'admin'
const isOwner = booking.customerId === session.user.id

if (!isAdmin && !isOwner) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

## 4. Client API Layer

Located in `src/lib/api.ts`:

### Core Function
```typescript
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T>
```

### API Modules

| Module | Endpoints |
|--------|-----------|
| `authApi` | register |
| `customerApi` | getProfile, updateProfile, getVisits, getAddresses, createAddress, updateAddress, deleteAddress, getBadges, getBookings |
| `bookingApi` | create, getById, update, cancel |
| `establishmentsApi` | search (q, city, type, minPrice, maxPrice, limit, offset) |
| `adminApi` | getStats, getEstablishments, createEstablishment, updateEstablishment, deleteEstablishment, getCustomers, updateCustomer, deleteCustomer, getBookings, updateBooking, getReviews, updateReview, deleteReview |
| `seedApi` | seed |

---

## 5. State Management

### Zustand Stores

**authStore** (`src/stores/authStore.ts`)
```typescript
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user) => void
  setLoading: (isLoading) => void
  logout: () => void
}
```
- Persisted to localStorage via `persist` middleware
- Partial persist for `user` and `isAuthenticated` only

**adminStore** (`src/stores/adminStore.ts`)
```typescript
interface AdminState {
  activeTab: AdminTab
  stats: DashboardStats | null
  isLoading: boolean
  searchQuery: string
  setActiveTab: (tab) => void
  setStats: (stats) => void
  setLoading: (loading) => void
  setSearchQuery: (query) => void
}
```

**bookingStore** (`src/stores/bookingStore.ts`)
- Booking flow state management

---

## 6. Middleware

Located in `src/middleware.ts`:

### Route Protection Matrix

| Route Pattern | Required Role |
|---------------|---------------|
| `/de/admin`, `/en/admin`, etc. | ADMIN |
| `/de/dashboard`, etc. | Any authenticated (customer, owner, admin) |
| `/de/owner`, etc. | OWNER or ADMIN |

### Token Flow
1. Extract `auth_token` from cookie
2. Verify PASETO token
3. Check blacklist (JTI)
4. Validate role
5. Redirect authenticated users away from auth pages
6. Set headers: `x-user-id`, `x-user-role`, `x-user-email`

---

## 7. Response Patterns

### Success Response
```typescript
return NextResponse.json({ /* data */ }, { status: 201 })
```

### Error Responses
```typescript
// Validation error
{ error: 'Invalid input', details: result.error.flatten() }

// Not found
{ error: 'Resource not found' }

// Forbidden  
{ error: 'Forbidden' }

// Unauthorized
{ error: 'Unauthorized' }

// Server error
{ error: 'Internal server error' }
```

### Status Code Usage
| Code | Usage |
|------|-------|
| 200 | Successful GET/PUT |
| 201 | Resource created |
| 400 | Validation failed |
| 401 | Not authenticated |
| 403 | Not authorized / Banned |
| 404 | Resource not found |
| 500 | Server error |

---

## 8. Seed Data

Located in `src/lib/seedData.ts`:

### Seeded Entities
- **4 Badges**: Premium, Early Adopter, Active Member, Top Reviewer
- **1 Admin**: admin@desiremap.de / admin123
- **3 Customers**: max@example.com, anna@example.com, hans@example.com (password: password123)
- **6 Bordells**: FKK Oase, Laufhaus Wien, Studio Elite, Bordell Charlottenburg, FKK Artemis, Privat Club München
- **Visits, Bookings, Reviews**

### Protected in Production
```typescript
if (process.env.NODE_ENV === 'production') {
  return NextResponse.json({ error: 'Seeding not allowed in production' }, { status: 403 })
}
```

---

## 9. Business Logic Patterns

### Booking Creation
1. Validate session
2. Validate input (bordellId, date, time, duration, price)
3. Check bordell exists and is ACTIVE
4. Create booking with PENDING status
5. Increment bordell booking count

### Review Approval
When a review is approved:
1. Update review status to APPROVED
2. Recalculate bordell average rating
3. Update bordell reviewCount

```typescript
if (status === 'APPROVED') {
  const bordellReviews = await db.review.findMany({
    where: { bordellId: review.bordellId, status: 'APPROVED' },
    select: { rating: true }
  })
  const avgRating = bordellReviews.reduce((sum, r) => sum + r.rating, 0) / bordellReviews.length
  await db.bordell.update({
    where: { id: review.bordellId },
    data: { rating: Math.round(avgRating * 10) / 10, reviewCount: bordellReviews.length }
  })
}
```

### Admin Stats Aggregation
Dashboard stats (`/api/admin/stats`) computes:
- Establishment counts (total, active, pending)
- Customer counts (total, active)
- Booking counts (total, pending, completed)
- Total revenue from completed + paid bookings
- Monthly stats (last 6 months)
- Top 5 establishments by bookings
- Recent 10 activities

---

## 10. Environment Variables

### Required
```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

### PASETO
```env
PASETO_PRIVATE_KEY=base64_encoded_ed25519_private_key
PASETO_PUBLIC_KEY=base64_encoded_ed25519_public_key
```

### Google OAuth
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

---

## 11. Testing

Tests use Bun's built-in test runner:

```bash
bun test                           # All tests
bun test path/to/file.test.ts      # Single file
bun test -t "should create booking" # Pattern match
```

Example test file (`src/lib/seo/home.test.ts`):
```typescript
import { describe, expect, test } from 'bun:test'
import { getHomeSeoExperience } from './home'

describe('home SEO content model', () => {
  test('builds category and city routes', () => {
    const seo = getHomeSeoExperience('de')
    expect(seo.clusters).toHaveLength(4)
  })
})
```

---

## 12. Key Files Reference

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema |
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/auth.ts` | NextAuth configuration |
| `src/lib/auth/paseto.ts` | PASETO token service |
| `src/lib/auth/guards.ts` | Auth middleware functions |
| `src/lib/auth/password.ts` | bcrypt hashing |
| `src/lib/auth/oauth/google.ts` | Google OAuth |
| `src/lib/auth/blacklist.ts` | Token blacklist |
| `src/lib/api.ts` | Client API wrapper |
| `src/stores/*.ts` | Zustand stores |
| `src/middleware.ts` | Route protection |
| `src/lib/seedData.ts` | Database seeder |
