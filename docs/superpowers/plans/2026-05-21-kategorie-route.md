# /kategorie/[slug] Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `/kategorie/[slug]` category listing pages (e.g. `/kategorie/bordelle`) that show all venues for a given category with search + city filter.

**Architecture:** New Next.js server page at `src/app/[locale]/kategorie/[slug]/page.tsx` handles metadata + static params; a new `KategoriePageContent` client component owns the UI; a new `useKategoriePage` hook owns state/data (category locked to URL slug, city+query filterable).

**Tech Stack:** Next.js App Router, React Query (`usePublicEstablishments`), next-intl, existing `SearchResults` + `SearchFilters` components.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/app/[locale]/kategorie/[slug]/page.tsx` | Server: `generateStaticParams`, `generateMetadata`, JSON-LD, renders `KategoriePageContent` |
| Create | `src/components/kategorie/KategoriePageContent.tsx` | Client: hero, search bar, city dropdown, results grid |
| Create | `src/hooks/useKategoriePage.ts` | Data + URL state (category locked, query+city mutable) |

---

## Task 1: `useKategoriePage` hook

**Files:**
- Create: `src/hooks/useKategoriePage.ts`

- [ ] **Step 1: Create the hook**

```typescript
// src/hooks/useKategoriePage.ts
'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePublicEstablishments } from '@/hooks/useQueries'
import { getCategoryPath, getVenuePath } from '@/lib/navigation'
import { toListingCardBordell } from '@/lib/bordell-type'

export function useKategoriePage(
  locale: string,
  slug: string,
  initialQuery: string,
  initialCity: string,
) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [selectedCity, setSelectedCity] = useState(initialCity)

  const updateUrl = useCallback(
    (newQuery: string, newCity: string) => {
      const base = getCategoryPath(locale, slug)
      const params = new URLSearchParams()
      if (newQuery) params.set('q', newQuery)
      if (newCity) params.set('city', newCity)
      const qs = params.toString()
      router.push(qs ? `${base}?${qs}` : base, { scroll: false })
    },
    [locale, slug, router],
  )

  const handleSearch = useCallback(() => {
    updateUrl(query, selectedCity)
  }, [query, selectedCity, updateUrl])

  const handleCityChange = useCallback(
    (city: string) => {
      setSelectedCity(city)
      updateUrl(query, city)
    },
    [query, updateUrl],
  )

  const clearFilters = useCallback(() => {
    setQuery('')
    setSelectedCity('')
    router.push(getCategoryPath(locale, slug), { scroll: false })
  }, [locale, slug, router])

  const handleVenueClick = useCallback(
    (venue: { id: string }) => {
      router.push(getVenuePath(locale, venue.id))
    },
    [locale, router],
  )

  const { data: result, isLoading } = usePublicEstablishments({
    type: slug,
    ...(initialQuery ? { q: initialQuery } : {}),
    ...(initialCity ? { city: initialCity } : {}),
    limit: 50,
  })

  const allResults = (result?.items ?? []).map(toListingCardBordell)

  return {
    query,
    selectedCity,
    setQuery,
    handleSearch,
    handleCityChange,
    clearFilters,
    handleVenueClick,
    sponsoredResults: allResults.filter((b) => b.sponsored),
    regularResults: allResults.filter((b) => !b.sponsored),
    totalCount: allResults.length,
    isLoading,
  }
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep useKategoriePage
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useKategoriePage.ts
git commit -m "feat: add useKategoriePage hook"
```

---

## Task 2: `KategoriePageContent` client component

**Files:**
- Create: `src/components/kategorie/KategoriePageContent.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/kategorie/KategoriePageContent.tsx
'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SearchFilters } from '@/components/search/components/SearchFilters'
import { SearchResults } from '@/components/search/components/SearchResults'
import { useKategoriePage } from '@/hooks/useKategoriePage'

interface KategoriePageContentProps {
  locale: string
  slug: string
  categoryName: string
  initialQuery: string
  initialCity: string
}

export function KategoriePageContent({
  locale,
  slug,
  categoryName,
  initialQuery,
  initialCity,
}: KategoriePageContentProps) {
  const tNav = useTranslations('nav')
  const tSearch = useTranslations('search')

  const page = useKategoriePage(locale, slug, initialQuery, initialCity)

  const navTranslations = useMemo(
    () => ({
      home: tNav('home'),
      discover: tNav('discover'),
      cities: tNav('cities'),
      premium: tNav('premium'),
      advertise: tNav('advertise'),
      login: tNav('login'),
      register: tNav('register'),
      myAccount: tNav('myAccount'),
    }),
    [tNav],
  )

  const filterTranslations = useMemo(
    () => ({
      searchPlaceholder: tSearch('searchPlaceholder'),
      selectCity: tSearch('selectCity'),
      allCities: tSearch('allCities'),
      filters: tSearch('filters'),
      clearFilters: tSearch('clearFilters'),
    }),
    [tSearch],
  )

  const resultsTranslations = useMemo(
    () => ({
      found: tSearch('found'),
      sponsored: tSearch('sponsored'),
      premium: tSearch('premium'),
      noResults: tSearch('noResults'),
      noResultsHint: tSearch('noResultsHint'),
      clearFilters: tSearch('clearFilters'),
    }),
    [tSearch],
  )

  const homeHref = locale === 'de' ? '/' : `/${locale}`

  return (
    <div className="min-h-screen bg-black">
      <Header
        locale={locale}
        onLoginClick={() => { window.location.href = `/${locale}/login` }}
        isLoggedIn={false}
        onDashboardClick={() => { window.location.href = `/${locale}/dashboard` }}
        translations={navTranslations}
      />

      <div className="pt-24">
        <section className="relative overflow-hidden bg-[#060e20] py-16">
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <Button
              onClick={() => { window.location.href = homeHref }}
              variant="ghost"
              className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              Zurück
            </Button>

            <h1 className="mb-8 text-4xl font-bold text-white sm:text-5xl">
              {categoryName}
            </h1>

            <SearchFilters
              query={page.query}
              selectedCity={page.selectedCity}
              selectedCategory={slug}
              translations={filterTranslations}
              onQueryChange={page.setQuery}
              onSearch={page.handleSearch}
              onCityChange={page.handleCityChange}
              onCategoryChange={() => {}}
              onClearFilters={page.clearFilters}
            />
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6">
            <SearchResults
              sponsoredResults={page.sponsoredResults}
              regularResults={page.regularResults}
              totalCount={page.totalCount}
              isLoading={page.isLoading}
              translations={resultsTranslations}
              locale={locale}
              onBordellClickAction={page.handleVenueClick}
              onClearFiltersAction={page.clearFilters}
            />
          </div>
        </section>
      </div>

      <Footer locale={locale} />
    </div>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep -i kategorie
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/kategorie/KategoriePageContent.tsx
git commit -m "feat: add KategoriePageContent client component"
```

---

## Task 3: Server page

**Files:**
- Create: `src/app/[locale]/kategorie/[slug]/page.tsx`

Note: `dangerouslySetInnerHTML` below is safe — content is `JSON.stringify` of server-generated data, never from user input.

- [ ] **Step 1: Create the page**

```typescript
// src/app/[locale]/kategorie/[slug]/page.tsx
import type { Metadata } from 'next'
import { publicApi } from '@/lib/api'
import { KategoriePageContent } from '@/components/kategorie/KategoriePageContent'

const LOCALES = ['de', 'en', 'ar', 'tr']
const SITE_URL = 'https://desiremap.de'

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return []

  const { items: serviceTypes } = await publicApi.getServiceTypes()
  return serviceTypes.flatMap((type) =>
    LOCALES.map((locale) => ({ locale, slug: type.slug })),
  )
}

async function getCategory(slug: string) {
  const { items } = await publicApi.getServiceTypes()
  return items.find((t) => t.slug === slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const category = await getCategory(slug)
  const categoryName = category?.name ?? slug

  const title = `${categoryName} in Deutschland — desiremap.de`
  const description = `Alle ${categoryName} in Deutschland auf desiremap.de entdecken. Verified listings, Bewertungen und Details.`
  const canonicalPath = locale === 'de' ? `/kategorie/${slug}` : `/${locale}/kategorie/${slug}`
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        de: `${SITE_URL}/kategorie/${slug}`,
        en: `${SITE_URL}/en/kategorie/${slug}`,
        tr: `${SITE_URL}/tr/kategorie/${slug}`,
        ar: `${SITE_URL}/ar/kategorie/${slug}`,
      },
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName: 'DesireMap',
      images: [{ url: `${SITE_URL}/hero-bg.jpg`, width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true },
  }
}

export default async function KategoriePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ q?: string; city?: string }>
}) {
  const { locale, slug } = await params
  const { q = '', city = '' } = await searchParams

  const category = await getCategory(slug)
  const categoryName = category?.name ?? slug

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryName} in Deutschland`,
    description: `Alle ${categoryName} auf desiremap.de`,
    url: `${SITE_URL}${locale === 'de' ? '' : `/${locale}`}/kategorie/${slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <KategoriePageContent
        locale={locale}
        slug={slug}
        categoryName={categoryName}
        initialQuery={q}
        initialCity={city}
      />
    </>
  )
}
```

- [ ] **Step 2: Full TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/kategorie/
git commit -m "feat: add /kategorie/[slug] server page with metadata and JSON-LD"
```

---

## Task 4: Verify

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open `http://localhost:3000/kategorie/bordelle` — expect: page with "Bordelle" heading, search bar, city dropdown, venue grid or loading skeleton.

- [ ] **Step 2: Unknown slug → 404**

Open `http://localhost:3000/kategorie/unknown-xyz` — expect: Next.js 404, no crash.

- [ ] **Step 3: i18n locale**

Open `http://localhost:3000/en/kategorie/bordelle` — expect: same page, English nav labels.

- [ ] **Step 4: Production build**

```bash
npm run build 2>&1 | tail -40
```

Expected: build succeeds, `/kategorie/[slug]` appears in route output.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: /kategorie/[slug] category listing pages complete"
```
