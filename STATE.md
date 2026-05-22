# STATE

## 2026-05-22 05:17 +0200

- Scope: final fallback hardening after code review found one remaining legacy explicit-tag gap.
- Root cause: `normalizeIncomingSearchParams()` repaired old raw tag URLs, but without city inventory context it still normalized explicit phrases like `Berlin sikiş` into `category=bordell`, which could empty out cities that only had FKK/Sauna inventory.
- Changed: `buildSearchTagParams()` now distinguishes structural category terms from broader explicit-intent phrases and falls back to city-only search when no city-specific category availability is known or when the inferred category is unavailable for the current city.
- Verification: `bun test src/lib/search-routing.test.ts "src/app/[locale]/search/page.test.ts" "src/app/[locale]/search/components/SearchResults.test.tsx" "src/app/[locale]/stadt/[city]/page.test.tsx"` passed; `bun run test:e2e -- e2e/search-tag-flow.spec.ts e2e/stadt-seo-tags.spec.ts` passed with new legacy Turkish raw-URL coverage; `bun run typecheck`, `bun run lint`, and `bun run build` all passed.
- Version: 0.5.2 → 0.5.3 (patch).

## 2026-05-22 05:01 +0200

- Scope: post-deploy follow-up on search-tag normalization after live verification caught one remaining Berlin fallback bug.
- Root cause: generic explicit tags (`Berlin bordell`, `Berlin sikiş`, `Berlin genelev`) were still hard-mapped to `category=bordell`, but Berlin currently has only result-bearing `fkk` / `sauna` categories, so those locale tags could still empty out the search page.
- Changed: city-page tag routing now derives available search categories from the city’s fetched establishments (`type` + category-like tags) and falls back to city-only search whenever the inferred category would be unsupported for that city.
- Verification: `bun test src/lib/search-routing.test.ts "src/app/[locale]/search/page.test.ts" "src/app/[locale]/search/components/SearchResults.test.tsx" "src/app/[locale]/stadt/[city]/page.test.tsx"` passed; `bun run test:e2e -- e2e/search-tag-flow.spec.ts e2e/stadt-seo-tags.spec.ts` passed with the new Turkish fallback case; `bun run typecheck`, `bun run lint`, and `bun run build` all passed again.
- Version: 0.5.1 → 0.5.2 (patch).

## 2026-05-22 04:46 +0200

- Scope: search tag / city-filter bugfix after `/stadt/[city]` hashtag rollout.
- Root cause: tag links sent raw phrase queries like `Köln bordell` together with inconsistent city params (`koeln` vs `Köln`), while `/search` rendered a false empty-state before React Query hydration finished.
- Added: `src/lib/search-routing.ts` + tests for canonical city normalization, tag-param shaping, and legacy raw-URL repair.
- Changed: `/search` now normalizes/redirects raw incoming params, shows canonical city labels in metadata/UI, and keeps city filter values slug-based internally for consistent dropdown state.
- Fixed: `CitySearchTagsSection` now routes tags to result-bearing structured search states; unsupported explicit tags fall back to city-only results when a stricter category would empty the page; `SearchResults` now shows loading skeletons instead of misleading empty-state flashes; old raw URLs like `?q=Köln bordell&city=koeln` self-heal via redirect.
- Verification: `bun test src/lib/search-routing.test.ts "src/app/[locale]/search/page.test.ts" "src/app/[locale]/search/components/SearchResults.test.tsx" "src/app/[locale]/stadt/[city]/page.test.tsx"` passed; `bun run test:e2e -- e2e/search-tag-flow.spec.ts e2e/stadt-seo-tags.spec.ts` passed; `bun run typecheck` passed; `bun run lint` passed; `bun run build` passed; React Doctor score `96/100` with only non-blocking legacy/taste warnings.
- Version: 0.5.0 → 0.5.1 (patch).

## 2026-05-22 03:42 +0200

- Scope: `/stadt` FAQ semantics repair + locale-based city search tags on `/stadt/[city]`.
- Fixed: `frontend/src/app/[locale]/stadt/page.tsx` FAQ cards now render as semantic `details > summary + p` instead of `dl > dt/dd`; city-card descriptions now strip `{#...}` tag blocks before visible render.
- Added: `frontend/src/lib/city-search-tags.ts` and tests for locale-aware phrase generation, `{#tag}` extraction, deduplication, and normalization; `frontend/e2e/stadt-seo-tags.spec.ts` for `/stadt` FAQ semantics and `/stadt/berlin` tag-link smoke coverage.
- Added: `/stadt/[city]` footer-adjacent tags section with locale copy from `messages/{de,en,tr,ar}.json`; city detail hero description stays clean while tag links expose localized search phrases via existing `/search` URL flow.
- Verification: `bun test "src/lib/city-search-tags.test.ts" "src/app/[locale]/stadt/page.test.ts" "src/app/[locale]/stadt/[city]/page.test.tsx"` passed; `bun run typecheck` passed; `bun run lint` passed; `bun run build` passed; `bun run test:e2e -- e2e/stadt-seo-tags.spec.ts` passed; `graphify update .` passed.
- Note: full `bun test` still fails on pre-existing unrelated suites (`e2e/*.spec.ts` under Bun, `src/i18n/routing.test.ts`, `src/components/home/HomeSectionsSeo.test.ts`, `src/lib/seo/home.test.ts`) outside this task scope.
- Version: 0.4.0 → 0.5.0 (minor).

## 2026-05-22 02:55 +0200

- Scope: `/stadt` SEO/content/schema expansion plus header login CTA recovery on server-rendered public pages.
- Changed: `/stadt` now uses a category-rich H1, stronger German SEO copy, city-card subtitle/description text, and richer FAQ/HowTo structured data focused on easier city discovery, trust, privacy, and reservation flow messaging.
- Fixed: Stadt `ImageObject` schema now follows city-specific public hero/public image URLs before legacy fallback images; localized login CTA now renders in `Header`/`MobileMenu` even when a server page cannot pass a client callback.
- Fixed: restored crawl protection for `/login`, localized login routes, and `/admin/:path*` via `X-Robots-Tag: noindex, nofollow`.
- Maintenance: removed three pre-existing frontend lint blockers in `ProductSEOContent.tsx`, `sitemap.xml/route.ts`, and `public-service-types.ts` without changing their external behavior.
- Verification: `bun test src/app/[locale]/stadt/page.test.ts src/lib/structuredData.test.ts src/lib/seo/crawl-controls.test.ts src/components/layout/Header.test.ts` passed; `bun run typecheck` passed; `bun run lint` passed; `bun run build` passed; local Playwright on `/stadt` confirmed visible `Anmelden` CTA, category-rich H1, city-card subtitle/description copy, and expanded FAQ blocks.
- Version: 0.3.5 → 0.4.0 (minor).

## 2026-05-21 23:38 +0200

- Scope: homepage/search image alt-attribute repair after live production inspection.
- Root cause: decorative hero and search header background images were rendered with empty `alt=""` attributes, while production `_rsc` console noise came from normal Next.js link-prefetch requests rather than failing route responses.
- Fixed: `HeroSection` now propagates API `altText` and falls back to localized slide labels for hero images; both search-page header background wrappers stay `aria-hidden` while their `next/image` nodes use localized non-empty alt text.
- Added: regression coverage in `src/components/home/HeroSection.test.ts` and `src/components/search/SearchPageContent.test.ts` to block empty background-image alt attributes from returning.
- Verification: `bun test src/components/home/HeroSection.test.ts src/components/search/SearchPageContent.test.ts` passed; `bun run typecheck` passed; `bun run build` passed; local Playwright smoke on `/` and `/search` showed 0 console errors, 0 network failures, 0 empty/missing `img[alt]`. Full `bun run lint` still fails on 4 pre-existing unrelated errors in `ProductSEOContent.tsx`, `stadt/page.tsx`, `sitemap.xml/route.ts`, and `public-service-types.ts`.
- Version: 0.3.4 → 0.3.5 (patch).

## 2026-05-21 21:24 +0200

- Scope: listing card Playwright verification repair after client-only age gate landed.
- Root cause: `e2e/listing-card.spec.ts` navigated without the `dm_age_verified=1` cookie, so the 18+ modal blocked the mocked listing card from rendering.
- Fixed: listing card E2E helper seeds the age verification cookie on the Playwright browser context before visiting `/de` or `/en`, then scopes controls through `data-testid="listing-card-e2e-studio"`.
- Verification: initial `bun run test:e2e -- e2e/listing-card.spec.ts` failed RED on the age gate dialog; after seeding the cookie and aligning assertions with the current link/modal DOM, the same Playwright spec passed 5/5 with a clean exit.
- Version: 0.3.3 → 0.3.4 (patch).

## 2026-05-21 20:58 +0200

- Scope: public Stadt city image source unification.
- Fixed: `normalizePublicCity()` accepts `publicHeroImageUrl` / `public_hero_image_url` and uses it before legacy `publicImageUrl` / `image` values.
- Fixed: `/uploads/*` backend asset paths normalize to `https://api.desiremap.de/uploads/*`, matching `next.config.ts` image remote pattern and avoiding broken relative frontend URLs.
- Changed: `getPublicCityImage()` and `FeaturedCities` now feed homepage Stadt cards and `/stadt/:slug` hero from the same helper.
- Changed: ListingCard detail links no longer depend on JS `onClick` navigation, keeping real crawlable `<Link href>` behavior.
- Verification: frontend public city tests first failed RED, then `bun test src/lib/backend-client.test.ts src/components/home/HomeDiscoverySeo.test.ts` passed; `bun run typecheck` passed; `bun run build` passed. Full `bun test` / `bun run lint` remain blocked by existing unrelated test/lint debt.
- Version: 0.3.2 → 0.3.3 (patch).

## 2026-05-21 16:05 +0200

- Scope: homepage language-switcher crawlability + home section SSR visibility/icon polish.
- Fixed: desktop `LanguageSwitcher` keeps `/en`, `/tr`, `/ar` links mounted in DOM while visually hidden when closed, so bots can discover alternate locale links from page HTML.
- Fixed: `CategoriesSection`, `FeaturedCities`, `SEOContentSection`, and `PromoSections` no longer SSR hidden `initial opacity:0` motion states.
- Fixed: category icon mapping now includes distinct icons for `massage`, `sauna`, `thermal`, and `wellness` instead of repeated gem fallback.
- Verification: `bun test src/components/home/HomeSectionsSeo.test.ts src/components/layout/LanguageSwitcher.test.ts` passed; `bun run typecheck` passed; scoped ESLint on touched files passed; `bun run build` passed.
- Version: 0.3.1 → 0.3.2 (patch).

## 2026-05-21 15:05 +0200

- Scope: default-locale `/de` SEO surface cleanup after live smoke.
- Fixed: homepage JSON-LD `WebSite/SearchAction` and `WebPage/BreadcrumbList` no longer emit `/de` default-locale URLs; venue detail breadcrumb search links now use unprefixed German search paths.
- Fixed: search page metadata/schema, blog index metadata/schema, and footer legal links no longer output `/de` default-locale links.
- Verification: targeted frontend tests (`18/18`), `bun run typecheck`, scoped ESLint, grep for `/de` in touched SEO files, and `bun run build` all passed.
- Version: 0.3.0 → 0.3.1 (patch).

## 2026-05-21 14:10 +0200

- Scope: client-only 18+ age gate + SEO schema cleanup + proxy hardening.
- Added: `AgeGate` client component in `[locale]/layout` using `/18plus.png`, browser-only cookie persistence (`dm_age_verified=1`), and localized copy in `de/en/tr/ar` message files.
- Changed: homepage JSON-LD now keeps only platform-safe `Organization` + `WebSite` entities; homepage venue list items emit `EntertainmentBusiness`; temporary Berlin office address remains under `Organization.address` only.
- Fixed: venue detail JSON-LD no longer emits `Product` / shipping / merchant return / stock-style ecommerce fields; stadt service schema no longer emits fake `Offer`/`InStock`; proxy rejects empty `User-Agent` requests with `403` after logging and resolves first public IPv4 from spoofed proxy chains.
- Verification: `bun test src/lib/ageGate.test.ts src/lib/structuredData.test.ts src/middleware.test.ts "src/app/[locale]/bordell/[slug]/ProductSEOContent.test.tsx"` passed (`17/17`); `bun run typecheck` passed; scoped ESLint on touched files passed; `bun run build` passed. Full `bun run lint` still blocked by 6 unrelated pre-existing errors in `ProductSEOContent.tsx`, `stadt/page.tsx`, `sitemap.xml/route.ts`, and `LanguageSwitcher.tsx`.
- Version: 0.2.11 → 0.3.0 (minor).

## 2026-05-19 21:29 +0200

- Scope: `/stadt` SEO metadata and JSON-LD schema implementation.
- Added: `getStadtStructuredData()` graph for Organization, WebSite/SearchAction/EntryPoint, WebPage, ImageObject, SpeakableSpecification, BreadcrumbList, ItemList, FAQPage, Service, and HowTo.
- Changed: `src/app/[locale]/stadt/page.tsx` now uses `/stadt` SEO metadata, absolute Open Graph URL fields, and renders JSON-LD through `JsonLd`.
- Fixed: `JsonLd` serialization now escapes script-breaking characters before injection.
- Added: regression tests for `/stadt` metadata, structured data graph shape, and JSON-LD escaping.
- Verification: targeted `/stadt` structured-data and metadata tests pass; `bun run typecheck` pass; `bun run lint` pass; `bun run build` pass.
- Version: 0.2.10 → 0.2.11 (patch).

## 2026-05-19 20:43 +0200

- Scope: explicit sitemap XML route repair.
- Root cause: Next metadata sitemap output was technically XML, but it included framework-generated XHTML alternate nodes and browser-rendered XML text output did not match the required plain sitemap structure.
- Fixed: removed `src/app/sitemap.ts` metadata route and replaced it with `src/app/sitemap.xml/route.ts` returning manual XML via `Response`.
- XML shape: `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` wraps explicit `<url>` entries with `<loc>`, `<lastmod>`, `<changefreq>`, and one-decimal `<priority>` children.
- Added: sitemap route regression asserts XML wrapper, URL children, venue URL inclusion, no XHTML namespace, no `/en/` homepage URL, and no float priority artifact.
- Verification: targeted sitemap test 1/1 pass; `bun run typecheck` pass; `bun run lint` pass; `bun run build` pass; route handler output status 200, `application/xml`, explicit `urlset/url/loc` tags, no XHTML namespace.
- Version: 0.2.9 → 0.2.10 (patch).

## 2026-05-19 20:23 +0200

- Scope: sitemap output cleanup after production inspection.
- Fixed: non-default locale homepage URLs now emit as `/en`, `/ar`, `/tr` instead of `/en/`, `/ar/`, `/tr/`.
- Fixed: sitemap priorities are rounded to one decimal place to avoid JavaScript float artifacts (`0.7000000000000001`).
- Evidence: production `/sitemap.xml` already returns `Content-Type: application/xml`, starts with XML declaration, and parses as XML; browser copy output drops tags from rendered XML tree.
- Verification: targeted sitemap test 1/1 pass.
- Version: 0.2.8 → 0.2.9 (patch).

## 2026-05-19 19:52 +0200

- Scope: public SEO sitemap endpoint repair.
- Fixed: `src/app/sitemap.ts` now fetches live public Stadt city and establishment data, emits localized `/venue/{slug}` detail URLs, Stadt pages, blog pages, and hreflang alternates instead of only homepage locale entries.
- Added: `src/app/sitemap.test.ts` regression test proving public establishments are queried and venue detail URLs are emitted without `/de` prefix.
- Verified local runtime: `/sitemap.xml` returns `application/xml` and includes `https://desiremap.de/venue/pascha-laufhaus-und-hotel`; `/robots.txt` returns 200 text/plain with sitemap reference.
- Verification: targeted sitemap test 1/1 pass; `bun run typecheck` pass; `bun run lint` pass; `bun run build` pass.
- Version: 0.2.7 → 0.2.8 (patch).

## 2026-05-19 17:55 +0200

- Scope: @tailwindcss/typography kurulumu.
- Installed: @tailwindcss/typography@0.5.19.
- Added: `@plugin "@tailwindcss/typography"` to globals.css (Tailwind v4 plugin syntax).
- Removed: blog page no-custom-classname override (prose-*: now fully linted).
- Auto-fixed: 12 classnames-order violations from new plugin classes.
- Verification: lint 0 errors 0 warnings; typecheck 0 errors; build OK.
- Version: 0.2.6 → 0.2.7 (patch).

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
