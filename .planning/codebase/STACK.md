# Stack: DesireMap

**Analyzed:** 2026-03-08
**Type:** Brownfield

## Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | ^16.1.1 | Full-stack React framework with App Router |
| React | ^19.0.0 | UI library |
| TypeScript | ^5 | Type-safe JavaScript |
| Node.js/Bun | Bun runtime | JavaScript runtime and package manager |

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@prisma/client` | ^6.11.1 | Database ORM |
| `paseto` | ^3.1.4 | PASETO v4 authentication tokens (Ed25519) |
| `next-auth` | ^4.24.11 | Legacy OAuth support (backward compatibility) |
| `next-intl` | ^4.3.4 | Internationalization (de, en, ar, tr) |
| `zustand` | ^5.0.6 | Client-side state management |
| `@tanstack/react-query` | ^5.82.0 | Server state management and caching |
| `@tanstack/react-table` | ^8.21.3 | Data tables |
| `zod` | ^4.0.2 | Schema validation |
| `react-hook-form` | ^7.60.0 | Form handling |
| `@hookform/resolvers` | ^5.1.1 | Zod integration for forms |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `framer-motion` | ^12.23.2 | Animation library |
| `lucide-react` | ^0.525.0 | Icon library |
| `date-fns` | ^4.1.0 | Date manipulation |
| `recharts` | ^2.15.4 | Charts and data visualization |
| `socket.io` / `socket.io-client` | ^4.8.3 | Real-time communication |
| `sharp` | ^0.34.3 | Image optimization |

## Database

**Provider:** PostgreSQL via Supabase

**ORM:** Prisma (^6.11.1)
- Config: `prisma/schema.prisma`
- Client export: `src/lib/db.ts`
- Connection modes:
  - Pooler: `DATABASE_URL` (serverless/Vercel)
  - Direct: `DIRECT_URL` (migrations)

**Models:**
- `User` - Core user entity with roles (CUSTOMER, OWNER, ADMIN)
- `Address` - User addresses
- `Visit` - Customer visit records
- `Badge` / `UserBadge` - Gamification badges
- `Bordell` - Establishment listings
- `Booking` - Reservations
- `Review` - Customer reviews
- `Invoice` - Payment records

**Enums:** `UserRole`, `BordellType`, `BordellStatus`, `CustomerStatus`, `BookingStatus`, `PaymentStatus`, `ReviewStatus`, `PremiumPlan`

## Authentication

**Primary:** Custom PASETO v4 tokens
- Implementation: `src/lib/auth/paseto.ts`
- Algorithm: Ed25519 asymmetric keys
- Expiry: 7 days
- Storage: `auth_token` httpOnly cookie
- Token blacklist: `src/lib/auth/blacklist.ts` for logout/revocation

**OAuth:** Google OAuth
- Implementation: `src/lib/auth/oauth/google.ts`
- Flow: `/api/auth/google` -> callback

**Legacy:** NextAuth.js (`src/lib/auth.ts`)
- Configured for backward compatibility only

**Password Hashing:** bcryptjs
- Implementation: `src/lib/auth/password.ts`

**Route Protection:** Middleware (`src/middleware.ts`)
- PASETO verification on protected routes
- Role-based access control
- Protected routes:
  - `/admin/*` - ADMIN role
  - `/dashboard/*` - Any authenticated user
  - `/owner/*` - OWNER or ADMIN role

## State Management

**Client State:** Zustand (`src/stores/`)
- `authStore.ts` - Authentication state with persist middleware
- `bookingStore.ts` - Booking state
- `adminStore.ts` - Admin panel state
- Persist config: `auth-storage` localStorage key

**Server State:** TanStack Query
- Configured via `QueryProvider` in `src/components/providers/`
- Used for API data fetching and caching

**API Client:** Centralized in `src/lib/api.ts`
- Typed functions for auth, customer, booking, establishments, admin operations
- Base path: `/api`

## Styling

**Framework:** Tailwind CSS 4
- Config: `tailwind.config.ts`
- Dark mode: class-based
- Custom theme with CSS variables (HSL colors)

**Component Library:** shadcn/ui (Radix primitives)
- Extensive Radix UI components installed
- Location: `src/components/ui/`
- Key components: button, dialog, form, select, tabs, toast, etc.

**Animation:**
- `tailwindcss-animate` plugin
- `framer-motion` for complex animations

**Theming:** `next-themes` for dark mode support

**Utility Libraries:**
- `class-variance-authority` (CVA) - Variant styling
- `clsx` + `tailwind-merge` - Class composition

## Internationalization

**Library:** next-intl (^4.3.4)

**Configuration:**
- Routing: `src/i18n/routing.ts`
- Request handler: `src/i18n/request.ts`
- Locales: `de` (default), `en`, `ar`, `tr`
- Plugin integration: `next.config.ts`
- RTL support: Arabic locale handled in `src/app/[locale]/layout.tsx`

## Build & Dev Tools

**Package Manager:** Bun
- Lockfile: `bun.lockb`

**Scripts:**
```bash
bun dev          # Development server (port 3000)
bun build        # Production build (standalone output)
bun start        # Production server
bun lint         # ESLint
bun db:push      # Push Prisma schema
bun db:generate  # Generate Prisma client
bun db:migrate   # Run migrations
bun db:reset     # Reset database
```

**Build Output:** Standalone (for containerized deployment)

**Linting:** ESLint 9 with `eslint-config-next`

**TypeScript Config:**
- Target: ES2017
- Module: esnext with bundler resolution
- Path alias: `@/*` -> `./src/*`
- Strict mode enabled (with `noImplicitAny: false`)

## Environment Configuration

**Required Variables:**
- `DATABASE_URL` - Supabase pooler connection
- `DIRECT_URL` - Supabase direct connection
- `PASETO_PUBLIC_KEY` - Ed25519 public key (base64)
- `PASETO_PRIVATE_KEY` - Ed25519 private key (base64)
- `GOOGLE_CLIENT_ID` - Google OAuth (optional)
- `GOOGLE_CLIENT_SECRET` - Google OAuth (optional)
- `GOOGLE_REDIRECT_URI` - OAuth callback URL

**Config Files:**
- `.env` - Local secrets (gitignored)
- `.env.example` - Template with structure

## Platform & Deployment

**Target:** Vercel / Containerized hosting

**Database:** Supabase PostgreSQL
- Region-aware pooler connections
- Direct connections for migrations

**Real-time:** Socket.io for live features

---

*Stack analysis: 2026-03-08*
