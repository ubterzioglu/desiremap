# AGENTS.md

## Mandatory LSP Bootstrap (Run First)
- Load and follow `/Users/admin/.claude/lsp-commands.md` at the very start of every task.
- Execute the startup sequence in that file before any grep/glob-based code discovery.
- Keep LSP/symbolic commands as the default path for discovery, references, and edits.

This file is for agentic coding assistants operating in this repository.

## Project Snapshot
- App type: Next.js marketplace app (Germany-focused domain content).
- Framework: Next.js App Router + React 19 + TypeScript.
- Runtime/tooling: Bun package manager/runtime.
- Styling: Tailwind CSS v4 + shadcn/ui style components.
- Data: Prisma ORM (`@prisma/client`, `prisma/` schema + migrations).
- i18n: `next-intl` with locale routing and messages.

## Repository Rules Source Check
- `.cursor/rules/`: not found.
- `.cursorrules`: not found.
- `.github/copilot-instructions.md`: not found.
- If these files are added later, treat them as higher-priority behavioral rules.

## Core Commands

### Setup
```bash
bun install
```

### Development
```bash
bun run dev
```
- Starts Next dev server on port 3000.
- Script writes logs to `dev.log`.

### Lint
```bash
bun run lint
```
- Uses `eslint.config.mjs` (flat config).

### Build
```bash
bun run build
```
- Runs `prisma generate` first.
- Builds Next app in standalone mode.
- Copies static assets into `.next/standalone`.

### Start Production Build Locally
```bash
bun start
```

### Database (Prisma)
```bash
bun run db:generate
bun run db:push
bun run db:migrate
bun run db:reset
```

## Test Commands (Important)
- There is currently no `test` script in `package.json` and no committed `*.test.*`/`*.spec.*` files.
- Use Bun's built-in test runner directly.

### Run all tests
```bash
bun test
```

### Run a single test file
```bash
bun test path/to/file.test.ts
```

### Run tests matching a name pattern
```bash
bun test -t "should create booking"
```

## Codebase Layout
- `src/app/`: App Router pages, layouts, and API route handlers.
- `src/app/api/**/route.ts`: server endpoints by feature.
- `src/components/`: UI and page-level React components.
- `src/components/ui/`: shared presentational primitives (lint-ignored in eslint config).
- `src/lib/`: client/server utilities (API wrapper, auth, db, helpers).
- `src/stores/`: Zustand state stores.
- `src/i18n/` + `messages/`: locale config and translation messages.
- `prisma/`: schema and database artifacts.

## TypeScript and Import Conventions
- TS is `strict: true`; keep types explicit for public interfaces and API payloads.
- Path alias: use `@/*` for imports from `src/*`.
- Typical import order used in repo:
  1) framework/library imports,
  2) third-party packages,
  3) `@/` internal imports,
  4) relative imports.
- Prefer type-only imports when useful (`import type { ... } from ...`).

## Formatting and Style Conventions
- Match existing style in touched files before enforcing new style.
- Dominant style in source files:
  - single quotes,
  - no semicolons,
  - trailing commas optional/minimal,
  - concise arrow functions.
- Keep functions/components focused; ESLint warns on excessive complexity.
- Do not reformat unrelated files in broad sweeps.

## ESLint Reality (What Is Enforced)
- Many strict rules are intentionally disabled (including `no-explicit-any`).
- Complexity/size rules are warning-level and should still guide refactors:
  - `max-lines`: warn at 400,
  - `max-lines-per-function`: warn at 150,
  - `complexity`: warn at 15,
  - `max-statements`: warn at 40,
  - `max-depth`: warn at 3.
- `src/components/ui/**` is ignored by ESLint config.

## Naming Conventions
- Components: PascalCase (`LoginPage`, `DashboardTabs`).
- Hooks: `useXxx` camelCase (`useScrollHeader`, `useQueries`).
- Utility functions: camelCase (`apiCall`, `generateToken`).
- Route handlers: uppercase HTTP exports (`GET`, `POST`, `PUT`, `DELETE`).
- Constants: UPPER_SNAKE_CASE only for true constants; otherwise camelCase.

## API and Error Handling Patterns
- API handlers usually:
  - parse/validate input (often with `zod`),
  - wrap logic in `try/catch`,
  - return `NextResponse.json(payload, { status })`.
- Client API wrapper in `src/lib/api.ts` throws `Error` on non-OK response.
- Prefer consistent JSON error shapes: `{ error: string, ...details }`.
- Do not swallow errors silently unless intentionally non-blocking UI behavior.

## React/Next.js Patterns
- Respect client/server boundaries:
  - client components use `'use client'` when using hooks/browser APIs,
  - server route logic remains in `src/app/api`.
- Use `next-intl` patterns already present for locale-aware rendering.
- Avoid adding global state when local state/context is sufficient.

## LLM Invocation Discovery (Current State)
- Code search across `src/` found no LLM provider SDK usage.
- No runtime imports/usages found for OpenAI/Anthropic/Gemini/LangChain-style clients.
- `z-ai-web-dev-sdk` exists in `package.json` but is not imported in app source.
- Therefore there is currently no project-local "LLM invocation function" to trace.

## Closest Invocation Abstraction in Current Code
- The reusable network invocation function is `apiCall` in `src/lib/api.ts`.
- It wraps `fetch` and is used by auth/customer/booking/admin/seed API clients.
- If an LLM integration is added later, a likely place is a new `src/lib/llm.ts` or API route wrapper using a similar pattern.

## Agent Workflow Expectations
- Before edits: inspect nearby files and follow local conventions.
- Prefer LSP/symbolic tooling for code discovery and references (`find_symbol`, `find_referencing_symbols`) before plain text search.
- Use plain text search only when symbol resolution is not possible (e.g., global APIs or non-code docs/config text).
- After edits: run targeted checks first, then broader checks.
- Minimum verification for most changes:
  1) `bun run lint`
  2) `bun run build` (for route/type/runtime safety)
  3) relevant `bun test ...` command if tests exist
- Do not claim tests passed unless commands were actually executed.
