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

const TYPE_META: Record<string, { label: string; intro: string; what: string }> = {
  fkk: {
    label: 'FKK Club',
    intro: 'FKK Clubs (Freikörperkultur) sind in Deutschland lizenzierte Einrichtungen, die ihren Gästen eine entspannte Atmosphäre aus Wellness, Sauna und Lifestyle bieten.',
    what: 'In einem FKK Club können Besucher neben Sauna- und Wellnessbereichen auch eine Bar sowie Lounge-Bereiche genießen. Die Atmosphäre ist diskret und auf höchsten Komfort ausgerichtet. FKK Clubs zählen zu den beliebtesten Einrichtungen ihrer Art in Deutschland und legen großen Wert auf Sauberkeit, Diskretion und einen angenehmen Aufenthalt für alle Gäste. Sexuelle Dienstleistungen werden von selbständig tätigen Damen angeboten und sind von den Clubgebühren getrennt. Alle Betriebe unterliegen dem deutschen Prostituiertenschutzgesetz und müssen strenge gesundheitliche sowie sicherheitstechnische Standards erfüllen.',
  },
  laufhaus: {
    label: 'Laufhaus',
    intro: 'Laufhäuser sind in Deutschland legale Einrichtungen, in denen Sexarbeiterinnen selbständig tätig sind und eigene Räumlichkeiten mieten.',
    what: 'Der Begriff "Laufhaus" beschreibt mehrstöckige Gebäude, in denen Besucher die verschiedenen Etagen begehen und direkt mit den Damen Kontakt aufnehmen können. Laufhäuser sind durch das Prostituiertenschutzgesetz reguliert und unterliegen regelmäßigen Kontrollen durch Gesundheits- und Ordnungsbehörden. Jede Sexarbeiterin ist selbständig tätig, angemeldet und arbeitet auf eigene Rechnung. Die Nutzung eines Laufhauses ist für Besucher in der Regel kostenlos – Vereinbarungen werden direkt mit den Damen getroffen.',
  },
  bordell: {
    label: 'Bordell',
    intro: 'Bordelle sind in Deutschland lizenzierte Betriebe, in denen sexuelle Dienstleistungen unter geregelten und gesetzlichen Bedingungen angeboten werden.',
    what: 'Als lizenzierter Betrieb unterliegt ein Bordell der staatlichen Kontrolle und muss gesundheitliche sowie sicherheitstechnische Mindeststandards erfüllen. Bordelle bieten ihren Gästen eine diskrete und professionelle Umgebung. Alle tätigen Personen sind beim Finanzamt registriert und erfüllen die Meldepflichten nach dem Prostituiertenschutzgesetz. Seriöse Bordelle legen großen Wert auf die Gesundheit und das Wohlergehen der beschäftigten Damen sowie auf den Komfort und die Sicherheit der Gäste.',
  },
  studio: {
    label: 'Studio',
    intro: 'Studios sind kleinere, privat geführte Einrichtungen, in denen individuelle Dienstleistungen in einem diskreten und persönlichen Rahmen angeboten werden.',
    what: 'Im Gegensatz zu größeren Clubs oder Laufhäusern zeichnen sich Studios durch eine persönlichere Atmosphäre und überschaubare Größe aus. Studios bieten häufig ein breites Spektrum an Massagen und anderen körperbezogenen Dienstleistungen an. Die Betreiberinnen oder Betreiber legen besonderen Wert auf eine angenehme, ruhige Atmosphäre und individuelle Betreuung der Gäste.',
  },
  privat: {
    label: 'Privatadresse',
    intro: 'Private Adressen bieten eine besonders diskrete, intime und persönliche Atmosphäre für Gäste, die Wert auf absolute Privatsphäre legen.',
    what: 'Private Adressen sind meist kleinere Einheiten, die auf Qualität und Diskretion ausgerichtet sind. Im Vergleich zu größeren Betrieben steht hier die individuelle Betreuung im Vordergrund. Gäste schätzen die ruhige Umgebung, die persönliche Note und die Flexibilität in der Terminvereinbarung. Private Adressen unterliegen ebenfalls den gesetzlichen Anforderungen des Prostituiertenschutzgesetzes.',
  },
}

function FallbackAboutSection({ productData }: { productData: ProductDetailData }) {
  const meta = TYPE_META[productData.type] ?? TYPE_META.bordell!
  const hasServices = productData.services.length > 0
  const hasPricing = productData.price > 0
  const hasRating = productData.ratingValue > 0 && productData.reviewCount > 0
  const isVerified = productData.verified

  return (
    <SectionShell className="bg-linear-to-br from-primary/10 via-card/95 to-card">
      <h2 className="text-2xl font-bold text-foreground md:text-3xl">
        Über {productData.name}
      </h2>
      <div className="speakable-description mt-6 max-w-3xl space-y-6 text-[15px] leading-8 text-muted-foreground">
        <p>
          <strong className="text-foreground">{productData.name}</strong> ist ein {meta.label} in <strong className="text-foreground">{productData.city}</strong>, Deutschland.{' '}
          {isVerified
            ? `Der Betrieb ist auf DesireMap verifiziert und erfüllt alle gesetzlichen Anforderungen nach dem deutschen Prostituiertenschutzgesetz.`
            : `Der Betrieb ist auf DesireMap gelistet und bietet Gästen eine zuverlässige Anlaufstelle in ${productData.city}.`}
          {hasRating && ` Mit einer Durchschnittsbewertung von ${productData.ratingValue} Sternen bei ${productData.reviewCount} Bewertungen zählt ${productData.name} zu den gut bewerteten Adressen der Region.`}
        </p>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-foreground">Was ist ein {meta.label}?</h3>
          <p>{meta.intro}</p>
          <p className="mt-3">{meta.what}</p>
        </div>

        {hasServices && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-foreground">Angebote in {productData.name}</h3>
            <p>
              {productData.name} bietet seinen Gästen ein vielfältiges Angebot. Zu den angebotenen Services zählen unter anderem:{' '}
              <strong className="text-foreground">{productData.services.slice(0, 6).join(', ')}</strong>
              {productData.services.length > 6 ? ` sowie weitere Leistungen` : ''}.
            </p>
          </div>
        )}

        <div>
          <h3 className="mb-3 text-lg font-semibold text-foreground">{productData.city} als Standort</h3>
          <p>
            {productData.city} gehört zu den bedeutenden Städten Deutschlands und bietet eine gut ausgebaute Infrastruktur für Besucher aus dem ganzen Land und dem Ausland.
            Die Lage von {productData.name} in {productData.city} ermöglicht eine bequeme Anreise mit öffentlichen Verkehrsmitteln oder dem eigenen Fahrzeug.
            Die Stadt selbst bietet zahlreiche Übernachtungsmöglichkeiten für Gäste, die von weiter anreisen.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-foreground">Qualität und Vertrauen</h3>
          <p>
            Auf DesireMap werden ausschließlich Betriebe gelistet, die unsere Qualitätsstandards erfüllen.
            {isVerified
              ? ` ${productData.name} hat das Verifizierungsverfahren von DesireMap erfolgreich durchlaufen. Verifizierte Betriebe werden regelmäßig auf Aktualität ihrer Angaben geprüft.`
              : ` Alle Profilinformationen werden von uns regelmäßig auf Richtigkeit überprüft, um Besuchern zuverlässige Informationen zur Verfügung zu stellen.`}
            {' '}Sämtliche in Deutschland tätigen Einrichtungen dieser Art unterliegen dem Prostituiertenschutzgesetz (ProstSchG), das seit 2017 strenge Anforderungen an Betreiber und tätige Personen stellt.
          </p>
        </div>

        {hasPricing && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-foreground">Preise und Konditionen</h3>
            <p>
              Der Einstiegspreis bei {productData.name} beginnt ab <strong className="text-foreground">{productData.price} €</strong>.
              {productData.price > 0 && ' Die genauen Preise für einzelne Leistungen können vor Ort erfragt werden.'}
              {' '}Für aktuelle Preisinformationen empfehlen wir, direkt Kontakt mit dem Betrieb aufzunehmen.
            </p>
          </div>
        )}

        <div>
          <h3 className="mb-3 text-lg font-semibold text-foreground">So besuchst du {productData.name}</h3>
          <p>
            Für einen Besuch bei {productData.name} empfehlen wir, sich vorab über die aktuellen Öffnungszeiten zu informieren.
            {productData.phone ? ` Du erreichst den Betrieb telefonisch unter ${productData.phone}.` : ''}
            {' '}Für die Anreise bietet sich sowohl der öffentliche Nahverkehr als auch das eigene Fahrzeug an.
            Bitte beachte, dass der Zutritt ausschließlich Personen ab 18 Jahren gestattet ist und ein gültiger Lichtbildausweis verlangt werden kann.
            Für Erstbesucher empfiehlt es sich, sich im Voraus über das Angebot und die Hausregeln des Betriebs zu informieren.
          </p>
        </div>
      </div>
    </SectionShell>
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
      {customAboutText ? (
        <SectionShell className="bg-linear-to-br from-primary/10 via-card/95 to-card">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Über {productData.name}
          </h2>
          <div className="speakable-description mt-6 max-w-3xl space-y-4">
            <p className="text-[15px] leading-8 text-muted-foreground">{customAboutText}</p>
          </div>
        </SectionShell>
      ) : (
        <FallbackAboutSection productData={productData} />
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
