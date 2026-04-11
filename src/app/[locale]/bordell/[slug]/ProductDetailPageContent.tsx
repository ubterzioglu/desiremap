'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  const t = useTranslations('listing')
  const [isReservationOpen, setIsReservationOpen] = useState(false)

  const typeLabels: Record<string, string> = {
    fkk: 'FKK Club',
    laufhaus: 'Laufhaus',
    bordell: 'Bordell',
    studio: 'Studio',
    privat: 'Privat'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bordell.coverImage || '/covers/default-bg.jpg'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
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

          <div className="flex items-center justify-center gap-4 text-white/80 text-sm mb-6">
            {bordell.verified && (
              <span className="flex items-center gap-1 text-green-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t('verified')}
              </span>
            )}
            {bordell.premium && (
              <span className="flex items-center gap-1 text-amber-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {t('premium')}
              </span>
            )}
            <span className={bordell.isOpen ? 'text-green-400' : 'text-red-400'}>
              {bordell.isOpen ? t('open') : t('closed')} - {bordell.openHours}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              onClick={() => setIsReservationOpen(true)}
            >
              {t('reserve')}
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              {bordell.phone}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{bordell.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({bordell.reviewCount} {t('reviews')})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="speakable-description">
                <p className="text-muted-foreground leading-relaxed">
                  {bordell.description}
                </p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent className="speakable-services">
                <div className="flex flex-wrap gap-2">
                  {bordell.services.map((service) => (
                    <span
                      key={service}
                      className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SEO Content Section */}
            <ProductSEOContent productData={productData} locale={locale} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('price')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">
                  ab {bordell.minPrice}€
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
            <Card>
              <CardHeader>
                <CardTitle>Informationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Typ</span>
                  <span className="font-medium">{typeLabels[bordell.type]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('ladies')}</span>
                  <span className="font-medium">{bordell.ladiesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stadt</span>
                  <span className="font-medium">{bordell.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Öffnungszeiten</span>
                  <span className="font-medium">{bordell.openHours}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Kontakt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href={`tel:${bordell.phone}`} className="block text-primary hover:underline">
                  {bordell.phone}
                </a>
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
          </div>
        </div>

        {/* Related Products - Internal Linking */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            Ähnliche {typeLabels[bordell.type]} in {bordell.city}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productData.relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={getLocalizedPath(locale, `/bordell/${related.slug}`)}
                className="group block p-4 bg-card rounded-lg border hover:border-primary/50 transition-colors"
              >
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {related.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {typeLabels[related.type]} - {related.city}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Reservation Modal */}
      <ReservationModal
        open={isReservationOpen}
        onOpenChange={setIsReservationOpen}
        bordell={bordell}
      />
    </div>
  )
}
