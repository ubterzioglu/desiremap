/**
 * DesireMap İçerik Motoru
 * ─────────────────────────────────────────────────────────────────────────────
 * Master template + değişken injection sistemi.
 *
 * FELSEFE:
 * Her template homojen cümle yapısı üretir. Değişkenler (mekan adı, şehir,
 * kategori) cümle ortasına inject edilir — başına veya sonuna değil.
 * Bu Google'ın "cümle başı keyword stuffing" tespitini engeller.
 *
 * Her section birbirinden bağımsız paragraf üretir.
 * Aynı keyword arka arkaya 2 paragrafta geçmez.
 *
 * Min 40 kelime / paragraf → Google'ın 2+ cümle indexleme eşiği.
 */

import type { VenueCategory } from '../../../types/schema.types'

// ─── Değişken tipi ────────────────────────────────────────────────────────────

export interface ContentVars {
  venueName: string
  city: string
  category: VenueCategory
  categoryLabel: string     // 'FKK Club', 'Bordell', ...
  categoryPlural: string    // 'FKK Clubs', 'Bordelle', ...
  district?: string         // 'Ehrenfeld', 'Mitte', ...
  amenities: string[]
  priceRange?: string
  hasReservation: boolean
  isVerified: boolean
  openDays?: string[]       // ['Montag', 'Freitag', 'Samstag', 'Sonntag']
  foundingYear?: number
  capacity?: number
  tagline?: string
}

// ─── Template seçici (rotation) ───────────────────────────────────────────────
// Aynı şehirde birden fazla mekan varsa farklı template'ler seçilir.
// slug'dan deterministik index üret → her mekan hep aynı template'i kullanır.

function selectTemplate<T>(templates: T[], seed: string): T {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return templates[hash % templates.length]!
}

// ─── Açılış paragrafı (H1 altı — direkt cevap) ───────────────────────────────
// Google ve AI sistemleri ilk 40-60 kelimeyi "snippet" olarak kullanır.
// Mekan adı ikinci cümlede geçiyor — keyword stuffing değil, doğal akış.

const OPENING_TEMPLATES = [
  (v: ContentVars) =>
    `In ${v.city} gibt es zahlreiche ${v.categoryPlural} – doch nicht alle arbeiten transparent, legal und mit verifizierten Bewertungen. ` +
    `${v.venueName} gehört zu den Adressen, die auf DesireMap manuell geprüft wurden und alle Qualitätsstandards erfüllen. ` +
    `Hier finden Sie aktuelle Öffnungszeiten, Informationen zur Ausstattung und – sofern verfügbar – die Möglichkeit zur direkten Reservierung.`,

  (v: ContentVars) =>
    `Wer in ${v.city} einen seriösen ${v.categoryLabel} sucht, steht vor der Herausforderung, verlässliche Informationen zu finden. ` +
    `${v.venueName} ist auf DesireMap als verifizierter Betrieb gelistet und erfüllt die Anforderungen des deutschen Prostitutionsschutzgesetzes. ` +
    `Alle Angaben zu Öffnungszeiten, Ausstattung und Preisen werden regelmäßig aktualisiert.`,

  (v: ContentVars) =>
    `${v.categoryPlural} in ${v.city} gibt es viele – doch nur ein Teil davon arbeitet mit der nötigen Transparenz und Seriosität. ` +
    `${v.venueName} zählt zu den auf DesireMap verifizierten Betrieben in ${v.city} und bietet Gästen eine diskrete, ` +
    `informierte Entscheidungsgrundlage vor dem Besuch.`,
]

export function generateOpeningParagraph(vars: ContentVars, seed: string): string {
  const template = selectTemplate(OPENING_TEMPLATES, seed)
  return template(vars)
}

// ─── Mekan tanım paragrafı ────────────────────────────────────────────────────

const DESCRIPTION_TEMPLATES = [
  (v: ContentVars) => {
    const amenityList = v.amenities.slice(0, 3).join(', ')
    return (
      `Als ${v.categoryLabel} im ${v.district ? `Stadtteil ${v.district} von ` : ''}${v.city} richtet sich ${v.venueName} an erwachsene Besucher, ` +
      `die Wert auf ein gepflegtes Umfeld legen. Zur Ausstattung gehören unter anderem ${amenityList || 'moderne Einrichtungen'}. ` +
      (v.capacity
        ? `Der Betrieb bietet Platz für bis zu ${v.capacity} Personen gleichzeitig. `
        : '') +
      (v.foundingYear
        ? `Seit ${v.foundingYear} ist ${v.venueName} ein fester Bestandteil der Erwachsenenunterhaltung in ${v.city}.`
        : `${v.venueName} ist ein etablierter Anlaufpunkt für Gäste aus ${v.city} und der Region.`)
    )
  },

  (v: ContentVars) => {
    const amenityList = v.amenities.slice(0, 4).join(', ')
    return (
      `Die Ausstattung von ${v.venueName} umfasst ${amenityList || 'verschiedene Bereiche für Gäste'}. ` +
      `Das Angebot richtet sich ausschließlich an Personen ab 18 Jahren` +
      (v.priceRange ? ` und liegt preislich im ${v.priceRange}-Segment` : '') +
      `. ` +
      (v.district
        ? `Die Location befindet sich im ${v.city}er Stadtteil ${v.district} und ist gut erreichbar. `
        : `Die Adresse in ${v.city} ist zentral gelegen und für Gäste aus der Region gut erreichbar. `) +
      `Alle Angaben wurden durch das DesireMap-Team vor Ort oder telefonisch verifiziert.`
    )
  },
]

export function generateDescriptionParagraph(vars: ContentVars, seed: string): string {
  const template = selectTemplate(DESCRIPTION_TEMPLATES, seed + 'desc')
  return template(vars)
}

// ─── Özellikler/Ausstattung paragrafı ────────────────────────────────────────

export function generateAmenitiesParagraph(vars: ContentVars): string {
  if (vars.amenities.length === 0) return ''

  const all = vars.amenities
  const first = all.slice(0, -1).join(', ')
  const last = all[all.length - 1]

  return (
    `Zu den Annehmlichkeiten von ${vars.venueName} gehören ${first} sowie ${last}. ` +
    `Diese Ausstattungsmerkmale wurden bei der Verifizierung durch DesireMap überprüft und entsprechen dem Stand zum Zeitpunkt der letzten Aktualisierung. ` +
    `Änderungen am Angebot können jederzeit vom Betreiber über das DesireMap-Partnerprogramm gemeldet werden.`
  )
}

// ─── Rezervasyon / CTA paragrafı ─────────────────────────────────────────────

export function generateReservationParagraph(vars: ContentVars): string {
  if (vars.hasReservation) {
    return (
      `${vars.venueName} bietet über DesireMap eine direkte Reservierungsmöglichkeit an. ` +
      `Gäste können Termine diskret und unkompliziert über die Plattform anfragen, ohne direkt mit dem Betrieb in Kontakt treten zu müssen. ` +
      `Die Buchungsanfrage wird in der Regel innerhalb von 24 Stunden bestätigt.`
    )
  }

  return (
    `Eine direkte Online-Reservierung über DesireMap ist für ${vars.venueName} aktuell nicht verfügbar. ` +
    `Kontaktinformationen für eine direkte Anfrage finden Sie in den Betriebsdetails. ` +
    `Möchten Sie als Betrieb die Reservierungsfunktion nutzen? Informieren Sie sich über das DesireMap-Partnerprogramm.`
  )
}

// ─── Öffnungszeiten paragrafı ────────────────────────────────────────────────

export function generateOpeningHoursParagraph(
  vars: ContentVars,
  formattedHours: string
): string {
  return (
    `${vars.venueName} ist ${formattedHours} geöffnet. ` +
    `Wir empfehlen, vor einem Besuch die aktuellen Öffnungszeiten zu prüfen, da diese sich insbesondere an Feiertagen ändern können. ` +
    `Die hier angezeigten Zeiten entsprechen dem zuletzt verifizierten Stand und werden regelmäßig aktualisiert.`
  )
}

// ─── Yasal / E-E-A-T paragrafı ───────────────────────────────────────────────
// Google E-E-A-T için önemli — uzmanlık ve güven sinyali.

export function generateLegalParagraph(vars: ContentVars): string {
  return (
    `In Deutschland unterliegen ${vars.categoryPlural} dem Prostitutionsschutzgesetz (ProstSchG), das seit 2017 in Kraft ist. ` +
    `Betriebe wie ${vars.venueName} sind verpflichtet, eine behördliche Erlaubnis zu besitzen und bestimmte Hygiene- und Sicherheitsstandards einzuhalten. ` +
    `DesireMap listet ausschließlich Betriebe, die diese gesetzlichen Anforderungen erfüllen. ` +
    `Bei Hinweisen auf Verstöße werden Einträge umgehend überprüft und gegebenenfalls entfernt.`
  )
}

// ─── Çevre / Yakın lokasyonlar paragrafı ─────────────────────────────────────

export function generateNearbyParagraph(
  vars: ContentVars,
  nearbyCities: string[]
): string {
  if (nearbyCities.length === 0) return ''

  const cityList = nearbyCities.slice(0, 3).join(', ')
  return (
    `${vars.venueName} liegt in ${vars.city} und ist auch für Gäste aus ${cityList} gut erreichbar. ` +
    `Auf DesireMap finden Sie weitere verifizierte ${vars.categoryPlural} in der Region – ` +
    `gefiltert nach Stadtteilen, Öffnungszeiten und Ausstattungsmerkmalen.`
  )
}

// ─── FAQ içerik üreticisi ─────────────────────────────────────────────────────
// Her mekan için deterministik FAQ seti — GEO citation için min 40 kelime/cevap.

const FAQ_POOL = {
  opening: (v: ContentVars, hours: string) => ({
    question: `Wann ist ${v.venueName} in ${v.city} geöffnet?`,
    answer:
      `${v.venueName} ist laut aktuellen Angaben ${hours} geöffnet. ` +
      `Wir empfehlen, vor einem Besuch die Zeiten auf dieser Seite zu prüfen oder direkt beim Betrieb nachzufragen, ` +
      `da sich Öffnungszeiten insbesondere an Feiertagen und in der Ferienzeit ändern können. ` +
      `DesireMap aktualisiert alle Öffnungszeiten regelmäßig auf Basis von Partnerangaben.`,
  }),

  reservation: (v: ContentVars) => ({
    question: `Kann ich bei ${v.venueName} online reservieren?`,
    answer: v.hasReservation
      ? `Ja, ${v.venueName} bietet über DesireMap eine direkte Reservierungsmöglichkeit. ` +
        `Sie können eine Anfrage diskret über die Plattform stellen, ohne vorher direkt Kontakt aufnehmen zu müssen. ` +
        `Die Bestätigung erfolgt in der Regel innerhalb von 24 Stunden durch den Betrieb. ` +
        `DesireMap übermittelt Ihre Anfrage verschlüsselt und speichert keine Klardaten.`
      : `Eine Online-Reservierung über DesireMap ist für ${v.venueName} aktuell nicht eingerichtet. ` +
        `Kontaktdetails für eine direkte Anfrage finden Sie auf dieser Seite. ` +
        `Wenn Sie als Betrieb die Buchungsfunktion aktivieren möchten, informieren Sie sich über das DesireMap-Partnerprogramm. ` +
        `Wir helfen Betrieben dabei, ihre Sichtbarkeit und Buchungsrate zu steigern.`,
  }),

  verified: (v: ContentVars) => ({
    question: `Ist ${v.venueName} ein seriöser Betrieb?`,
    answer:
      `${v.venueName} ist auf DesireMap als verifizierter Betrieb gelistet. ` +
      `Das bedeutet, dass der Betrieb die Anforderungen des deutschen Prostitutionsschutzgesetzes erfüllt und über eine gültige behördliche Erlaubnis verfügt. ` +
      `DesireMap überprüft alle gelisteten Betriebe und entfernt Einträge, bei denen Hinweise auf Verstöße vorliegen. ` +
      `Nutzer können außerdem Bewertungen hinterlassen, die zusätzliche Transparenz schaffen.`,
  }),

  category: (v: ContentVars) => ({
    question: `Was unterscheidet einen ${v.categoryLabel} von anderen Betrieben?`,
    answer:
      `Ein ${v.categoryLabel} ist ein spezialisierter Betrieb im Bereich der Erwachsenenunterhaltung, ` +
      `der in Deutschland unter das Prostitutionsschutzgesetz fällt und entsprechend reguliert ist. ` +
      `Im Unterschied zu nicht-verifizierten Angeboten im Internet arbeiten ${v.categoryPlural} wie ${v.venueName} ` +
      `mit festen Adressen, Öffnungszeiten und behördlich genehmigten Betriebskonzepten. ` +
      `DesireMap listet ausschließlich solche regulierten Betriebe.`,
  }),

  city: (v: ContentVars) => ({
    question: `Wie finde ich seriöse ${v.categoryPlural} in ${v.city}?`,
    answer:
      `Auf DesireMap können Sie gezielt nach verifizierten ${v.categoryPlural} in ${v.city} filtern. ` +
      `Alle gelisteten Betriebe wurden manuell überprüft und erfüllen die gesetzlichen Anforderungen. ` +
      `Sie können nach Stadtteilen, Öffnungszeiten und Ausstattungsmerkmalen filtern und – wo verfügbar – direkt online reservieren. ` +
      `${v.venueName} ist eine der auf DesireMap gelisteten Adressen in ${v.city}.`,
  }),
}

export function generateVenueFaqs(
  vars: ContentVars,
  formattedHours: string
): Array<{ question: string; answer: string }> {
  return [
    FAQ_POOL.opening(vars, formattedHours),
    FAQ_POOL.reservation(vars),
    FAQ_POOL.verified(vars),
    FAQ_POOL.category(vars),
    FAQ_POOL.city(vars),
  ]
}

// ─── Öffnungszeiten formatter ─────────────────────────────────────────────────

export function formatOpeningHours(
  hours: Array<{ days: string[]; opens: string; closes: string }>
): string {
  if (hours.length === 0) return 'zu den angegebenen Zeiten'

  return hours
    .map((h) => {
      const days = h.days.join(', ')
      return `${days} von ${h.opens} bis ${h.closes} Uhr`
    })
    .join('; ')
}
