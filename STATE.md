# STATE

## 2026-05-19 17:45 +0200

- Scope: Tailwind strict lint + prettier class sorting.
- Added: eslint-plugin-tailwindcss (v4 fix: absolute CSS config path), prettier-plugin-tailwindcss@0.8.0.
- Fixed: classnames-order auto-fixed 500 strings; speakable-* whitelisted; prose-*: disabled in blog page (needs @tailwindcss/typography).
- Updated: .prettierrc with prettier-plugin-tailwindcss.
- Verification: lint 0 errors 0 warnings; typecheck 0 errors; tests 4/4; build OK.
- Version: 0.2.5 → 0.2.6 (patch).

## 2026-05-19 17:15 +0200

- Scope: ESLint fix — removed incompatible `eslint-plugin-tailwindcss` (v3 + Tailwind v4 uyumsuz).
- Fixed: infinite "Cannot resolve tailwindcss config path" warnings blocking `bun run lint`.
- Added bordell/slug/page.tsx and backend-client.ts to complexity override list.
- Verification: lint 0 errors 0 warnings; typecheck 0 errors; tests 4/4 pass.
- Version: 0.2.4 → 0.2.5 (patch).

## 2026-05-19 15:45 +0200

- Scope: Auth removal — removed ALL login/auth functionality from frontend/.
- Deleted: authStore.ts, SessionProvider.tsx, GoogleOAuthButton.tsx, useGoogleOAuth.ts, LoginPage.tsx, RegisterPage.tsx, login/register/kunde routes.
- Edited: api.ts (stripped authApi, normalizeUser, normalizeAuthSession, token logic, { auth: false }), useQueries.ts (removed auth hooks), layout.tsx (removed SessionProvider), page.tsx (removed ViewLogin, login state), ReservationModal.tsx (removed useAuth, auth wall), Header.tsx (removed login link fallback), next.config.ts (removed login/register from noindex headers), types/index.ts (removed 'login' from View), package.json (removed bcryptjs, bumped to 0.2.4).
- Frontend no longer handles any authentication.
- Verification: bun run typecheck → 0 errors; bun run lint → 0 errors (3 pre-existing complexity warnings).

## 2026-05-19 13:30 +0200

- Scope: Admin panel cleanup — removed all old admin/operator/business portal code from frontend/.
- Deleted: 36+ files across auth/*, business/*, operator/* routes, components/admin/*, components/operator/*, components/dashboard/*, AdminPanel, DashboardPage, AdminAuthProvider, adminStore, adminAuthStore, types/admin.ts, admin-config.ts, admin-session.ts.
- Edited: proxy.ts (removed admin hostname logic), types/index.ts (removed Admin/Dashboard/OperatorTab types), hooks/useQueries.ts (removed admin hooks), [locale]/page.tsx (removed ViewDashboard), data/mock-data.ts (removed admin mock data), eslint.config.mjs (removed deleted file overrides).
- Admin panel now exclusively in frontend-admin/.
- Verification: bun run typecheck → 0 errors; bun run lint → 0 errors (3 pre-existing complexity warnings).

## 2026-05-15 11:22 +0200

- Scope: public frontend deployment unblock for Coolify commit `e7b9702` follow-up.
- Fixed strict optional typing across login props, search params, admin/operator payloads, reservation notes, public fallback mapping, layout helpers, UI wrappers, toast actions, auth normalization, SEO city hints, and proxy locale guards.
- Added missing `eslint-config-prettier` dev dependency used by `eslint.config.mjs`.
- Bumped `package.json` version to `0.2.1` and added `CHANGELOG.md` release entry.
- Verification: `bun run typecheck` passed; `bun run lint` passed with 2 pre-existing complexity warnings; `bun run build` passed.
