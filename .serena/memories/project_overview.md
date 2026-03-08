# DesireMap - Project Overview

## Purpose
A marketplace app for brothels in Germany.

## Tech Stack
- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State**: Zustand + TanStack Query
- **Database**: Prisma ORM with SQLite
- **i18n**: next-intl (locales: de, en, ar, tr - default: de)
- **Auth**: NextAuth.js
- **Package Manager**: Bun

## Key Architecture Points
- All pages use `[locale]` dynamic segment for i18n routing
- Path alias: `@/*` maps to `./src/*`
- SEO: Dynamic sitemap/robots in `src/app/`, JSON-LD structured data via `src/lib/structuredData.ts`
- Core business types in `src/types/index.ts`: Bordell, Customer, Booking, Review, Badge
