'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ReservationModal } from '@/components/listings/ReservationModal'
import { ProductSEOContent } from './ProductSEOContent'
import type { Bordell } from '@/types'
import type { ProductDetailData } from '@/lib/structuredData'
import { getSearchPath, getLocalizedPath } from '@/lib/navigation'

type ProductDetailPageContentProps = {
  bordell: Bordell
  productData: ProductDetailData
  locale: string
}

export function ProductDetailPageContent({
  bordell,
  productData,
  locale
}: ProductDetailPageContentProps) {
  const router = useRouter()
  const t = useTranslations('listing')
  const tNav = useTranslations('nav')
  const [isReservationOpen, setIsReservationOpen] = useState(false)
  const navTranslations = useMemo(() => ({
    discover: tNav('discover'),
    cities: tNav('cities'),
    premium: tNav('premium'),
    advertise: tNav('advertise'),
    login: tNav('login'),
    register: tNav('register'),
    myAccount: tNav('myAccount')
  }), [tNav])

  const typeLabels: Record<string, string> = {
    fkk: 'FKK Club',
    laufhaus: 'Laufhaus',
    bordell: 'Bordell',
    studio: 'Studio',
    privat: 'Privat'
  }

  const hasPhone = Boolean(bordell.phone)
  const hasOpeningHours = Boolean(bordell.openHours.trim())
  const hasContactInfo = hasPhone || Boolean(bordell.email) || Boolean(bordell.website)
  const featuredServices = bordell.services.slice(0, 6)
  const priceLabel = bordell.minPrice > 0 ? `ab ${bordell.minPrice}€` : bordell.priceRange
  const overviewItems = [
    {
      label: t('price'),
      value: priceLabel
    },
    {
      label: 'Stadt',
      value: bordell.city
    },
    hasPhone ? {
      label: 'Kontakt',
      value: bordell.phone
    } : null,
    hasOpeningHours ? {
      label: 'Öffnungszeiten',
      value: bordell.openHours
    } : null
  ].filter((item): item is { label: string; value: string } => item !== null)
  const infoItems = [
    {
      label: 'Typ',
      value: typeLabels[bordell.type]
    },
    bordell.ladiesCount > 0 ? {
      label: t('ladies'),
      value: String(bordell.ladiesCount)
    } : null,
    {
      label: 'Stadt',
      value: bordell.city
    },
    hasOpeningHours ? {
      label: 'Öffnungszeiten',
      value: bordell.openHours
    } : null
  ].filter((item): item is { label: string; value: string } => item !== null)

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(getSearchPath(locale, { city: bordell.city }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        locale={locale}
        onLoginClick={() => router.push(getLocalizedPath(locale, '/login'))}
        isLoggedIn={false}
        onDashboardClick={() => router.push(getLocalizedPath(locale, '/dashboard'))}
        translations={navTranslations}
      />

      {/* Hero Section */}
      <section
        className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bordell.coverImage || '/listing-bg.jpg'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-28 pb-10">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="mb-6 border-white/20 bg-black/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>

          <div className="text-center max-w-4xl mx-auto">
          {/* Breadcrumb */}
            <nav className="text-sm text-white/70 mb-4">
              <Link href={getLocalizedPath(locale, '/')} className="hover:text-white">Home</Link>
            {' / '}
              <Link href={getSearchPath(locale, { city: bordell.city })} className="hover:text-white">{bordell.city}</Link>
            {' / '}
              <Link href={getSearchPath(locale, { category: bordell.type })} className="hover:text-white">{typeLabels[bordell.type]}</Link>
            {' / '}
              <span className="text-white">{bordell.name}</span>
            </nav>

            {/* H1 - Only one H1 per page */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {bordell.name}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-2">
              {typeLabels[bordell.type]} in {bordell.city}
            </p>

            <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-sm">
              {bordell.verified && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-emerald-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('verified')}
                </span>
              )}
              {bordell.premium && (
                <span className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-amber-100">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {t('premium')}
                </span>
              )}
              {hasOpeningHours && (
                <span className={bordell.isOpen
                  ? 'rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-emerald-200'
                  : 'rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-white/80'}
                >
                  {bordell.isOpen ? t('open') : t('closed')} - {bordell.openHours}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                onClick={() => setIsReservationOpen(true)}
              >
                {t('reserve')}
              </Button>
              {hasPhone && (
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  {bordell.phone}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-12 max-w-7xl px-4">
        <div className="rounded-[32px] border border-white/10 bg-background/95 p-6 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.9)] backdrop-blur">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.9fr)]">
            <div className="space-y-5">
              {bordell.description && (
                <p className="max-w-3xl text-base leading-8 text-muted-foreground">
                  {bordell.description}
                </p>
              )}

              {featuredServices.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {featuredServices.map((service) => (
                    <span
                      key={service}
                      className="rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-sm text-foreground/90"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {overviewItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/60 bg-card/70 px-4 py-4"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16 pt-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Left Column - Main Info */}
          <div className="space-y-6">
            {/* SEO Content Section */}
            <ProductSEOContent productData={productData} locale={locale} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Price Card */}
            <Card className="rounded-[28px] border-white/10 bg-gradient-to-br from-white/[0.05] via-background to-background shadow-[0_30px_90px_-60px_rgba(0,0,0,0.85)]">
              <CardHeader>
                <CardTitle>{t('price')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">
                  {priceLabel}
                </div>
                <p className="text-sm text-muted-foreground">{bordell.priceRange}</p>
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600"
                  onClick={() => setIsReservationOpen(true)}
                >
                  {t('reserve')}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="rounded-[28px] border-white/10 bg-white/[0.03] shadow-[0_30px_90px_-60px_rgba(0,0,0,0.85)]">
              <CardHeader>
                <CardTitle>Informationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-right font-medium">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Card */}
            {hasContactInfo && (
              <Card className="rounded-[28px] border-white/10 bg-white/[0.03] shadow-[0_30px_90px_-60px_rgba(0,0,0,0.85)]">
                <CardHeader>
                  <CardTitle>Kontakt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hasPhone && (
                    <a href={`tel:${bordell.phone}`} className="block text-primary hover:underline">
                      {bordell.phone}
                    </a>
                  )}
                  {bordell.email && (
                    <a href={`mailto:${bordell.email}`} className="block text-primary hover:underline text-sm">
                      {bordell.email}
                    </a>
                  )}
                  {bordell.website && (
                    <a href={bordell.website} target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline text-sm">
                      Website besuchen
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      <ReservationModal
        open={isReservationOpen}
        onOpenChange={setIsReservationOpen}
        bordell={bordell}
      />
      <Footer locale={locale} />
    </div>
  )
}
