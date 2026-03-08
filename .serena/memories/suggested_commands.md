# Suggested Commands

## Development
```bash
bun dev          # Start development server (port 3000)
bun build        # Production build (standalone output)
bun start        # Start production server
bun lint         # Run ESLint
```

## Database
```bash
bun db:push      # Push Prisma schema to database
bun db:generate  # Generate Prisma client
bun db:migrate   # Run database migrations
bun db:reset     # Reset database
```

## System Utilities (Darwin/macOS)
```bash
git status       # Check git status
git diff         # View changes
ls -la           # List files with details
find . -name "*.tsx"  # Find files by name
grep -r "pattern" src/  # Search in files
```

## Task Completion Checklist
After completing a task:
1. Run `bun lint` to check for linting errors
2. Verify the build with `bun build` if making significant changes
3. Run database commands if schema changed
