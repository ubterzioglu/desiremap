# AGENTS.md

## Mandatory LSP Bootstrap (Run First)
- Load and follow `/Users/admin/.claude/lsp-commands.md` at the very start of every task.
- Execute the startup sequence in that file before any grep/glob-based code discovery.
- Keep LSP/symbolic commands as the default path for discovery, references, and edits.

This file is for agentic coding assistants operating in this repository.

## Project Snapshot
- **App type**: Next.js marketplace app (Germany-focused domain content).
- **Framework**: Next.js 16 App Router + React 19 + TypeScript.
- **Runtime**: Bun package manager/runtime.
- **Styling**: Tailwind CSS v4 + shadcn/ui style components.
- **State**: Zustand + TanStack Query.
- **Data**: Prisma ORM (`@prisma/client`, `prisma/` schema + migrations).
- **Auth**: NextAuth.js + PASETO tokens.
- **i18n**: `next-intl` with locale routing (de, en, ar, tr; default: de).

## Repository Rules Source Check
- `.cursor/rules/`: not found.
- `.cursorrules`: not found.
- `.github/copilot-instructions.md`: not found.
- If these files are added later, treat them as higher-priority behavioral rules.

## Core Commands

### Setup / Installation
```bash
bun install
```

### Development
```bash
bun run dev        # Start Next dev server on port 3000 (logs to dev.log)
bun run build      # Production build: runs prisma generate first, builds standalone
bun run start      # Start production server from .next/standalone/server.js
```

### Lint
```bash
bun run lint       # Uses eslint.config.mjs (flat config with @typescript-eslint rules)
```

### Database (Prisma)
```bash
bun run db:generate   # Generate Prisma client
bun run db:push       # Push schema to database
bun run db:migrate    # Run migrations
bun run db:reset      # Reset database
```

### Tests
Tests use Bun's built-in test runner with `bun:test`. Test files use `.test.ts` extension.

```bash
bun test                        # Run all tests
bun test path/to/file.test.ts   # Run single test file
bun test -t "should create"     # Run tests matching pattern
```

Example test structure:
```typescript
import { describe, expect, test } from 'bun:test'
import { functionName } from './module'

describe('feature description', () => {
  test('should do something specific', () => {
    const result = functionName(input)
    expect(result).toBe(expected)
  })
})
```

## Codebase Layout

```
src/
├── app/
│   ├── [locale]/           # Locale routing (de, en, ar, tr)
│   │   ├── page.tsx        # Homepage
│   │   ├── layout.tsx      # Locale layout with metadata
│   │   └── search/         # Search page
│   ├── api/                # API route handlers
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt
├── components/
│   ├── ui/                 # shadcn/ui primitives (lint-ignored)
│   ├── home/               # Homepage sections (Hero, Categories, Cities, Promo)
│   ├── layout/             # Header, Footer, LanguageSelector, MobileMenu
│   ├── listings/           # ListingCard, ListingsSection, ReservationModal
│   └── pages/              # Admin, Dashboard, City, Detail, Login pages
├── hooks/                  # Custom hooks (use-mobile, use-toast, useScrollHeader)
├── lib/                    # Utilities (utils, db, api, structuredData, auth, seo)
├── stores/                 # Zustand stores (authStore, adminStore, bookingStore)
├── types/                  # TypeScript types (index.ts, admin.ts)
├── i18n/                   # next-intl configuration
└── data/                   # Mock data
messages/                   # Translation files (de.json, en.json, ar.json, tr.json)
prisma/                     # Database schema and migrations
```

## TypeScript Conventions
- `strict: true` enabled; keep types explicit for public interfaces and API payloads.
- Path alias: `@/*` maps to `./src/*` (use for all internal imports).
- Import order:
  1. framework/library imports (`next`, `react`)
  2. third-party packages
  3. `@/` internal imports
  4. relative imports
- Prefer type-only imports: `import type { ... } from '...'`
- Use interfaces for object shapes, type for unions/primitives.

## Formatting & Style
- **Single quotes**, no semicolons, trailing commas optional, concise arrow functions.
- **Do not reformat unrelated files in broad sweeps.**
- Match existing style in touched files before enforcing new style.

## ESLint Reality (What's Enforced)
- Many strict rules disabled (including `no-explicit-any`, `no-unused-vars`, `prefer-const`).
- **Warning-level rules (guide refactors, don't block):**
  - `max-lines`: 400
  - `max-lines-per-function`: 150
  - `complexity`: 15
  - `max-statements`: 40
  - `max-depth`: 3
- **Ignored:** `src/components/ui/**`

## Naming Conventions
| Type | Convention | Examples |
|------|------------|----------|
| Components | PascalCase | `LoginPage`, `DashboardTabs`, `ListingCard` |
| Hooks | camelCase with `use` prefix | `useScrollHeader`, `useToast`, `useQueries` |
| Stores | camelCase | `authStore`, `adminStore`, `bookingStore` |
| Utility functions | camelCase | `apiCall`, `generateToken`, `formatDate` |
| API modules | camelCase | `authApi`, `customerApi`, `bookingApi`, `adminApi` |
| Route handlers | uppercase HTTP exports | `GET`, `POST`, `PUT`, `DELETE` |
| Constants | UPPER_SNAKE_CASE (true constants only) | `MAX_RETRY_COUNT`, otherwise camelCase |
| Types/Interfaces | PascalCase | `Bordell`, `Customer`, `Booking` |
| Enums | PascalCase with enum values as lowercase | `BordellType`, `BookingStatus` |

## API & Error Handling Patterns
API handlers follow this pattern:
```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ field: z.string() })

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json())
    const result = await someOperation(body)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

Client API wrapper (`src/lib/api.ts`) throws `Error` on non-OK response.
Error shape: `{ error: string, ...details }`. Do not swallow errors silently.

## React/Next.js Patterns
- Respect client/server boundaries: client components use `'use client'` when using hooks/browser APIs.
- Server route logic remains in `src/app/api`.
- Use `next-intl` patterns for locale-aware rendering.
- Locale routing via `[locale]` dynamic segment.
- Avoid adding global state when local state/context is sufficient.

## Agent Workflow Expectations
1. **Before edits**: Inspect nearby files and follow local conventions.
2. **Discovery**: Prefer LSP/symbolic tools over plain text search.
3. **After edits**: Run targeted checks first, then broader checks.
4. **Minimum verification**:
   - `bun run lint`
   - `bun run build` (for route/type/runtime safety)
   - `bun test` if tests exist
5. **Do not claim tests passed unless commands were actually executed.**

## Key Files Reference
- `src/lib/api.ts`: Reusable `apiCall` wrapper + `authApi`, `customerApi`, `bookingApi`, `establishmentsApi`, `adminApi`, `seedApi`
- `src/lib/db.ts`: Prisma client singleton
- `src/lib/auth.ts`: Authentication utilities
- `src/types/index.ts`: Core business types (Bordell, Customer, Booking, Review, Badge)
- `src/types/admin.ts`: Admin-specific types (Invoice, DashboardUser, Activity)
- `src/middleware.ts`: Locale detection and routing
