# Quality: DesireMap

**Analyzed:** 2026-03-08

## Testing

### Status: No Tests Configured

- **Unit tests:** Not configured
- **Integration tests:** Not configured
- **E2E tests:** Not configured
- **Test framework:** None installed (no jest, vitest, or playwright in package.json)
- **Test scripts:** No test scripts in `package.json`

### Impact

The absence of tests creates significant risk for a production application handling:
- Authentication (PASETO tokens, OAuth)
- Payments and bookings
- User data (GDPR compliance in Germany)

### Recommendations

1. **Install Vitest** (preferred for Next.js 16 + Bun):
   ```bash
   bun add -d vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
   ```

2. **Priority areas for testing:**
   - `src/lib/auth/paseto.ts` - Token generation/verification
   - `src/lib/auth/password.ts` - Password hashing
   - `src/lib/auth/blacklist.ts` - Token revocation
   - `src/app/api/auth/login/route.ts` - Login flow
   - `src/stores/authStore.ts` - Auth state management

3. **Test file location:** Co-locate tests next to source files (`*.test.ts`) or in `__tests__/` directories

---

## Code Patterns

### Naming Conventions

**Files:**
- Components: PascalCase with `.tsx` extension (e.g., `LoginPage.tsx`, `AdminPanel.tsx`)
- Utilities: camelCase with `.ts` extension (e.g., `api.ts`, `seedData.ts`)
- Hooks: camelCase with `use-` prefix (e.g., `use-mobile.ts`, `use-toast.ts`)

**Functions:**
- camelCase for functions (e.g., `handleSubmit`, `generateToken`, `verifyToken`)
- React components: PascalCase (e.g., `function LoginPage()`)

**Variables:**
- camelCase for local variables and state
- UPPER_SNAKE_CASE for constants (e.g., `TOKEN_EXPIRY`, `COOKIE_MAX_AGE`)

**Types:**
- PascalCase for interfaces and types (e.g., `TokenPayload`, `DecodedToken`, `AuthState`)

### Component Patterns

**UI Components** (`src/components/ui/`):
- shadcn/ui pattern with `cva` (class-variance-authority) for variant handling
- Radix UI primitives as base
- Export both component and variants (e.g., `Button` and `buttonVariants`)
- Data attributes for testing/styling (e.g., `data-slot`, `data-variant`)

Example from `src/components/ui/button.tsx`:
```typescript
const buttonVariants = cva(
  "inline-flex shrink-0 items-center...",
  {
    variants: {
      variant: { default: "...", destructive: "...", ... },
      size: { default: "...", sm: "...", lg: "..." }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
)
```

**Page Components** (`src/components/pages/`):
- Client components with `'use client'` directive
- Props interface defined inline
- German language strings hardcoded (not internationalized)

### State Management

**Zustand** with persist middleware pattern from `src/stores/authStore.ts`:
```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false, isLoading: false })
    }),
    { name: 'auth-storage', partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }) }
  )
)
```

**TanStack Query** via `src/hooks/useQueries.ts` for server state.

### API Layer

Centralized API client in `src/lib/api.ts`:
```typescript
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, config)
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
  return response.json()
}
```

Organized by domain: `authApi`, `customerApi`, `bookingApi`, `establishmentsApi`, `adminApi`

### Error Handling

**API Routes:** Try-catch with JSON error responses:
```typescript
try {
  // ... logic
} catch (error) {
  console.error('Login error:', error)
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}
```

**Client Components:** Try-catch with state-based error display:
```typescript
const [error, setError] = useState('')
// ... in handler
catch (err: any) {
  setError(err.message || 'Ein Fehler ist aufgetreten')
}
```

---

## Type Safety

### Configuration

**TypeScript config** (`tsconfig.json`):
- `strict: true` enabled
- `noImplicitAny: false` - implicit any is allowed (reduces type safety)
- Target: ES2017
- Module resolution: bundler
- Path alias: `@/*` maps to `./src/*`

### Type Safety Issues

**44 occurrences of `: any`** across 15 files:

| File | Count |
|------|-------|
| `src/lib/api.ts` | 9 |
| `src/components/pages/AdminPanel.tsx` | 10 |
| `src/components/dashboard/DashboardTabs.tsx` | 7 |
| `src/stores/bookingStore.ts` | 3 |
| `src/app/api/admin/*` routes | 8+ |
| Others | ~7 |

**Common patterns with `any`:**
- API response types: `apiCall<any>('/endpoint')`
- Form data: `updateProfile: async (data: any)`
- Error handling: `catch (err: any)`

### Prisma Type Safety

Strong typing via Prisma schema (`prisma/schema.prisma`):
- All models have proper types
- Enums for status fields (`UserRole`, `BookingStatus`, etc.)
- Relations properly defined
- Generated types available via `@prisma/client`

### Recommendations

1. **Enable `noImplicitAny: true`** in `tsconfig.json`
2. **Create response type interfaces** for API calls:
   ```typescript
   // src/types/api.ts
   interface UserResponse { id: string; email: string; name: string | null; role: string }
   interface BookingResponse { id: string; date: string; status: BookingStatus; ... }
   ```
3. **Use Zod schemas for runtime validation** (already using zod for input validation)

---

## Linting & Formatting

### ESLint Configuration

**Config file:** `eslint.config.mjs` (ESLint 9 flat config)

**Extends:**
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

### Rule Configuration

**Many rules are disabled** (set to `"off"`):
- `@typescript-eslint/no-explicit-any` - **OFF** (allows any types)
- `@typescript-eslint/no-unused-vars` - **OFF** (allows unused variables)
- `@typescript-eslint/no-non-null-assertion` - **OFF**
- `react-hooks/exhaustive-deps` - **OFF** (may cause stale closures)
- `no-console` - **OFF** (console.log allowed in production)
- `no-debugger` - **OFF** (debugger statements allowed)

**Quality rules enabled** (set to `"warn"`):
- `max-lines: 400` - File size limit
- `max-lines-per-function: 150` - Function size limit
- `complexity: 15` - Cyclomatic complexity
- `max-statements: 40` - Statements per function
- `max-depth: 3` - Nesting depth

### Prettier

- **Not configured** (no `.prettierrc` or `prettier` in package.json)
- Formatting relies on ESLint and editor defaults

### Recommendations

1. **Re-enable key rules** gradually:
   ```javascript
   "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
   "react-hooks/exhaustive-deps": "warn"
   ```

2. **Add Prettier** for consistent formatting:
   ```bash
   bun add -d prettier eslint-config-prettier
   ```

3. **Add pre-commit hooks** with lint-staged

---

## Documentation

### Code Comments

**Good practices:**
- Auth module has JSDoc comments with examples:
  ```typescript
  /**
   * Auth Module - PASETO v4 + Google OAuth
   * @example
   * // Login
   * const response = await fetch('/api/auth/login', ...)
   */
  ```
- PASETO service has clear documentation
- Prisma schema has section headers

**Gaps:**
- Most components lack JSDoc
- Complex business logic not documented
- No inline comments for non-obvious code

### Project Documentation

**Present:**
- `CLAUDE.md` - Comprehensive project instructions
- `TEST_USERS.md` - Test user credentials
- `.env.example` - Environment variable template

**Missing:**
- API documentation (no OpenAPI/Swagger)
- Component storybook
- Architecture decision records

### Hardcoded Strings

**Internationalization issue:** German strings hardcoded in components:
```typescript
// src/components/pages/LoginPage.tsx
setError('Bitte fuellen Sie alle Felder aus')
// ...
<p className="text-gray-400 text-sm">Melden Sie sich an, um fortzufahren</p>
```

While `next-intl` is configured, components use raw German strings instead of `useTranslations()`.

---

## Areas for Improvement

### High Priority

| Area | Issue | Impact | Fix Approach |
|------|-------|--------|--------------|
| **Testing** | No tests | Regression risk, hard refactoring | Add Vitest, start with auth module tests |
| **Type Safety** | 44 `any` usages | Runtime errors, no IDE support | Create typed interfaces, enable `noImplicitAny` |
| **ESLint Rules** | Many disabled rules | Code quality issues | Gradually re-enable rules, fix violations |

### Medium Priority

| Area | Issue | Impact | Fix Approach |
|------|-------|--------|--------------|
| **Hardcoded Strings** | German text in components | i18n broken | Move to translation files, use `useTranslations()` |
| **Prettier** | Not configured | Inconsistent formatting | Add Prettier config |
| **Error Types** | `catch (err: any)` | Poor error handling | Use `unknown` with type guards |

### Low Priority

| Area | Issue | Impact | Fix Approach |
|------|-------|--------|--------------|
| **Documentation** | No API docs | Onboarding friction | Add OpenAPI spec |
| **Console Logs** | Allowed in production | Performance, security | Add `no-console: warn` for production |
| **Pre-commit Hooks** | Not configured | CI failures | Add husky + lint-staged |

### Large Files (Refactoring Candidates)

| File | Lines | Concern |
|------|-------|---------|
| `src/lib/structuredData.ts` | 1055 | SEO data generation - consider splitting by schema type |
| `src/components/ui/sidebar.tsx` | 726 | Generated UI component - acceptable |
| `src/components/pages/AdminPanel.tsx` | 572 | Large component - consider extracting tabs |
| `src/components/listings/ReservationModal.tsx` | 512 | Complex modal - consider form extraction |

---

## Quality Metrics Summary

| Metric | Status | Target |
|--------|--------|--------|
| Test Coverage | 0% | 70%+ |
| TypeScript Strict | Partial | Full strict mode |
| ESLint Errors | Unknown | Run `bun lint` |
| `any` Types | 44 occurrences | 0 |
| Max File Size | 1055 lines | <400 lines |
| Max Function Size | Within limits | <150 lines |

---

*Quality analysis: 2026-03-08*
