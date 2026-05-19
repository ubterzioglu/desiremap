'use client'

import Link from 'next/link'
import type { ProductDetailData } from '@/lib/structuredData'
import { getSearchPath, getLocalizedPath, getVenuePath } from '@/lib/navigation'

type ProductSEOContentProps = {
  productData: ProductDetailData
  locale: string
}

export function ProductSEOContent({ productData, locale }: ProductSEOContentProps) {
  const typeLabels: Record<string, string> = {
    fkk: 'FKK Club',
    laufhaus: 'Laufhaus',
    bordell: 'Bordell',
    studio: 'Studio',
    privat: 'Privat'
  }

  return (
    <div className="space-y-8 text-muted-foreground">
      {/* H2: Was ist...? */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Was ist {productData.name}?
        </h2>
        <div className="speakable-description prose max-w-none prose-invert">
          <p className="leading-relaxed">
            {productData.name} ist ein renommierter {typeLabels[productData.type]} im {productData.city}er Rotlichtviertel.
            Als Teil des größten{' '}
            <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
              Bordellmarkt
            </Link>{' '}
            in Deutschland bietet dieser Betrieb höchste Standards in Diskretion und Servicequalität.
            Mit über {productData.ladiesCount} Damen und einer Bewertung von {productData.ratingValue} Sternen
            gehört {productData.name} zu den Top-Adressen auf dem{' '}
            <Link href={getSearchPath(locale, { category: productData.type })} className="text-primary hover:underline">
              {typeLabels[productData.type]}-Markt
            </Link>.
          </p>
        </div>
      </section>

      {/* H2: Leistungen und Services */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Leistungen und Services im {typeLabels[productData.type]}
        </h2>

        {/* H3: Hauptservices */}
        <h3 className="mb-3 text-xl font-semibold text-foreground">
          Hauptservices von {productData.name}
        </h3>
        <div className="speakable-services prose mb-6 max-w-none prose-invert">
          <p className="leading-relaxed">
            Der {typeLabels[productData.type]} {productData.name} bietet ein umfangreiches Serviceportfolio.
            Zu den Hauptleistungen gehören: {productData.services.join(', ')}. Alle Services werden
            professionell und diskret auf dem{' '}
            <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
              Bordellmarkt
            </Link>{' '}
            angeboten.
          </p>
        </div>

        {/* H3: Preise */}
        <h3 className="mb-3 text-xl font-semibold text-foreground">
          Preise und Eintritt
        </h3>
        <div className="prose max-w-none prose-invert">
          <p className="leading-relaxed">
            Die Preise in {productData.name} beginnen bei {productData.price.toFixed(2)}€.
            Für detaillierte Preisinformationen empfehlen wir einen Besuch oder Anruf.
            Auf dem{' '}
            <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
              Bordellmarkt
            </Link>{' '}
            finden Sie transparente Preisvergleiche aller Betriebe in {productData.city}.
          </p>
        </div>
      </section>

      {/* H2: Lage und Erreichbarkeit */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Lage und Erreichbarkeit
        </h2>

        {/* H3: Adresse */}
        <h3 className="mb-3 text-xl font-semibold text-foreground">
          Adresse von {productData.name}
        </h3>
        <div className="prose max-w-none prose-invert">
          <p className="leading-relaxed">
            {productData.name} befindet sich in {productData.address}. Der {typeLabels[productData.type]}
            ist zentral gelegen und gut mit öffentlichen Verkehrsmitteln erreichbar.
            Weitere {typeLabels[productData.type]} in{' '}
            <Link href={getSearchPath(locale, { city: productData.city })} className="text-primary hover:underline">
              {productData.city}
            </Link>{' '}
            finden Sie auf dem Bordellmarkt.
          </p>
        </div>

        {/* H3: Öffnungszeiten */}
        <h3 className="mt-6 mb-3 text-xl font-semibold text-foreground">
          Öffnungszeiten
        </h3>
        <div className="prose max-w-none prose-invert">
          <p className="leading-relaxed">
            {productData.name} hat folgende Öffnungszeiten: {productData.openingHours.opens} bis {productData.openingHours.closes} Uhr.
            Der Betrieb ist {productData.openingHours.days.length} Tage die Woche geöffnet.
            Aktuelle Öffnungszeiten finden Sie immer auf dem{' '}
            <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
              Bordellmarkt
            </Link>.
          </p>
        </div>
      </section>

      {/* H2: Damen und Atmosphäre */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Damen und Atmosphäre
        </h2>

        {/* H3: Damenauswahl */}
        <h3 className="mb-3 text-xl font-semibold text-foreground">
          Damenauswahl in {productData.name}
        </h3>
        <div className="prose max-w-none prose-invert">
          <p className="leading-relaxed">
            In {productData.name} arbeiten derzeit {productData.ladiesCount} Damen.
            Die Auswahl umfasst verschiedene Nationalitäten und Serviceprofile.
            Der {typeLabels[productData.type]} auf dem{' '}
            <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
              Bordellmarkt
            </Link>{' '}
            bietet detaillierte Profile und Bewertungen.
          </p>
        </div>

        {/* H3: Ambiente */}
        <h3 className="mt-6 mb-3 text-xl font-semibold text-foreground">
          Ambiente und Ausstattung
        </h3>
        <div className="prose max-w-none prose-invert">
          <p className="leading-relaxed">
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
      </section>

      {/* H2: Bewertungen und Erfahrungen */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Bewertungen und Erfahrungen
        </h2>

        {/* H3: Gesamtbewertung */}
        <h3 className="mb-3 text-xl font-semibold text-foreground">
          Gesamtbewertung auf dem Bordellmarkt
        </h3>
        <div className="prose max-w-none prose-invert">
          <p className="leading-relaxed">
            {productData.name} hat eine durchschnittliche Bewertung von {productData.ratingValue} Sternen
            basierend auf {productData.reviewCount} Bewertungen auf dem{' '}
            <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
              Bordellmarkt
            </Link>.
            Kunden loben besonders die Professionalität und Diskretion.
          </p>
        </div>

        {/* H3: Erfahrungsberichte */}
        <h3 className="mt-6 mb-3 text-xl font-semibold text-foreground">
          Erfahrungsberichte von Kunden
        </h3>
        <div className="space-y-4">
          {productData.reviews.map((review) => (
            <div key={review.id} className="rounded-lg border bg-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-medium text-foreground">{review.authorName}</span>
                <span className="text-amber-400">{'★'.repeat(review.rating)}</span>
                <span className="text-sm text-muted-foreground">{review.date}</span>
              </div>
              <p className="text-sm">{review.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* H2: FAQ - SSS */}
      <section className="speakable-faq">
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Häufig gestellte Fragen (FAQ)
        </h2>
        <div className="space-y-4">
          {productData.faq.map((item, index) => (
            <div key={index} className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-semibold text-foreground">
                {item.question}
              </h3>
              <p className="text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* H2: Ähnliche Betriebe - Internal Links */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Ähnliche {typeLabels[productData.type]} auf dem Bordellmarkt
        </h2>
        <div className="prose max-w-none prose-invert">
          <p className="leading-relaxed">
            Auf dem{' '}
            <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
              Bordellmarkt
            </Link>{' '}
            finden Sie weitere {typeLabels[productData.type]} in {productData.city} und Umgebung.
            Vergleichen Sie Preise, Bewertungen und Services, um den passenden Betrieb zu finden.
          </p>
          <ul className="mt-4 space-y-2">
            {productData.relatedProducts.map((related) => (
              <li key={related.id}>
                <Link
                  href={getVenuePath(locale, related.slug)}
                  className="text-primary hover:underline"
                >
                  {related.name} - {typeLabels[related.type]} in {related.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* H2: Kontakt und Reservierung */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Kontakt und Reservierung
        </h2>

        {/* H3: Kontaktmöglichkeiten */}
        <h3 className="mb-3 text-xl font-semibold text-foreground">
          So erreichen Sie {productData.name}
        </h3>
        <div className="prose max-w-none prose-invert">
          <p className="leading-relaxed">
            Für Reservierungen und Anfragen kontaktieren Sie {productData.name} telefonisch
            unter {productData.phone}
            {productData.email && <> oder per E-Mail an {productData.email}</>}.
            Alternativ nutzen Sie die Reservierungsfunktion auf dem{' '}
            <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
              Bordellmarkt
            </Link>.
          </p>
        </div>

        {/* H3: Online-Reservierung */}
        <h3 className="mt-6 mb-3 text-xl font-semibold text-foreground">
          Online-Reservierung auf dem Bordellmarkt
        </h3>
        <div className="prose max-w-none prose-invert">
          <p className="leading-relaxed">
            Die Online-Reservierung über den{' '}
            <Link href={getLocalizedPath(locale, '/')} className="text-primary hover:underline">
              Bordellmarkt
            </Link>{' '}
            bietet folgende Vorteile: Diskrete Buchung, automatische Bestätigung,
            Prioritäts-Reservierung für Premium-Mitglieder und exklusive Rabatte.
            Registrieren Sie sich kostenlos auf dem Bordellmarkt, um alle Funktionen zu nutzen.
          </p>
        </div>
      </section>
    </div>
  )
}
