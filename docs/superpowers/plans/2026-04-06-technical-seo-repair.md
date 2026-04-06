# Technical SEO & GEO Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the homepage i18n crash and make public SEO/GEO surfaces technically consistent before Google indexing.

**Architecture:** Keep the existing Next.js App Router metadata model and repair only the narrow surfaces that emit translation, canonical, hreflang, OG, robots, sitemap, llms, and indexing headers. Centralize absolute URL generation in one small SEO helper so route-level metadata and structured-data helpers stop drifting.

**Tech Stack:** Next.js 16 App Router, TypeScript, next-intl, Bun test runner, App Router metadata routes, static public assets

---

## File Map

### Create

- `src/lib/seo/url.ts`
  Responsibility: single source of truth for absolute site URLs, canonical URLs, and locale alternate maps
- `src/lib/seo/url.test.ts`
  Responsibility: lock absolute URL and hreflang generation behavior
- `src/lib/seo/metadata-contracts.test.ts`
  Responsibility: assert blog/product metadata emits correct canonical, alternates, `og:site_name`, and brand identity
- `public/llms.txt`
  Responsibility: stable machine-readable GEO surface for LLM crawlers

### Modify

- `messages/tr.json`
  Responsibility: add missing `trustStats` namespace for Turkish homepage rendering
- `messages/ar.json`
  Responsibility: add missing `trustStats` namespace for Arabic homepage rendering
- `src/app/[locale]/layout.tsx`
  Responsibility: locale homepage metadata, canonical, alternates, OG, Twitter
- `src/app/[locale]/blog/page.tsx`
  Responsibility: localized blog index metadata
- `src/app/[locale]/search/page.tsx`
  Responsibility: search metadata, canonical behavior, robots exception
- `src/lib/structuredData.ts`
  Responsibility: blog/product metadata helpers used by detail pages
- `src/app/robots.ts`
  Responsibility: crawler directives and sitemap publication
- `src/app/sitemap.ts`
  Responsibility: public indexable URL listing
- `next.config.ts`
  Responsibility: `X-Robots-Tag` header rules for non-indexable surfaces

### Validate Existing Usage, Do Not Rewrite Unless Needed

- `src/app/[locale]/blog/[slug]/page.tsx`
  Uses `getBlogPostMetadata`
- `src/app/[locale]/bordell/[slug]/page.tsx`
  Uses `getProductMetadata`
- `src/components/home/HomePage.tsx`
  Uses `trustStats` translations

## Task 1: Lock URL And Metadata Contracts With Failing Tests

**Files:**
- Create: `src/lib/seo/url.test.ts`
- Create: `src/lib/seo/metadata-contracts.test.ts`
- Test: `src/lib/seo/url.test.ts`
- Test: `src/lib/seo/metadata-contracts.test.ts`

- [ ] **Step 1: Write the failing URL helper tests**

```ts
import { describe, expect, test } from 'bun:test'
import { buildAbsoluteUrl, buildLocaleAlternates } from './url'

describe('seo url helpers', () => {
  test('builds absolute locale URLs for canonical tags', () => {
    expect(buildAbsoluteUrl('/de')).toBe('https://desiremap.de/de')
    expect(buildAbsoluteUrl('/en/blog')).toBe('https://desiremap.de/en/blog')
  })

  test('builds absolute hreflang alternates including x-default', () => {
    expect(buildLocaleAlternates('/blog')).toEqual({
      de: 'https://desiremap.de/de/blog',
      en: 'https://desiremap.de/en/blog',
      tr: 'https://desiremap.de/tr/blog',
      ar: 'https://desiremap.de/ar/blog',
      'x-default': 'https://desiremap.de/de/blog'
    })
  })
})
```

- [ ] **Step 2: Write the failing metadata contract tests**

```ts
import { describe, expect, test } from 'bun:test'
import { getBlogPostMetadata, getProductMetadata } from '@/lib/structuredData'

test('blog metadata keeps DesireMap brand and absolute alternates', () => {
  const metadata = getBlogPostMetadata(mockBlogPost, 'en')
  expect(metadata.openGraph?.siteName).toBe('DesireMap')
  expect(metadata.alternates?.canonical).toBe('https://desiremap.de/en/blog/test-slug')
  expect(metadata.alternates?.languages?.de).toBe('https://desiremap.de/de/blog/test-slug')
})

test('product metadata does not leak legacy brand names', () => {
  const metadata = getProductMetadata(mockProduct, 'de')
  expect(String(metadata.title)).toContain('DesireMap')
  expect(String(metadata.description)).toContain('DesireMap')
  expect(metadata.openGraph?.siteName).toBe('DesireMap')
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run:

```bash
bun test src/lib/seo/url.test.ts src/lib/seo/metadata-contracts.test.ts
```

Expected:

- failure because `src/lib/seo/url.ts` does not exist yet
- failure because current metadata helpers still emit relative language alternates and legacy product branding

- [ ] **Step 4: Commit the failing tests**

```bash
git add src/lib/seo/url.test.ts src/lib/seo/metadata-contracts.test.ts
git commit -m "test: define seo metadata contracts"
```

## Task 2: Implement The Shared SEO URL Helper And Align Detail Metadata

**Files:**
- Create: `src/lib/seo/url.ts`
- Modify: `src/lib/structuredData.ts`
- Test: `src/lib/seo/url.test.ts`
- Test: `src/lib/seo/metadata-contracts.test.ts`

- [ ] **Step 1: Implement the URL helper with narrow scope**

```ts
const SITE_URL = 'https://desiremap.de'
const LOCALES = ['de', 'en', 'tr', 'ar'] as const

export function buildAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

export function buildLocaleAlternates(path: string) {
  return {
    de: buildAbsoluteUrl(`/de${path}`),
    en: buildAbsoluteUrl(`/en${path}`),
    tr: buildAbsoluteUrl(`/tr${path}`),
    ar: buildAbsoluteUrl(`/ar${path}`),
    'x-default': buildAbsoluteUrl(`/de${path}`)
  }
}
```

- [ ] **Step 2: Refactor `src/lib/structuredData.ts` to consume the helper**

Required changes:

- replace relative `alternates.languages` values with absolute URLs from `buildLocaleAlternates`
- keep `canonical` absolute
- keep `openGraph.siteName = 'DesireMap'`
- replace legacy product title/description branding such as `Bordellmarkt` with `DesireMap`
- add `alt` to OG image definitions if the current metadata shape permits it

- [ ] **Step 3: Run the metadata contract tests**

Run:

```bash
bun test src/lib/seo/url.test.ts src/lib/seo/metadata-contracts.test.ts
```

Expected:

- all tests pass

- [ ] **Step 4: Run a fast safety build check**

Run:

```bash
bun run build
```

Expected:

- build completes without type or metadata serialization errors

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo/url.ts src/lib/structuredData.ts src/lib/seo/url.test.ts src/lib/seo/metadata-contracts.test.ts
git commit -m "fix: unify seo url and detail metadata"
```

## Task 3: Repair Locale Homepage Rendering And Locale-Level Metadata

**Files:**
- Modify: `messages/tr.json`
- Modify: `messages/ar.json`
- Modify: `src/app/[locale]/layout.tsx`
- Test: `src/lib/seo/metadata-contracts.test.ts`

- [ ] **Step 1: Write the failing locale translation coverage test**

Append to `src/lib/seo/metadata-contracts.test.ts`:

```ts
import trMessages from '../../../messages/tr.json'
import arMessages from '../../../messages/ar.json'

test('all homepage locales expose trustStats translations', () => {
  for (const messages of [trMessages, arMessages]) {
    expect(messages.trustStats.verified).toBeDefined()
    expect(messages.trustStats.supportDesc).toBeDefined()
  }
})
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
bun test src/lib/seo/metadata-contracts.test.ts -t "trustStats"
```

Expected:

- failure because `trustStats` is missing in `tr.json` and `ar.json`

- [ ] **Step 3: Add the missing `trustStats` namespace and align locale layout metadata**

Required changes:

- add `trustStats` to `messages/tr.json`
- add `trustStats` to `messages/ar.json`
- in `src/app/[locale]/layout.tsx`, replace hand-built alternates with helper-driven absolute alternates
- keep page-specific canonical behavior
- keep `og:site_name = 'DesireMap'`
- ensure homepage OG/Twitter images remain stable

- [ ] **Step 4: Run homepage-relevant checks**

Run:

```bash
bun test src/lib/seo/metadata-contracts.test.ts
bun run build
```

Expected:

- tests pass
- no `MISSING_MESSAGE`-related build failure

- [ ] **Step 5: Commit**

```bash
git add messages/tr.json messages/ar.json src/app/[locale]/layout.tsx src/lib/seo/metadata-contracts.test.ts
git commit -m "fix: restore locale home seo metadata"
```

## Task 4: Standardize Blog And Search Metadata Without Changing Routing

**Files:**
- Modify: `src/app/[locale]/blog/page.tsx`
- Modify: `src/app/[locale]/search/page.tsx`
- Test: `src/lib/seo/metadata-contracts.test.ts`

- [ ] **Step 1: Extend tests for blog index and search metadata**

Add cases like:

```ts
import { generateMetadata as generateBlogPageMetadata } from '@/app/[locale]/blog/page'
import { generateMetadata as generateSearchPageMetadata } from '@/app/[locale]/search/page'

test('blog index metadata emits absolute canonical and alternates', async () => {
  const metadata = await generateBlogPageMetadata({
    params: Promise.resolve({ locale: 'tr' })
  })
  expect(metadata.alternates?.canonical).toBe('https://desiremap.de/tr/blog')
  expect(metadata.openGraph?.siteName).toBe('DesireMap')
})

test('search metadata stays noindex but preserves absolute canonical', async () => {
  const metadata = await generateSearchPageMetadata({
    params: Promise.resolve({ locale: 'de' }),
    searchParams: Promise.resolve({ q: 'berlin' })
  })
  expect(metadata.robots).toEqual({ index: false, follow: true })
  expect(metadata.alternates?.canonical).toBe('https://desiremap.de/de/search?q=berlin')
})
```

- [ ] **Step 2: Run tests to verify current failures**

Run:

```bash
bun test src/lib/seo/metadata-contracts.test.ts
```

Expected:

- failure where blog alternates are relative
- possible failure where canonical generation is duplicated instead of helper-driven

- [ ] **Step 3: Refactor both route files to use the shared URL helper**

Required changes:

- `blog/page.tsx`: absolute canonical and absolute locale alternates
- `search/page.tsx`: absolute canonical that preserves query params, absolute locale alternates for the base search path, `noindex, follow` retained
- keep page content and route shape unchanged

- [ ] **Step 4: Run route-focused validation**

Run:

```bash
bun test src/lib/seo/metadata-contracts.test.ts
bun run build
```

Expected:

- tests pass
- build passes

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/blog/page.tsx src/app/[locale]/search/page.tsx src/lib/seo/metadata-contracts.test.ts
git commit -m "fix: standardize public metadata routes"
```

## Task 5: Publish Crawl Surfaces And Protect Non-Indexable Endpoints

**Files:**
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `next.config.ts`
- Create: `public/llms.txt`
- Test: `src/lib/seo/metadata-contracts.test.ts`

- [ ] **Step 1: Write the failing crawl-surface tests**

Add test cases that assert:

```ts
test('sitemap includes locale home, blog, and bordell URLs but excludes search/api/admin', () => {
  const entries = sitemap()
  expect(entries.some((entry) => entry.url === 'https://desiremap.de/de')).toBe(true)
  expect(entries.some((entry) => entry.url.includes('/search'))).toBe(false)
})
```

- [ ] **Step 2: Run the focused test to verify current failure**

Run:

```bash
bun test src/lib/seo/metadata-contracts.test.ts -t "sitemap"
```

Expected:

- failure because current sitemap only covers locale root pages

- [ ] **Step 3: Implement crawl-surface repair**

Required changes:

- `src/app/robots.ts`: keep current route, confirm sitemap and host are `https://desiremap.de`, keep `/api/` and admin disallow rules
- `src/app/sitemap.ts`: add blog listing, blog detail, and bordell detail URLs; exclude search/API/auth/admin
- `next.config.ts`: add `headers()` rules for `X-Robots-Tag: noindex, nofollow` on `/api/:path*`, admin routes, and auth routes
- `public/llms.txt`: add brand, domain, concise description, and primary public URLs

- [ ] **Step 4: Run build and header validation**

Run:

```bash
bun run build
bun run dev
curl -I http://127.0.0.1:3001/api/auth/config
curl http://127.0.0.1:3001/robots.txt
curl http://127.0.0.1:3001/sitemap.xml
curl http://127.0.0.1:3001/llms.txt
```

Expected:

- build passes
- `/api/auth/config` includes `X-Robots-Tag: noindex, nofollow`
- `robots.txt` returns sitemap reference
- `sitemap.xml` includes public locale pages
- `llms.txt` is reachable

- [ ] **Step 5: Commit**

```bash
git add src/app/robots.ts src/app/sitemap.ts next.config.ts public/llms.txt src/lib/seo/metadata-contracts.test.ts
git commit -m "fix: publish crawl surfaces and geo signals"
```

## Task 6: End-To-End Technical SEO And GEO Verification

**Files:**
- Modify: none expected
- Validate: running app and response headers

- [ ] **Step 1: Start the dev server**

Run:

```bash
bun run dev
```

Expected:

- app serves on `http://127.0.0.1:3001` or `http://localhost:3001`

- [ ] **Step 2: Verify locale rendering no longer crashes**

Open or curl:

```bash
curl http://127.0.0.1:3001/tr
curl http://127.0.0.1:3001/ar
```

Expected:

- no `MISSING_MESSAGE: trustStats` runtime error

- [ ] **Step 3: Verify public head output manually**

Inspect `<head>` on:

- `/de`
- `/en/blog`
- `/de/blog/premium-erotik-plattform`
- `/de/bordell/artemis-berlin`

Expected on each relevant page:

- page-specific absolute canonical
- absolute hreflang alternates
- `og:site_name` = `DesireMap`
- `og:url` matches canonical

- [ ] **Step 4: Verify index-control surfaces**

Run:

```bash
curl -I http://127.0.0.1:3001/api/auth/config
curl -I "http://127.0.0.1:3001/de/search?q=berlin"
curl http://127.0.0.1:3001/robots.txt
curl http://127.0.0.1:3001/sitemap.xml
curl http://127.0.0.1:3001/llms.txt
```

Expected:

- API/auth headers include `X-Robots-Tag: noindex, nofollow`
- search page remains `noindex, follow`
- robots, sitemap, and llms are reachable

- [ ] **Step 5: Confirm verification left no unexpected edits**

```bash
git status
```

Expected:

- no unexpected files modified by verification

## Reviewer Checklist

Use this before execution handoff:

- no task depends on a route redesign
- no task removes existing route structure
- tests fail before implementation and pass after implementation
- every metadata surface uses `https://desiremap.de`
- every public page keeps its own canonical URL
- search remains `noindex`
- API/auth/admin remain non-indexable
- `llms.txt` is published
- GEO identity is consistently `DesireMap`

## Spec Reference

- `docs/superpowers/specs/2026-04-06-technical-seo-repair-design.md`
