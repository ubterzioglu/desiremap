'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useTranslations } from 'next-intl'
import { SearchFilters } from './components/SearchFilters'
import { SearchResults } from './components/SearchResults'
import { useSearchPage } from './hooks/useSearchPage'

type SearchPageContentProps = {
  locale: string
  initialQuery: string
  initialCity: string
  initialCategory: string
}

export function SearchPageContent({ locale, initialQuery, initialCity, initialCategory }: SearchPageContentProps) {
  const t = useTranslations('search')
  const tNav = useTranslations('nav')

  const searchState = useSearchPage(locale, initialQuery, initialCity, initialCategory)

  const navTranslations = useMemo(() => ({
    home: tNav('home'),
    discover: tNav('discover'),
    cities: tNav('cities'),
    premium: tNav('premium'),
    advertise: tNav('advertise'),
    login: tNav('login'),
    register: tNav('register'),
    myAccount: tNav('myAccount')
  }), [tNav])

  const filterTranslations = useMemo(() => ({
    searchPlaceholder: t('searchPlaceholder'),
    selectCity: t('selectCity'),
    allCities: t('allCities'),
    filters: t('filters'),
    clearFilters: t('clearFilters')
  }), [t])

  const resultsTranslations = useMemo(() => ({
    found: t('found'),
    sponsored: t('sponsored'),
    premium: t('premium'),
    noResults: t('noResults'),
    noResultsHint: t('noResultsHint'),
    clearFilters: t('clearFilters')
  }), [t])

  return (
    <div className="min-h-screen bg-[#0b1326]">
      <Header
        locale={locale}
        onLoginClick={() => window.location.href = `/${locale}/login`}
        isLoggedIn={false}
        onDashboardClick={() => window.location.href = `/${locale}/dashboard`}
        translations={navTranslations}
      />
      <div className="pt-24">
        {/* Search Page Header */}
        <section className="relative overflow-hidden border-b border-[#2d3449] py-32">
          <div aria-hidden="true" className="absolute inset-0">
            <Image src="/search-bg.jpg" alt={t('results')} fill className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#8b1a4a]/10 to-[#0b1326]" />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <Button
              onClick={() => window.location.href = `/${locale}`}
              variant="ghost"
              className="mb-12 flex items-center gap-2 text-[#a48a90] hover:text-[#dae2fd]"
            >
              <ArrowLeft className="h-5 w-5" />
              {t('backToHome')}
            </Button>
            <h1
              className="mb-12 text-5xl font-bold text-[#dae2fd] sm:text-6xl"
              style={{ letterSpacing: '-0.02em' }}
            >
              {t('results')}
            </h1>
            <SearchFilters
              query={searchState.query}
              selectedCity={searchState.selectedCity}
              selectedCategory={searchState.selectedCategory}
              translations={filterTranslations}
              onQueryChange={searchState.setQuery}
              onSearch={searchState.handleSearch}
              onCityChange={searchState.handleCityChange}
              onCategoryChange={searchState.handleCategoryChange}
              onClearFilters={searchState.clearFilters}
            />
          </div>
        </section>
        {/* Search Results Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <SearchResults
              sponsoredResults={searchState.sponsoredResults}
              regularResults={searchState.regularResults}
              totalCount={searchState.searchResults.length}
              translations={resultsTranslations}
              locale={locale}
              onClearFiltersAction={searchState.clearFilters}
            />
          </div>
        </section>
      </div>
      <Footer locale={locale} />
    </div>
  )
}
