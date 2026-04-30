# Code Style and Conventions — Frontend Only

## File Size Limits (ESLint enforced)
- **Max file lines**: 200 (skip blank lines and comments)
- **Max function lines**: 80 (skip blank lines and comments)
- **Max complexity**: 8 (warning)
- **Max statements**: 40 (warning)
- **Max nesting depth**: 3 (warning)

## TypeScript
- Strict mode enabled
- `noImplicitAny`: false (relaxed)
- Path alias: `@/*` for imports (e.g., `@/components/ui/button`)

## React/Next.js Patterns
- Use `"use client"` directive for client components
- Server Components by default
- Use `useTranslations()` hook for i18n
- Locale routing via `[locale]` dynamic segment

## i18n
- Locales: de (default), en, ar, tr
- Translation files in `messages/` directory
- Use `next-intl` for all user-facing text

## Ignored Directories (ESLint)
- node_modules, .next, out, build
- src/components/ui (shadcn components)
- .agent, .claude, .cline, .factory, .kilocode, .agents

## Naming Conventions
- Components: PascalCase (e.g., `ListingCard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useToast`)
- Utilities: camelCase

## No Backend Conventions
No Prisma, no TypeORM, no NestJS patterns in this repo.
