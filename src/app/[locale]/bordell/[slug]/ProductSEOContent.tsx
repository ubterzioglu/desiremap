'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import type { ProductDetailData } from '@/lib/structuredData'
import { cn } from '@/lib/utils'
import { getVenuePath } from '@/lib/navigation'

type ProductSEOContentProps = {
  productData: ProductDetailData
  locale: string
}

type SectionShellProps = {
  children: ReactNode
  className?: string
}

function SectionShell({ children, className }: SectionShellProps) {
  return (
    <section
      className={cn(
        'rounded-[28px] border border-border/60 bg-card/80 p-6 shadow-[0_24px_80px_-56px_rgba(0,0,0,0.85)] backdrop-blur-sm md:p-8',
        className
      )}
    >
      {children}
    </section>
  )
}

export function ProductSEOContent({ productData, locale }: ProductSEOContentProps) {
  const typeLabels: Record<string, string> = {
    fkk: 'FKK Club',
    laufhaus: 'Laufhaus',
    bordell: 'Bordell',
    studio: 'Studio',
    privat: 'Privat'
  }

  const typeLabel = typeLabels[productData.type] ?? productData.type
  const hasLadiesCount = productData.ladiesCount > 0
  const hasReviewSection = productData.reviewCount > 0 || productData.reviews.length > 0
  const hasReviewEntries = productData.reviews.length > 0
  const hasFaq = productData.faq.length > 0
  const hasRelated = productData.relatedProducts.length > 0
  const hasContactInfo = Boolean(productData.phone) || Boolean(productData.email) || Boolean(productData.website)
  const hasServices = productData.services.length > 0
  const customAboutText = productData.detailContent?.aboutText?.trim()
  const customServicesText = productData.detailContent?.servicesText?.trim()
  const customLadiesAtmosphereText = productData.detailContent?.ladiesAtmosphereText?.trim()
  const hasOpeningHours =
    productData.openingHours.days.length > 0 &&
    Boolean(productData.openingHours.opens) &&
    Boolean(productData.openingHours.closes)
  const hasServicesSection = hasServices || Boolean(customServicesText)
  const hasAtmosphereSection = Boolean(customLadiesAtmosphereText) || hasLadiesCount

  return (
    <div className="space-y-6 text-muted-foreground">
      {customAboutText && (
        <SectionShell className="bg-linear-to-br from-primary/10 via-card/95 to-card">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Über {productData.name}
          </h2>
          <div className="speakable-description mt-6 max-w-3xl space-y-4">
            <p className="text-[15px] leading-8 text-muted-foreground">{customAboutText}</p>
          </div>
        </SectionShell>
      )}

      {hasServicesSection && (
        <SectionShell>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Leistungen und Services
          </h2>
          <div className="mt-6 rounded-2xl border border-white/5 bg-background/35 p-5">
            <h3 className="text-xl font-semibold text-foreground">
              Services von {productData.name}
            </h3>
            {hasServices && (
              <div className="speakable-services mt-4 flex flex-wrap gap-2">
                {productData.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-sm text-foreground/90"
                  >
                    {service}
                  </span>
                ))}
              </div>
            )}
            {customServicesText && (
              <div className="mt-4 max-w-3xl">
                <p className="text-[15px] leading-8 text-muted-foreground">{customServicesText}</p>
              </div>
            )}
          </div>
        </SectionShell>
      )}

      {hasOpeningHours && (
        <SectionShell>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Öffnungszeiten
          </h2>
          <div className="mt-6 rounded-2xl border border-white/5 bg-background/35 p-5">
            <p className="text-[15px] leading-8 text-muted-foreground">
              {productData.openingHours.days.join(', ')}: {productData.openingHours.opens} bis {productData.openingHours.closes} Uhr.
            </p>
          </div>
        </SectionShell>
      )}

      {hasAtmosphereSection && (
        <SectionShell>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Damen und Atmosphäre
          </h2>
          <div className="mt-6 space-y-4">
            {customLadiesAtmosphereText && (
              <p className="text-[15px] leading-8 text-muted-foreground">
                {customLadiesAtmosphereText}
              </p>
            )}
            {hasLadiesCount ? (
              <div className="rounded-2xl border border-white/5 bg-background/35 p-5">
                <h3 className="text-xl font-semibold text-foreground">
                  Damenauswahl in {productData.name}
                </h3>
                <p className="mt-4 text-[15px] leading-8 text-muted-foreground">
                  In {productData.name} arbeiten derzeit {productData.ladiesCount} Damen.
                </p>
              </div>
            ) : null}
          </div>
        </SectionShell>
      )}

      {hasReviewSection && (
        <SectionShell>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Bewertungen und Erfahrungen
          </h2>
          <div className="mt-6 space-y-4">
            {productData.reviewCount > 0 && (
              <div className="rounded-2xl border border-white/5 bg-background/35 p-5">
                <h3 className="text-xl font-semibold text-foreground">
                  Gesamtbewertung
                </h3>
                <p className="mt-4 text-[15px] leading-8 text-muted-foreground">
                  {productData.name} hat eine durchschnittliche Bewertung von {productData.ratingValue} Sternen basierend auf {productData.reviewCount} Bewertungen.
                </p>
              </div>
            )}

            {hasReviewEntries && (
              <div className="rounded-2xl border border-white/5 bg-background/35 p-5">
                <h3 className="text-xl font-semibold text-foreground">
                  Erfahrungsberichte von Kunden
                </h3>
                <div className="mt-4 space-y-4">
                  {productData.reviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-border/60 bg-card/75 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{review.authorName}</span>
                        <span className="text-amber-400">{'★'.repeat(review.rating)}</span>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionShell>
      )}

      {hasFaq && (
        <SectionShell className="speakable-faq">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Häufig gestellte Fragen (FAQ)
          </h2>
          <div className="mt-6 grid gap-4">
            {productData.faq.map((item) => (
              <div key={item.question} className="rounded-2xl border border-white/5 bg-background/35 p-5">
                <h3 className="font-semibold text-foreground">
                  {item.question}
                </h3>
                <p className="mt-3 text-[15px] leading-8 text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {hasRelated && (
        <SectionShell>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Ähnliche {typeLabel}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {productData.relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={getVenuePath(locale, related.slug)}
                className="group rounded-2xl border border-white/5 bg-background/35 p-5 transition-colors hover:border-primary/40 hover:bg-background/55"
              >
                <p className="text-sm tracking-[0.18em] text-muted-foreground uppercase">
                  {typeLabels[related.type] ?? related.type}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                  {related.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {related.city}
                </p>
              </Link>
            ))}
          </div>
        </SectionShell>
      )}

      {hasContactInfo && (
        <SectionShell>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Kontakt
          </h2>
          <ul className="mt-6 space-y-3 rounded-2xl border border-white/5 bg-background/35 p-5 text-[15px] leading-8 text-muted-foreground">
            {productData.phone && <li>Telefon: {productData.phone}</li>}
            {productData.email && <li>E-Mail: {productData.email}</li>}
            {productData.website && (
              <li>
                Webseite:{' '}
                <a href={productData.website} className="text-primary hover:underline" rel="noreferrer" target="_blank">
                  {productData.website}
                </a>
              </li>
            )}
          </ul>
        </SectionShell>
      )}
    </div>
  )
}
