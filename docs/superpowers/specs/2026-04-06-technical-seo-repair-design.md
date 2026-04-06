# Technical SEO Repair Design

Date: 2026-04-06
Scope: `frontend/`
Mode: Repair, not redesign

## Objective

Restore homepage rendering and close the known technical indexing gaps before submitting the site to Google.

This repair must ensure:

- locale homepages render without translation failures
- every indexable page emits its own absolute canonical URL
- hreflang alternates are consistent across locales
- `og:site_name` is present and set to `DesireMap`
- `robots.txt`, `sitemap.xml`, `llms.txt`, robots meta, and `X-Robots-Tag` are present and aligned
- no blanket indexing rule accidentally deindexes valid content

## Verified Findings

- `src/components/home/HomePage.tsx` calls `useTranslations('trustStats')`
- `messages/de.json` and `messages/en.json` contain `trustStats`
- `messages/tr.json` and `messages/ar.json` do not contain `trustStats`
- locale rendering already uses `https://desiremap.de` in `src/app/[locale]/layout.tsx`
- `src/app/robots.ts` exists
- `src/app/sitemap.ts` exists, but currently only emits locale home URLs
- no `llms.txt` file or route is present
- no explicit `X-Robots-Tag` rule was found

## Source Of Truth

- Site domain: `https://desiremap.de`
- Brand name: `DesireMap`
- Canonical policy: every indexable URL keeps its own canonical URL
- Locale policy: `de`, `en`, `tr`, `ar`, plus `x-default`

## Non-Goals

- no visual redesign
- no routing redesign
- no content rewrite beyond missing translation keys required for render stability
- no broad SEO refactor outside the touched metadata surfaces

## Repair Strategy

Use a surgical repair path. Keep the current App Router metadata model, keep existing route structure, and patch only the metadata and translation surfaces required for correct crawling and indexing.

## Decisions

### 1. Translation Repair

Add a `trustStats` namespace to:

- `messages/tr.json`
- `messages/ar.json`

The new keys must match the shape already used by `de` and `en`:

- `verified`
- `verifiedLabel`
- `verifiedDesc`
- `discretion`
- `discretionLabel`
- `discretionDesc`
- `support`
- `supportLabel`
- `supportDesc`

This is required to stop locale homepage rendering from failing.

### 2. Canonical Policy

Every indexable page must emit its own absolute canonical URL.

Examples:

- `https://desiremap.de/de`
- `https://desiremap.de/en`
- `https://desiremap.de/tr`
- `https://desiremap.de/ar`
- `https://desiremap.de/de/blog`
- `https://desiremap.de/en/blog/premium-erotik-plattform`
- `https://desiremap.de/de/bordell/<slug>`

Rules:

- no locale page may collapse to `https://desiremap.de/`
- canonical values must be absolute, not relative
- `og:url` must match the canonical URL for the page
- root redirect behavior must not override locale page canonical output

### 3. Hreflang Policy

All indexable locale pages must emit alternates for:

- `de`
- `en`
- `tr`
- `ar`
- `x-default`

Rules:

- alternates must use absolute URLs
- locale alternates must point to equivalent content paths, not just homepage roots
- missing equivalent translations may fall back only if the page truly does not exist in that locale

### 4. Open Graph And Social Metadata

All indexable content pages must emit:

- `og:title`
- `og:description`
- `og:url`
- `og:locale`
- `og:site_name`
- `og:image`
- `og:image:width`
- `og:image:height`
- `og:image:alt`

Required value:

- `og:site_name = DesireMap`

Twitter metadata must stay aligned with OG output for title, description, and image.

### 5. Robots Meta Policy

Default rule for indexable content pages:

- `index, follow`

Known exception:

- search result pages remain `noindex, follow`

Rules:

- no indexable page may accidentally inherit `noindex`
- API, auth, and admin surfaces must not be opened for indexing by mistake

### 6. X-Robots-Tag Policy

Add explicit `X-Robots-Tag` headers through Next configuration, not by rewriting the current `next-intl` middleware flow.

Header targets:

- `/api/:path*` -> `noindex, nofollow`
- auth endpoints -> `noindex, nofollow`
- admin surfaces -> `noindex, nofollow`

Rules:

- do not set a blanket site-wide `X-Robots-Tag`
- do not attach `noindex` headers to public content pages

### 7. robots.txt Policy

Keep `src/app/robots.ts` as the source of truth.

Required behavior:

- allow public content crawling
- disallow API and admin surfaces
- publish `sitemap: https://desiremap.de/sitemap.xml`
- publish host/domain consistently as `https://desiremap.de`

### 8. sitemap.xml Policy

Keep `src/app/sitemap.ts` as the source of truth, but expand coverage beyond locale homepages.

Must include indexable URLs for:

- locale homepages
- locale blog listing pages
- locale blog detail pages
- locale bordell detail pages

Must exclude:

- redirect-only root
- search results
- API routes
- auth routes
- admin routes

Rules:

- all sitemap URLs must be absolute
- alternate locale links must stay aligned with canonical page equivalents

### 9. llms.txt Policy

Add a static `llms.txt` under `public/`.

Purpose:

- expose a deterministic machine-readable summary for LLM crawlers
- declare the canonical domain and high-value entry points

The file should stay simple and include:

- site name
- primary domain
- short description
- important public URLs
- brief crawler guidance

## Planned File Surface

Expected primary files:

- `messages/tr.json`
- `messages/ar.json`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/blog/page.tsx`
- `src/app/[locale]/blog/[slug]/page.tsx`
- `src/app/[locale]/bordell/[slug]/page.tsx`
- `src/app/[locale]/search/page.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `next.config.ts`
- `public/llms.txt`

Supporting helper:

- `src/lib/seo/url.ts`

The helper is limited to absolute URL, canonical, and hreflang generation. It is not a general SEO refactor.

## Data Flow

1. Route-level `generateMetadata` resolves locale and page path
2. Metadata builder emits absolute canonical and alternates
3. Open Graph and Twitter metadata reuse the same absolute URL source
4. `robots.ts` publishes crawler rules and sitemap location
5. `sitemap.ts` emits all public indexable URLs
6. `next.config.ts` injects `X-Robots-Tag` only on non-indexable surfaces
7. `public/llms.txt` is served as a static crawlable text asset

## Failure Modes To Prevent

### Boundary Failures

- locale page crashes because a required translation namespace is missing
- relative canonical output resolves incorrectly under locale nesting
- `x-default` or locale alternates point to the wrong path

### Data Integrity Failures

- canonical and `og:url` disagree for the same page
- sitemap URL set diverges from actual canonical URL set
- public pages accidentally inherit `noindex` through a broad rule

### Race / Drift Failures

- one route updates metadata manually while others keep stale canonical logic
- new locale page types forget to include alternates or `og:site_name`

## Acceptance Criteria

- `/tr` homepage renders without `MISSING_MESSAGE`
- `/ar` homepage renders without `MISSING_MESSAGE`
- public pages emit absolute canonical tags with page-specific URLs
- public pages emit `og:site_name=DesireMap`
- public pages emit locale alternates including `x-default`
- `robots.txt` is reachable and references `https://desiremap.de/sitemap.xml`
- `sitemap.xml` is reachable and includes public indexable URLs, not just locale roots
- `llms.txt` is reachable
- API/auth/admin surfaces return `X-Robots-Tag: noindex, nofollow`
- search pages keep `noindex, follow`

## Validation Plan

Run and verify:

- `bun run dev`
- `bun run build`
- open `/tr` and `/ar`
- inspect rendered `<head>` on representative pages:
  - locale homepage
  - blog listing
  - blog detail
  - bordell detail
- `curl -I`:
  - homepage
  - blog page
  - search page
  - `/api/auth/config`
- fetch:
  - `/robots.txt`
  - `/sitemap.xml`
  - `/llms.txt`

Head checks must confirm:

- canonical
- alternate hreflang
- robots meta
- `og:site_name`
- `og:url`

## Risks

- sitemap coverage may still be incomplete if dynamic public routes outside the verified set exist
- route-level metadata from `structuredData` helpers may require alignment if they currently emit partial OG fields
- overly broad header matching in `next.config.ts` could deindex the wrong surface if paths are not specific

## Ready For Planning

Yes. The scope is a single repair lane focused on indexability and homepage render stability, without architecture redesign.
