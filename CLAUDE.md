# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A marketplace app for brothels in Germany.

## Tech Stack
- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State**: Zustand + TanStack Query
- **Database**: Prisma ORM with SQLite
- **i18n**: next-intl (locales: de, en, ar, tr - default: de)
- **Auth**: NextAuth.js
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

## Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Locale-based routing (de, en, ar, tr)
│   │   ├── page.tsx       # Homepage
│   │   ├── layout.tsx     # Locale layout with metadata
│   │   └── search/        # Search page
│   ├── api/               # API routes
│   ├── sitemap.ts         # Dynamic sitemap generation
│   └── robots.ts          # Robots.txt generation
├── components/
│   ├── ui/                # shadcn/ui components (50+ components)
│   ├── home/              # Homepage sections (Hero, Categories, Cities, Promo)
│   ├── layout/            # Header, Footer, LanguageSelector, MobileMenu
│   ├── listings/          # ListingCard, ListingsSection, ReservationModal
│   └── pages/             # Admin, Dashboard, City, Detail, Login pages
├── hooks/                 # Custom hooks (use-mobile, use-toast, useScrollHeader)
├── lib/                   # Utilities (utils, db, search, structuredData)
├── types/                 # TypeScript types (Bordell, Customer, Booking, etc.)
├── i18n/                  # next-intl configuration
└── data/                  # Mock data
messages/                  # Translation files (de.json, en.json, ar.json, tr.json)
prisma/                    # Database schema
```

### Key Patterns

**Locale Routing**: All pages use `[locale]` dynamic segment. Access translations via `useTranslations()` hook.

**SEO**: Dynamic sitemap/robots in `src/app/`. JSON-LD structured data via `src/lib/structuredData.ts`.

**Types**: Core business types in `src/types/index.ts`: `Bordell`, `Customer`, `Booking`, `Review`, `Badge`.

**Path Alias**: Use `@/*` for imports (e.g., `@/components/ui/button`).

## Guidelines
- [Write Frontend](.agent/skills/frontend-design/SKILL.md)
- [Complex Algorithm](.agent/skills/maestro/SKILL.md)
- [Best Practice](.agent/skills/web-design-guidelines/SKILL.md)
- [Next Best Practices](.agent/skills/next-best-practices/SKILL.md)
- [SEO Audit](.agent/skills/seo-audit/SKILL.md)
- [Next.js SEO](.agent/skills/nextjs-seo/SKILL.md)
- [Debugging](.agent/skills/systematic-debugging/SKILL.md)
- [Refactoring](.agent/skills/component-refactoring/SKILL.md)
- [Test](.agent/skills/test-driven-development/SKILL.md)
