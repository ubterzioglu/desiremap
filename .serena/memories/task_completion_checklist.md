# Task Completion Checklist — Frontend Only

## After Code Changes
1. Run `bun lint` to check for linting errors
2. Fix any ESLint errors (file size, function size, complexity)
3. Verify TypeScript compilation with `bun next build`

## No Database Commands
There is no Prisma, no database, no migrations in this repo.
All data comes from external API at https://api.desiremap.de

## Before Committing
1. Ensure `bun lint` passes
2. Test with `bun dev` if needed
3. Check i18n keys are added to all locale files (de, en, ar, tr)

## Skills Available
- `.agents/skills/frontend-design/SKILL.md` - UI design patterns
- `.agents/skills/next-best-practices/SKILL.md` - Next.js best practices
- `.agents/skills/seo-audit/SKILL.md` - SEO optimization
- `.agents/skills/systematic-debugging/SKILL.md` - Debugging approach
- `.agents/skills/component-refactoring/SKILL.md` - Code refactoring
