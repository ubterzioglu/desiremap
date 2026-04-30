# Suggested Commands — Frontend Only

## Development (run in `frontend/`)
```bash
bun dev            # Start development server (port 3000)
bun next build     # Production build (standalone output)
bun start          # Start production server
bun lint           # Run ESLint
```

## No Database Commands
There is no Prisma, no database, no migrations in this repo.
All data comes from external API at https://api.desiremap.de

## Task Completion Checklist
After completing a task:
1. Run `bun lint` to check for linting errors
2. Verify the build with `bun next build` if making significant changes
3. Check i18n keys are added to all locale files (de, en, ar, tr)
