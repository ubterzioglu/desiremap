# Task Completion Checklist

## After Code Changes
1. Run `bun lint` to check for linting errors
2. Fix any ESLint errors (file size, function size, complexity)
3. Verify TypeScript compilation (no implicit any errors in new code)

## After Schema Changes
1. Run `bun db:generate` to generate Prisma client
2. Run `bun db:push` to sync schema with database
3. Run `bun db:migrate` for production migrations

## Before Committing
1. Ensure `bun lint` passes
2. Test with `bun dev` if needed
3. Check i18n keys are added to all locale files (de, en, ar, tr)

## Guidelines Available
- `.agent/skills/frontend-design/SKILL.md` - UI design patterns
- `.agent/skills/next-best-practices/SKILL.md` - Next.js best practices
- `.agent/skills/seo-audit/SKILL.md` - SEO optimization
- `.agent/skills/systematic-debugging/SKILL.md` - Debugging approach
- `.agent/skills/component-refactoring/SKILL.md` - Code refactoring
