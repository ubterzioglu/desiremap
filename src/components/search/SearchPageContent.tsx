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
    discover: tNav('discover'), cities: tNav('cities'), premium: tNav('premium'),
    advertise: tNav('advertise'), login: tNav('login'), register: tNav('register'), myAccount: tNav('myAccount')
  }), [tNav])

  const filterTranslations = useMemo(() => ({
    searchPlaceholder: t('searchPlaceholder'), selectCity: t('selectCity'), allCities: t('allCities'),
    filters: t('filters'), clearFilters: t('clearFilters')
  }), [t])

  const resultsTranslations = useMemo(() => ({
    found: t('found'), sponsored: t('sponsored'), premium: t('premium'),
    noResults: t('noResults'), noResultsHint: t('noResultsHint'), clearFilters: t('clearFilters')
  }), [t])

  return (
    <div className="min-h-screen bg-black">
      <Header locale={locale} onLoginClick={() => window.location.href = `/${locale}/login`} isLoggedIn={false} onDashboardClick={() => window.location.href = `/${locale}/dashboard`} translations={navTranslations} />
      <div className="pt-24">
        {/* Search Page Üst kısım */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/search-bg.jpg" alt="" fill className="w-full h-full object-cover" />
            <div className="absolute inset-0 backdrop-blur-sm bg-black/5" />
            <div className="absolute inset-0 bg-linear-to-b from-[#8b1a4a]/5 to-transparent" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <Button onClick={() => window.location.href = `/${locale}`} variant="ghost" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"><ArrowLeft className="w-5 h-5" />{t('backToHome')}</Button>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">{t('results')}</h1>
            <SearchFilters query={searchState.query} selectedCity={searchState.selectedCity} selectedCategory={searchState.selectedCategory} translations={filterTranslations} onQueryChange={searchState.setQuery} onSearch={searchState.handleSearch} onCityChange={searchState.handleCityChange} onCategoryChange={searchState.handleCategoryChange} onClearFilters={searchState.clearFilters} />
          </div>
        </section>
        {/* Search page arama sonuçları kısım */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <SearchResults sponsoredResults={searchState.sponsoredResults} regularResults={searchState.regularResults} totalCount={searchState.searchResults.length} isLoading={searchState.isLoading} translations={resultsTranslations} onBordellClick={searchState.handleBordellClick} onClearFilters={searchState.clearFilters} />
          </div>
        </section>
      </div>
      <Footer locale={locale} />
    </div>
  )
}
