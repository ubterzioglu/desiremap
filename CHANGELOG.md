# Changelog

All notable changes to this project will be documented in this file.

## [0.3.3] - 2026-05-21

### Changed
- Public city image selection now uses one helper for homepage Stadt cards, `/stadt`, and `/stadt/:slug` hero images.
- Backend upload paths under `/uploads/*` are normalized to `https://api.desiremap.de/uploads/*` before rendering with Next image.

### Fixed
- `publicHeroImageUrl` is now preferred over legacy public image fields in public city API normalization.
- Listing card detail links stay crawlable without extra JS click-handler navigation.

## [0.3.2] - 2026-05-21

### Changed
- Desktop language switcher now keeps locale `<a>` links mounted in the DOM even when the dropdown is visually closed, improving crawlable locale discovery.
- Home section reveal animations now use SSR-safe motion defaults (`initial={false}`) so homepage text and links are not server-rendered in hidden `opacity: 0` states.

### Fixed
- Added explicit category icons for massage, sauna, thermal, and wellness cards instead of falling back to the same gem icon.

## [0.3.1] - 2026-05-21

### Fixed
- Removed remaining default-locale `/de` SEO surface leaks from homepage/search/blog structured data, metadata, and footer legal links.
- Default-locale search and blog canonicals now use unprefixed paths (`/search`, `/blog`, `/blog/:slug`) instead of `/de/*`.

## [0.3.0] - 2026-05-21

### Added
- Added a client-only `AgeGate` modal using `/18plus.png`, browser-side cookie persistence, and bot-aware bypass so search engines can still read SSR content directly.
- Added regression coverage for age-gate helpers, bot bypass, cookie persistence, and locale layout wiring.

### Changed
- Homepage platform schema now stays at `Organization` + `WebSite`; featured venue list items now emit `EntertainmentBusiness` instead of ecommerce-style entities.
- Venue detail JSON-LD now emits `EntertainmentBusiness` and service/business metadata without ecommerce offer semantics.

### Fixed
- Removed ecommerce structured-data spam risk from homepage, stadt index, and venue detail outputs (`Product`, `ProductGroup`, `Offer`, shipping, return policy, stock availability fields).
- Stadt `Service` schema no longer emits fake `Offer` / `InStock` values.
- Proxy hardening now labels known bots, bypasses age gate for bots, rejects empty user-agents with `403`, and extracts the first public IPv4 from spoofed forwarded chains.

## [0.2.11] - 2026-05-19

### Added
- `/stadt` now renders JSON-LD graph data for Organization, WebSite/SearchAction, WebPage, ImageObject, BreadcrumbList, ItemList, FAQPage, Service, and HowTo schemas.
- Regression coverage for `/stadt` metadata and structured data schema output.

### Changed
- `/stadt` metadata now includes SEO title, meta description, canonical alternates, and absolute Open Graph URL fields for city index URLs.

### Fixed
- JSON-LD script serialization now escapes script-breaking characters before injection.

## [0.2.10] - 2026-05-19

### Fixed
- Replaced Next metadata sitemap generation with an explicit `/sitemap.xml` route handler that returns plain sitemap XML.
- Sitemap output now uses direct `<urlset>` / `<url>` / `<loc>` / `<lastmod>` / `<changefreq>` / `<priority>` tags without XHTML alternate tags.

## [0.2.9] - 2026-05-19

### Fixed
- Sitemap root locale URLs no longer emit trailing slashes for non-default locales.
- Sitemap priority values are rounded to one decimal place, removing floating-point artifacts like `0.7000000000000001`.

## [0.2.8] - 2026-05-19

### Added
- Regression coverage for sitemap venue URL generation from live public establishment data.

### Fixed
- Sitemap now includes Stadt, blog, and localized venue detail URLs instead of only homepage locale entries.
- Sitemap generation now emits canonical German URLs without `/de` prefixes and hreflang alternates for supported locales.
- Robots endpoint remains available with sitemap reference for crawler discovery.

## [0.2.7] - 2026-05-19

### Added
- `@tailwindcss/typography` installed and configured via `@plugin "@tailwindcss/typography"` in `globals.css`
- Blog page `prose-*:` modifier classes now fully validated by ESLint (no override needed)
- Auto-fixed `classnames-order` violations introduced by typography plugin

### Changed
- Removed blog page `no-custom-classname: off` override from `eslint.config.mjs`

## [0.2.6] - 2026-05-19

### Added
- `eslint-plugin-tailwindcss` re-added with Tailwind v4 fix: `config` set to absolute path of `src/app/globals.css` (CSS-based config for v4)
- Tailwind rules promoted to `error` level: `classnames-order`, `enforces-shorthand`, `no-custom-classname`, `no-contradicting-classname`, etc.
- `prettier-plugin-tailwindcss@0.8.0` — auto-sorts classes on `bun run format`
- `.prettierrc` updated with plugin + `tailwindConfig` path
- `eslint-plugin-tailwindcss` `classnames-order` auto-fixed across 500 class strings via `--fix`
- Whitelist for `speakable-*` (JSON-LD SEO) and `prose-*:` variant override for blog pages (awaiting `@tailwindcss/typography` install)

### Fixed
- Unused `createRequire` import removed from `eslint.config.mjs`

## [0.2.5] - 2026-05-19

### Fixed
- ESLint config: removed `eslint-plugin-tailwindcss` (incompatible with Tailwind v4) — was blocking lint with infinite "Cannot resolve tailwindcss config" warnings
- Added `src/app/**/bordell/**/page.tsx` and `src/lib/backend-client.ts` to complexity override list (type guard and normalizer functions are inherently complex)
- Uninstalled `eslint-plugin-tailwindcss` package

### Changed
- `eslint.config.mjs`: pure TypeScript/React/Next.js rules, no tailwind lint plugin

## [0.2.4] - 2026-05-19

### Removed
- All login/auth functionality from `frontend/` — no login capability remains
- `src/stores/authStore.ts` — Zustand auth store (AuthUser, AuthSession, useAuthStore)
- `src/components/providers/SessionProvider.tsx` — session provider and useAuth() hook
- `src/components/auth/GoogleOAuthButton.tsx` — Google OAuth button component
- `src/hooks/useGoogleOAuth.ts` — Google OAuth hook
- `src/components/pages/LoginPage.tsx` — login page component
- `src/components/pages/RegisterPage.tsx` — register page component
- `src/app/[locale]/login/` — login route
- `src/app/[locale]/register/` — register route
- `src/app/[locale]/kunde/login/` — customer login route
- `api.ts`: removed `authApi` (login, register, me, logout, getConfig, getGoogleLoginUrl), `normalizeUser`, `normalizeAuthSession`, `normalizeAuthConfig`, `WorkspaceType`, `AuthConfig`, token logic in `createHeaders`, `{ auth: false }` from all publicApi calls
- `useQueries.ts`: removed `useRegister`, `useLogin`, `useRegisterAndLogin` hooks
- `package.json`: removed `bcryptjs` and `@types/bcryptjs` dependencies
- `next.config.ts`: removed `/login`, `/register` from restrictedSources (noindex headers)
- `types/index.ts`: removed `'login'` from View type
- `Header.tsx`: removed login button fallback link to `/login` (hidden when no onLoginClick prop)

### Changed
- `ReservationModal.tsx`: works without auth — no auth wall, no login redirect, no user pre-fill
- `[locale]/page.tsx`: removed ViewLogin, login/register state, login-related handlers
- `[locale]/layout.tsx`: removed SessionProvider wrapper (children directly in QueryProvider)
- `Header.tsx`: login button hidden when no onLoginClick prop provided

## [0.2.3] - 2026-05-19

### Removed
- `api.ts`: removed `adminApi`, `seedApi`, and all admin-only types (`AdminStatsResponse`, `AdminVenueResponse`, `AdminEventResponse`, `AdminOperatorResponse`, `AdminBusinessResponse`, `AdminCityResponse`, `AdminCityPayload`, `AdminCreateVenuePayload`)
- `backend-client.ts`: removed operator-auth endpoints (`operatorLogin`), member-auth endpoints (`requestMemberOtp`, `verifyMemberOtp`), operator-business endpoints (`listBusinessOperators`, `createVenue`, `createEvent`, `getOperatorEventDetail`, `publishEvent`, `cancelEvent`, `disableBusinessOperator`, `reactivateBusinessOperator`, `deprovisionBusinessOperator`), and their types (`OperatorLoginResponse`, `OperatorVenuePayload`, `OperatorEventPayload`)
- `next.config.ts`: removed dead route headers for `/auth/*`, `/admin/*`, `/business/*`, `/:locale/admin/*`

### Changed
- `frontend/` no longer contains any admin/operator/member API client code — all moved to `frontend-admin/`

## [0.2.2] - 2026-05-19

### Removed
- Deleted old admin panel routes: `src/app/auth/*` (11 files)
- Deleted old business operator portal routes: `src/app/business/*` (5 files)
- Deleted old operator redirect routes: `src/app/operator/*` (3 files)
- Deleted `[locale]/admin` and `[locale]/dashboard` pages
- Deleted `src/components/admin/*` (10 components)
- Deleted `src/components/operator/*` (5 components)
- Deleted `src/components/dashboard/*` (2 components)
- Deleted `src/components/pages/AdminPanel.tsx` and `DashboardPage.tsx`
- Deleted `src/components/providers/AdminAuthProvider.tsx`
- Deleted `src/stores/adminStore.ts` and `src/stores/adminAuthStore.ts`
- Deleted `src/types/admin.ts`, `src/lib/admin-config.ts`, `src/lib/admin-session.ts`

### Changed
- Cleaned `proxy.ts`: removed admin hostname rewrite logic and operator redirects
- Cleaned `types/index.ts`: removed `AdminTab`, `DashboardTab`, `OperatorTab` types
- Cleaned `hooks/useQueries.ts`: removed all admin hooks section
- Cleaned `[locale]/page.tsx`: removed `ViewDashboard` and `DashboardPage` references
- Cleaned `data/mock-data.ts`: removed admin-only mock data
- Admin panel is now served exclusively from `frontend-admin/`

## [0.2.1] - 2026-05-15

### Fixed
- Restored Coolify production build under `exactOptionalPropertyTypes` by omitting undefined optional props and API params.
- Hardened public fallback mapping, locale/path guards, auth normalization, and generated UI wrappers for strict optional typing.
- Added missing `eslint-config-prettier` dev dependency required by the existing ESLint config.

## [0.2.0] - 2026-05-13

### Changed
- Existing public frontend release baseline before deployment unblock.
