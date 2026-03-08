# CLAUDE.md

## Mandatory LSP Bootstrap (Run First)
- Load and follow `/Users/admin/.claude/lsp-commands.md` at the very start of every task.
- Execute the startup sequence in that file before any grep/glob-based code discovery.
- Keep LSP/symbolic commands as the default path for discovery, references, and edits.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A marketplace app for adult entertainment establishments in Germany.

## Tech Stack
- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State**: Zustand + TanStack Query
- **Database**: Prisma ORM with PostgreSQL (Supabase)
- **i18n**: next-intl (locales: de, en, ar, tr - default: de)
- **Auth**: Custom PASETO v4 tokens + Google OAuth (NextAuth.js legacy support)
- **Package Manager**: Bun

## Commands
```bash
bun dev          # Start development server (port 3000)
bun build        # Production build (standalone output)
bun start        # Start production server
bun lint         # Run ESLint
bun db:push      # Push Prisma schema to database
bun db:generate  # Generate Prisma client
bun db:migrate   # Run database migrations
bun db:reset     # Reset database
```

**Note**: No test framework is currently configured in this project.

## Environment Setup
Required environment variables (see `.env.example`):
```bash
# Database (Supabase PostgreSQL)
# Pooler connection (serverless/Vercel):
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
# Direct connection (migrations):
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# PASETO v4 (Ed25519 key pair - base64 encoded, without PEM headers)
# Generate with: node -e "const { generateKeyPairSync } = require('crypto'); const { publicKey, privateKey } = generateKeyPairSync('ed25519'); console.log('PUBLIC_KEY=' + publicKey.export({ type: 'spki', format: 'pem' }).replace(/-----[^-]+-----/g, '').replace(/\n/g, '')); console.log('PRIVATE_KEY=' + privateKey.export({ type: 'pkcs8', format: 'pem' }).replace(/-----[^-]+-----/g, '').replace(/\n/g, ''));"
PASETO_PUBLIC_KEY=""
PASETO_PRIVATE_KEY=""

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

To initialize the database and seed demo data:
```bash
bun db:push && curl -X POST http://localhost:3000/api/seed
```

Test users after seeding (see `TEST_USERS.md`):
- Admin: `admin@desiremap.de` / `admin123`
- Customer: `max@example.com` / `password123`

## Architecture

### Key Patterns

**Locale Routing**: All pages under `[locale]` segment. Access translations via `useTranslations()` hook from `next-intl`. Arabic locale uses RTL layout (handled in `src/app/[locale]/layout.tsx`).

**Authentication** (Dual System):
- **Primary**: Custom PASETO v4 tokens (Ed25519) stored in `auth_token` cookie. 7-day expiry. Token blacklist for logout/revocation in `src/lib/auth/blacklist.ts`.
- **OAuth**: Google OAuth flow in `src/lib/auth/oauth/google.ts` with callback handling.
- **Legacy**: NextAuth.js configured in `src/lib/auth.ts` for backward compatibility.
- **Middleware**: Route protection via `src/middleware.ts` using PASETO verification. Role-based access (`customer`, `owner`, `admin`) enforced at middleware level.
- **Password Hashing**: bcryptjs for credentials-based auth.

**API Client**: Centralized in `src/lib/api.ts` with typed functions for auth, customer, booking, establishments, and admin operations.

**State Management**: Zustand stores in `src/stores/` with persist middleware for auth state. TanStack Query via `useQueries` hook for server state.

**Form Handling**: react-hook-form with zod validation via `@hookform/resolvers`.

**Database Models** (Prisma):
- `User` → `Address`, `Visit`, `UserBadge`, `Booking` (customer), `Bordell` (owner), `Review`, `Invoice`
- `Bordell` → `Visit`, `Booking`, `Review`
- Core enums: `UserRole`, `BordellType`, `BordellStatus`, `CustomerStatus`, `BookingStatus`, `PaymentStatus`, `ReviewStatus`, `PremiumPlan`

**Path Alias**: Use `@/*` for imports (e.g., `@/components/ui/button`).

**Protected Routes** (configured in middleware):
- `/admin/*` → requires `admin` role
- `/dashboard/*` → requires authenticated user (any role)
- `/owner/*` → requires `owner` or `admin` role

### Auth Module Structure (`src/lib/auth/`)
```
auth/
├── index.ts      # Main auth utilities
├── paseto.ts     # PASETO token generation/verification (7-day expiry)
├── password.ts   # Password hashing (bcrypt)
├── blacklist.ts  # Token revocation tracking
├── guards.ts     # Route protection helpers
└── oauth/
    └── google.ts # Google OAuth flow
```

### API Routes Structure (`src/app/api/`)
```
api/
├── auth/
│   ├── [...nextauth]/route.ts  # Legacy NextAuth handler
│   ├── login/route.ts          # PASETO login
│   ├── logout/route.ts         # Token blacklist
│   ├── me/route.ts             # Current user info
│   ├── config/route.ts         # Auth configuration
│   └── google/                 # Google OAuth flow (route.ts + callback/route.ts)
├── register/route.ts           # User registration
├── customer/                   # Profile, visits, addresses, badges, bookings
├── bookings/                   # Booking CRUD
├── establishments/route.ts     # Public search
├── admin/                      # Stats, establishments, customers, bookings, reviews
└── seed/route.ts               # Database seeding
```

### Component Structure (`src/components/`)
```
components/
├── ui/           # shadcn/ui primitives (button, dialog, form, etc.)
├── layout/       # Header, Footer, MobileMenu, LanguageSelector
├── pages/        # Page-level components (HomePage, DashboardPage, AdminPanel, LoginPage, RegisterPage)
├── home/         # Home page sections (HeroSection, CategoriesSection, FeaturedCities, PromoSections)
├── listings/     # Listing components (ListingCard, ListingsSection, ReservationModal)
├── dashboard/    # Dashboard components (DashboardSidebar, DashboardTabs)
└── providers/    # Context providers (QueryProvider, SessionProvider)
```

## Guidelines

### Code Navigation (ALWAYS use LSP/Serena)
**Prefer LSP-based tools over grep for code exploration:**

**LSP Tool Operations:**
- `goToDefinition` - Jump to symbol definition
- `findReferences` - Find all usages
- `hover` - Get type info and docs
- `documentSymbol` - List symbols in a file
- `workspaceSymbol` - Search symbols project-wide
- `goToImplementation` - Find implementations
- `incomingCalls` / `outgoingCalls` - Call hierarchy

**Serena MCP (LSP-backed):**
- `find_symbol` - Find and read symbol bodies
- `get_symbols_overview` - File structure overview
- `find_referencing_symbols` - Find where symbols are used
- `replace_symbol_body` - Edit symbol definitions
- `insert_before_symbol` / `insert_after_symbol` - Add code

**Only use Grep/Glob for:**
- String/text searches in code
- File name patterns
- Non-code files (config, markdown, etc.)

### Skills Reference
- [Frontend Design](.agent/skills/frontend-design/SKILL.md) - UI component patterns
- [Maestro](.agent/skills/maestro/SKILL.md) - Complex algorithms
- [Web Guidelines](.agent/skills/web-design-guidelines/SKILL.md) - Best practices
- [Next.js Best Practices](.agent/skills/next-best-practices/SKILL.md)
- [SEO Audit](.agent/skills/seo-audit/SKILL.md) / [Next.js SEO](.agent/skills/nextjs-seo/SKILL.md)
- [Debugging](.agent/skills/systematic-debugging/SKILL.md)
- [Refactoring](.agent/skills/component-refactoring/SKILL.md)
- [TDD](.agent/skills/test-driven-development/SKILL.md)
