# DesireMap — Frontend Only

## Purpose
Marketplace app for adult entertainment establishments in Germany.

## Tech Stack
- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State**: Zustand + TanStack Query
- **i18n**: next-intl (locales: de, en, ar, tr — default: de)
- **Package Manager**: Bun

## Backend (External — NOT in this repo)
- **Repo**: https://github.com/ozbakirsahincan/desiremap_core_backend (managed by colleague)
- **API**: https://api.desiremap.de
- **Stack**: NestJS 11, TypeORM, PostgreSQL, Liquibase
- Local clone at `desiremap_core_backend/` for read-only analysis

## Key Architecture Points
- All pages use `[locale]` dynamic segment for i18n routing
- Path alias: `@/*` maps to `./src/*`
- SEO: Dynamic sitemap/robots in `src/app/`, JSON-LD structured data via `src/lib/structuredData.ts`
- Two API clients: `src/lib/api.ts` (public/admin) + `src/lib/backend-client.ts` (operator/member)
- Auth: Client-side Zustand store with localStorage persistence
- No backend code, no database, no Prisma in this repo
