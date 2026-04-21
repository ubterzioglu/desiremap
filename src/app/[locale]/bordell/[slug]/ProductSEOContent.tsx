'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import type { ProductDetailData } from '@/lib/structuredData'
import { cn } from '@/lib/utils'
import { getSearchPath, getLocalizedPath, getVenuePath } from '@/lib/navigation'

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

  const hasLadiesCount = productData.ladiesCount > 0
  const hasReviewSection = productData.reviewCount > 0 || productData.reviews.length > 0
  const hasReviewEntries = productData.reviews.length > 0
  const hasFaq = productData.faq.length > 0
  const hasRelated = productData.relatedProducts.length > 0
  const hasContactInfo = Boolean(productData.phone) || Boolean(productData.email)
  const hasServices = productData.services.length > 0
  const hasMeaningfulOpeningHours =
    productData.openingHours.opens !== '00:00' ||
    productData.openingHours.closes !== '23:59' ||
    productData.openingHours.days.length !== 7
  const formattedPrice = productData.price > 0 ? `${productData.price.toFixed(2)}€` : 'Auf Anfrage'
  const introStats = [
    hasLadiesCount ? `Mit über ${productData.ladiesCount} Damen` : null,
    productData.ratingValue > 0 && productData.reviewCount > 0
      ? `mit einer Bewertung von ${productData.ratingValue} Sternen`
      : null
  ].filter((value): value is string => Boolean(value)).join(' und ')

  return (
    <div className="space-y-6 text-muted-foreground">
      <SectionShell className="bg-gradient-to-br from-primary/10 via-card/95 to-card">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Über {productData.name}?
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 speakable-description">
          <p className="text-[15px] leading-8 text-muted-foreground">
            {productData.name} ist ein renommierter {typeLabels[productData.type]} im {productData.city}er Rotlichtviertel.
            Als Teil des größten{' '}
            <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
              Bordellmarkt
            </Link>{' '}
            in Deutschland bietet dieser Betrieb höchste Standards in Diskretion und Servicequalität.
            {introStats && (
              <>
                {' '}{introStats} gehört {productData.name} zu den Top-Adressen auf dem{' '}
                <Link href={getSearchPath(locale, { category: productData.type })} className="text-primary hover:underline">
                  {typeLabels[productData.type]}-Markt
                </Link>.
              </>
            )}
          </p>
        </div>
      </SectionShell>

      <SectionShell>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Leistungen und Services im {typeLabels[productData.type]}
        </h2>
        <div className="mt-6 space-y-8">
          <div className="rounded-2xl border border-white/5 bg-background/35 p-5">
            <h3 className="text-xl font-semibold text-foreground">
              Hauptservices von {productData.name}
            </h3>
            {hasServices && (
              <div className="mt-4 flex flex-wrap gap-2 speakable-services">
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
            <div className="mt-4 max-w-3xl">
              <p className="text-[15px] leading-8 text-muted-foreground">
                Der {typeLabels[productData.type]} {productData.name} bietet ein umfangreiches Serviceportfolio.
                Zu den Hauptleistungen gehören: {productData.services.join(', ')}. Alle Services werden
                professionell und diskret auf dem{' '}
                <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
                  Bordellmarkt
                </Link>{' '}
                angeboten.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-background/35 p-5">
            <h3 className="text-xl font-semibold text-foreground">
              Preise und Eintritt
            </h3>
            <div className="mt-4 max-w-3xl">
              <p className="text-[15px] leading-8 text-muted-foreground">
                Die Preise in {productData.name} beginnen bei {formattedPrice}.
                Für detaillierte Preisinformationen empfehlen wir einen Besuch oder Anruf.
                Auf dem{' '}
                <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
                  Bordellmarkt
                </Link>{' '}
                finden Sie transparente Preisvergleiche aller Betriebe in {productData.city}.
              </p>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Lage und Erreichbarkeit
        </h2>
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-background/35 p-5">
            <h3 className="text-xl font-semibold text-foreground">
              Adresse von {productData.name}
            </h3>
            <div className="mt-4 max-w-3xl">
              <p className="text-[15px] leading-8 text-muted-foreground">
                {productData.name} befindet sich in {productData.address}. Der {typeLabels[productData.type]}
                ist zentral gelegen und gut mit öffentlichen Verkehrsmitteln erreichbar.
                Weitere {typeLabels[productData.type]} in{' '}
                <Link href={getSearchPath(locale, { city: productData.city })} className="text-primary hover:underline">
                  {productData.city}
                </Link>{' '}
                finden Sie auf dem Bordellmarkt.
              </p>
            </div>
          </div>

          {hasMeaningfulOpeningHours && (
            <div className="rounded-2xl border border-white/5 bg-background/35 p-5">
              <h3 className="text-xl font-semibold text-foreground">
                Öffnungszeiten
              </h3>
              <div className="mt-4 max-w-3xl">
                <p className="text-[15px] leading-8 text-muted-foreground">
                  {productData.name} hat folgende Öffnungszeiten: {productData.openingHours.opens} bis {productData.openingHours.closes} Uhr.
                  Der Betrieb ist {productData.openingHours.days.length} Tage die Woche geöffnet.
                  Aktuelle Öffnungszeiten finden Sie immer auf dem{' '}
                  <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
                    Bordellmarkt
                  </Link>.
                </p>
              </div>
            </div>
          )}
        </div>
      </SectionShell>

      <SectionShell>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Damen und Atmosphäre
        </h2>
        <div className="mt-6 space-y-4">
          {hasLadiesCount && (
            <div className="rounded-2xl border border-white/5 bg-background/35 p-5">
              <h3 className="text-xl font-semibold text-foreground">
                Damenauswahl in {productData.name}
              </h3>
              <div className="mt-4 max-w-3xl">
                <p className="text-[15px] leading-8 text-muted-foreground">
                  In {productData.name} arbeiten derzeit {productData.ladiesCount} Damen.
                  Die Auswahl umfasst verschiedene Nationalitäten und Serviceprofile.
                  Der {typeLabels[productData.type]} auf dem{' '}
                  <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
                    Bordellmarkt
                  </Link>{' '}
                  bietet detaillierte Profile und Bewertungen.
                </p>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/5 bg-background/35 p-5">
            <h3 className="text-xl font-semibold text-foreground">
              Ambiente und Ausstattung
            </h3>
            <div className="mt-4 max-w-3xl">
              <p className="text-[15px] leading-8 text-muted-foreground">
                Das Ambiente in {productData.name} ist elegant und diskret.
                Die Räumlichkeiten sind gepflegt und bieten privaten Rückzugsort.
                {productData.verified && (
                  <> Als verifizierter Betrieb auf dem{' '}
                    <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
                      Bordellmarkt
                    </Link>{' '}
                    erfüllt {productData.name} höchste Hygienestandards.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </SectionShell>

      {hasReviewSection && (
        <SectionShell>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Bewertungen und Erfahrungen
          </h2>
          <div className="mt-6 space-y-4">
            {productData.reviewCount > 0 && (
              <div className="rounded-2xl border border-white/5 bg-background/35 p-5">
                <h3 className="text-xl font-semibold text-foreground">
                  Gesamtbewertung auf dem Bordellmarkt
                </h3>
                <div className="mt-4 max-w-3xl">
                  <p className="text-[15px] leading-8 text-muted-foreground">
                    {productData.name} hat eine durchschnittliche Bewertung von {productData.ratingValue} Sternen
                    basierend auf {productData.reviewCount} Bewertungen auf dem{' '}
                    <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
                      Bordellmarkt
                    </Link>.
                    Kunden loben besonders die Professionalität und Diskretion.
                  </p>
                </div>
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
            {productData.faq.map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/5 bg-background/35 p-5">
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
            Ähnliche {typeLabels[productData.type]} auf dem Bordellmarkt
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {productData.relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={getVenuePath(locale, related.slug)}
                className="group rounded-2xl border border-white/5 bg-background/35 p-5 transition-colors hover:border-primary/40 hover:bg-background/55"
              >
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  {typeLabels[related.type]}
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
            Kontakt und Reservierung
          </h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/5 bg-background/35 p-5">
              <h3 className="text-xl font-semibold text-foreground">
                So erreichen Sie {productData.name}
              </h3>
              <div className="mt-4 max-w-3xl">
                <p className="text-[15px] leading-8 text-muted-foreground">
                  Für Reservierungen und Anfragen kontaktieren Sie {productData.name}
                  {productData.phone && <> telefonisch unter {productData.phone}</>}
                  {productData.email && <> oder per E-Mail an {productData.email}</>}.
                  Alternativ nutzen Sie die Reservierungsfunktion auf dem{' '}
                  <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
                    Bordellmarkt
                  </Link>.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-background/35 p-5">
              <h3 className="text-xl font-semibold text-foreground">
                Online-Reservierung auf dem Bordellmarkt
              </h3>
              <div className="mt-4 max-w-3xl">
                <p className="text-[15px] leading-8 text-muted-foreground">
                  Die Online-Reservierung über den{' '}
                  <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
                    Bordellmarkt
                  </Link>{' '}
                  bietet folgende Vorteile: Diskrete Buchung, automatische Bestätigung,
                  Prioritäts-Reservierung für Premium-Mitglieder und exklusive Rabatte.
                  Registrieren Sie sich kostenlos auf dem Bordellmarkt, um alle Funktionen zu nutzen.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>
      )}
    </div>
  )
}
