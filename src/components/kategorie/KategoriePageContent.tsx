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
