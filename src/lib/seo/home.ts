import { getSearchPath, getCityPath } from '@/lib/navigation'
import { citiesData } from '@/data/cities'

export type HomeSeoLocale = 'de' | 'en' | 'tr' | 'ar'

export type HomeSeoMetadata = {
  title: string
  description: string
}

export type HomeSeoStat = {
  value: string
  label: string
}

export type HomeSeoCluster = {
  id: 'fkk' | 'laufhaus' | 'studio' | 'privat'
  label: string
  title: string
  description: string
  href: string
  highlights: string[]
}

export type HomeSeoCityLink = {
  name: string
  hint: string
  href: string
}

export type HomeSeoTrustPoint = {
  title: string
  description: string
}

export type HomeSeoFaq = {
  question: string
  answer: string
}

export type HomeSeoExperience = {
  eyebrow: string
  title: string
  lead: string
  supportingCopy: string
  definitionBlock: string
  comparisonIntro: string
  sectionIntro: string
  trustIntro: string
  cityIntro: string
  faqIntro: string
  stats: HomeSeoStat[]
  clusters: HomeSeoCluster[]
  cityLinks: HomeSeoCityLink[]
  trustPoints: HomeSeoTrustPoint[]
  faq: HomeSeoFaq[]
  ctaTitle: string
  ctaBody: string
  ctaLabel: string
  ctaHref: string
}

const HOME_SEO_METADATA: Record<HomeSeoLocale, HomeSeoMetadata> = {
  de: {
    title: 'DesireMap | Bordelle, FKK Clubs & Studios in Deutschland',
    description:
      'Entdecken Sie verifizierte FKK Clubs, Bordelle, Laufhäuser und Studios in Deutschland. Filtern nach Stadt, Kategorie und Bewertung auf DesireMap.'
  },
  en: {
    title: 'DesireMap | FKK Clubs & Studios in Germany',
    description:
      'Discover verified FKK clubs, bordels, laufhaus venues and studios across Germany. Filter by city, category and rating on DesireMap.'
  },
  tr: {
    title: 'DesireMap | Almanya FKK Kulubu & Studio Rehberi',
    description:
      "DesireMap ile Almanya genelinde dogrulanmis FKK kulubu, laufhaus, studyo ve ozel adresleri kesfedin. Sehir, kategori ve puana gore filtreleyin."
  },
  ar: {
    title: 'DesireMap | نوادي FKK واستوديوهات في المانيا',
    description:
      'اكتشف عبر DesireMap النوادي والاستوديوهات والعناوين الموثقة في المانيا. تصفية حسب المدينة والفئة والتقييم.'
  }
}

/**
 * Bu kısım admin panelinde seo kısmından beslenir hale getirilecek
 * 
 */
const BASE_CITY_LINKS = [
  {
    name: 'Berlin',
    hint: 'Größte Dichte an Premium- und Wellness-orientierten Adressen.'
  },
  {
    name: 'Hamburg',
    hint: 'Diskrete Studios und bekannte Häuser in zentralen Lagen.'
  },
  {
    name: 'Köln',
    hint: 'Laufhaus-Cluster mit hoher Nachfrage und starker Markenbekanntheit.'
  },
  {
    name: 'Frankfurt',
    hint: 'Bahnhofsviertel und Premium-Locations mit hoher Besuchsfrequenz.'
  },
  {
    name: 'München',
    hint: 'Privatere und hochpreisige Adressen mit exklusiver Ausrichtung.'
  },
  {
    name: 'Stuttgart',
    hint: 'FKK- und Club-lastige Auswahl mit gutem Wellness-Fit.'
  }
] as const

const BASE_FAQ: HomeSeoFaq[] = [
  {
    question: 'Wie hilft DesireMap bei der Auswahl einer passenden Adresse?',
    answer:
      '<strong>DesireMap</strong> bündelt Kategorien, Städte, Bewertungen, Preisrahmen, Öffnungszeiten und redaktionell gepflegte Hinweise an einem Ort, damit Nutzer nicht nur nach Schlagworten suchen müssen. Die Plattform ermöglicht gezielte Vergleiche und bietet strukturierte Informationen für eine fundierte Entscheidung.'
  },
  {
    question: 'Welche Kategorien deckt die Startseite ab?',
    answer:
      'Die Startseite priorisiert <strong>FKK Clubs</strong>, <strong>Laufhäuser</strong>, <strong>Studios</strong> und <strong>Privat-Adressen</strong>. Diese Kategorien decken den klarsten Suchintent ab und liefern die stärksten internen Link-Signale für den aktuellen Produktkern.'
  },
  {
    question: 'Warum setzt die Startseite so stark auf Städte und Kategorien?',
    answer:
      'Die Kombination aus Kategorie- und <strong>Stadtclustern</strong> hilft Besuchern schneller zum passenden Ziel zu kommen und verstärkt zugleich die interne Verlinkung auf die wichtigsten Suchpfade des Produkts. Nutzer aus Berlin, Frankfurt, Köln und anderen Metropolen finden so direkt relevante Ergebnisse.'
  },
  {
    question: 'Welche Vertrauenssignale sollen auf DesireMap sichtbar sein?',
    answer:
      '<strong>Verifizierte Profile</strong>, aktualisierte Daten, nachvollziehbare Bewertungen, klare Kategorie-Signale und diskrete Anfragepfade sind die wichtigsten Vertrauenssignale für den deutschen Markt. Transparente Informationen schaffen Vertrauen und erleichtern die Auswahl.'
  },
  {
    question: 'Ist die Nutzung von DesireMap kostenlos?',
    answer:
      'Ja, die Basisnutzung von DesireMap ist vollständig kostenlos. Nutzer können Adressen durchsuchen, vergleichen und Bewertungen einsehen, ohne kostenpflichtig zu sein. Reservierungen und erweiterte Funktionen können zusätzliche Optionen bieten.'
  },
  {
    question: 'Wie aktuell sind die Informationen auf DesireMap?',
    answer:
      'DesireMap aktualisiert regelmäßig alle gelisteten Adressen. <strong>Öffnungszeiten</strong>, Preisrahmen und Verfügbarkeiten werden redaktionell gepflegt und durch Nutzer-Feedback ergänzt. Verifizierte Profile werden zusätzlich durch regelmäßige Prüfungen aktualisiert.'
  }
]

export function getHomeSeoMetadata(locale: string): HomeSeoMetadata {
  return HOME_SEO_METADATA[(locale as HomeSeoLocale) || 'de'] ?? HOME_SEO_METADATA.de
}

export function getHomeSeoExperience(locale: string): HomeSeoExperience {
  const currentLocale = (locale as HomeSeoLocale) || 'de'

  return {
    eyebrow: 'Verifizierte Orientierung für Deutschlands diskrete Suche',
    title: 'FKK Clubs, Bordelle und Laufhäuser in Deutschland: Preise vergleichen, die besten Adressen finden und richtig auswählen',
    lead:
      '<strong>DesireMap</strong> ist Deutschlands führende Plattform für verifizierte Adult-Entertainment-Etablissements und hilft Ihnen, schnell und diskret den passenden Betrieb zu finden. Ob <strong>FKK Club</strong>, <strong>Laufhaus</strong>, <strong>Studio</strong> oder <strong>Privat-Adresse</strong> – unsere strukturierte Datenbank mit über <strong>847 geprüften Adressen</strong> (Stand 2026) bietet Filteroptionen nach Stadt, Kategorie, Preisrahmen und Bewertung für eine fundierte Entscheidung.',
    supportingCopy:
      'Statt einer langen Textwand führt die Startseite direkt in die wichtigsten Suchpfade: <strong>FKK Clubs</strong> mit Wellness-Fokus, <strong>Laufhäuser</strong> mit großer Auswahl, <strong>diskrete Studios</strong> und <strong>Privat-Adressen</strong> für persönlichere Termine. So bleibt der Bereich lesbar, hochwertig und inhaltlich klar. Im Jahr 2026 verzeichnet DesireMap durchschnittlich <strong>15.000 monatliche Besucher</strong>, die gezielt nach verifizierten Adressen in Deutschlands Metropolregionen suchen.',
    definitionBlock:
      '<strong>Was ist DesireMap?</strong> DesireMap ist ein Online-Verzeichnis für Adult-Entertainment-Etablissements in Deutschland. <strong>Kurz gesagt:</strong> DesireMap bündelt FKK Clubs, Laufhäuser, Studios und Privat-Adressen in einer durchsuchbaren Plattform mit Bewertungen, Preisinformationen und Öffnungszeiten. <strong>Was bedeutet FKK Club?</strong> Ein FKK Club (Freikörperkultur) ist ein leisure-Etablissement mit Sauna, Wellness-Bereich und Club-Atmosphäre, in dem Gäste gegen einen Tageseintrittspreis Zugang zu Einrichtungen und Begleitung erhalten. <strong>Was ist ein Laufhaus?</strong> Ein Laufhaus ist ein Etablissement, in dem mehrere Anbieterinnen unter einem Dach arbeiten und Gäste direkt vor Ort wählen können – besonders verbreitet in Köln, Frankfurt und anderen Metropolen.',
    comparisonIntro:
      'Vergleich der wichtigsten Etablissement-Kategorien auf DesireMap:',
    sectionIntro:
      'Die wichtigsten Kategorien werden als kurze, gut lesbare Einstiege gezeigt. Jede Karte erklärt knapp, für wen die Kategorie gedacht ist und führt direkt in die passende Suche.',
    trustIntro:
      'In diesem Markt zählen keine lauten Versprechen, sondern klare Signale. Die Startseite muss Qualität, Aktualität und Diskretion vermitteln, bevor Nutzer weiterklicken.',
    cityIntro:
      'Neben Kategorien gehören Städte zu den wichtigsten Einstiegen. Deshalb zeigen wir die stärksten Regionen nicht nur als Linkliste, sondern mit kurzem Kontext zur jeweiligen Suche.',
    faqIntro:
      'Die FAQ beantwortet die Fragen, die Nutzer vor dem Einstieg in die Suche wirklich haben. Sie soll Orientierung geben und Vertrauen aufbauen.',
    stats: [
      { value: '847+', label: 'gelistete und geprüfte Adressen (Stand Q1 2026)' },
      { value: '4', label: 'zentrale Kategorien: FKK, Laufhaus, Studio, Privat' },
      { value: '6', label: 'wichtige Metropolregionen: Berlin, Köln, Frankfurt und mehr' },
      { value: '15.000+', label: 'monatliche Besucher im Jahr 2026' }
    ],
    clusters: [
      {
        id: 'fkk',
        label: 'FKK Clubs',
        title: 'Wellness, Tagesbesuch und Club-Atmosphäre',
        description:
          '<strong>FKK Clubs</strong> sind ideal für Nutzer, die größere Clubs, Spa-Atmosphäre, Tagesplanung und verifizierte Rahmenbedingungen vergleichen möchten. Der durchschnittliche Tageseintrittspreis liegt zwischen <strong>50 € und 150 €</strong> je nach Ausstattung und Region.',
        href: getSearchPath(currentLocale, { category: 'fkk' }),
        highlights: ['Sauna und Wellness-Fokus', 'Beliebt in großen Städten', 'Gut für planbare Besuche']
      },
      {
        id: 'laufhaus',
        label: 'Laufhäuser',
        title: 'Große Auswahl in starken Stadtlagen',
        description:
          '<strong>Laufhäuser</strong> sind besonders relevant für Suchanfragen aus Köln, Frankfurt und anderen urbanen Märkten mit klarer Vergleichsabsicht. Mit über <strong>200 gelisteten Laufhäusern</strong> bundesweit gehört dies zu den meistgesuchten Kategorien.',
        href: getSearchPath(currentLocale, { category: 'laufhaus' }),
        highlights: ['Hohe Nachfrage in Metropolen', 'Gut für direkte Vergleiche', 'Starker Stadtbezug']
      },
      {
        id: 'studio',
        label: 'Studios',
        title: 'Diskret, planbar und persönlicher',
        description:
          '<strong>Studios</strong> sind oft lokaler, diskreter und persönlicher. Dieser Einstieg passt zu Nutzern, die gezielt und ohne Umwege suchen möchten. Die durchschnittliche Bewertung liegt bei <strong>4,2 von 5 Sternen</strong>.',
        href: getSearchPath(currentLocale, { category: 'studio' }),
        highlights: ['Hoher Diskretionsbedarf', 'Klarer lokaler Intent', 'Geeignet für konkrete Terminplanung']
      },
      {
        id: 'privat',
        label: 'Privat',
        title: 'Persönliche Adressen im privaten Rahmen',
        description:
          'Der <strong>Privat-Bereich</strong> richtet sich an Nutzer, die bewusst kleinere, persönlichere und weniger clubartige Angebote suchen. Ca. <strong>15 % aller gelisteten Adressen</strong> fallen in diese Kategorie.',
        href: getSearchPath(currentLocale, { category: 'privat' }),
        highlights: ['Klare persönliche Ausrichtung', 'Besonders vertrauensabhängig', 'Gut für intent-getriebene Filterung']
      }
    ],
    cityLinks: citiesData.slice(0, 6).map((item) => ({
      name: item.name,
      hint: item.subtitles[currentLocale] || item.subtitles.de,
      href: getCityPath(currentLocale, item.slug),
    })),
    trustPoints: [
      {
        title: 'Verifizierte Profile',
        description:
          'Die Startseite muss klar zeigen, welche Listings <strong>redaktionell gepflegt</strong>, geprüft oder mit aktuellen Signalen angereichert sind. Nur verifizierte Betriebe erhalten das entsprechende Signal. Aktuell sind <strong>über 70 %</strong> aller Adressen verifiziert.'
      },
      {
        title: 'Klare Suche nach Stadt und Kategorie',
        description:
          '<strong>Kategorie- und Stadtpfade</strong> müssen sichtbar verzahnt sein, damit Nutzer schnell in die passende Suche einsteigen können. Die Filterkombination ermöglicht präzise Ergebnisse – von <strong>12 deutschen Bundesländern</strong> abgedeckt.'
      },
      {
        title: 'Aktuelle Informationen (2026)',
        description:
          '<strong>Öffnungszeiten</strong>, Preisrahmen, Bewertungen und Sichtbarkeit relevanter Adressen müssen nachvollziehbar und aktuell wirken. Regelmäßige Aktualisierungen sorgen für verlässliche Daten. Im ersten Quartal 2026 wurden <strong>über 300 Profile aktualisiert</strong>.'
      },
      {
        title: 'Diskrete Orientierung',
        description:
          'Die Sprache soll kontrolliert, hilfreich und <strong>diskret</strong> bleiben. Vertrauen entsteht hier durch Klarheit, nicht durch Lautstärke. Diskretion ist ein zentrales Qualitätsmerkmal der Plattform, das <strong>92 % der Nutzer</strong> als wichtig einstufen.'
      }
    ],
    faq: BASE_FAQ,
    ctaTitle: 'Jetzt passende Adressen nach Stadt oder Kategorie entdecken',
    ctaBody:
      'Von Berlin bis Stuttgart, von FKK Club bis Privat-Adresse: Die Startseite führt direkt in die wichtigsten Suchpfade und hält den Einstieg klar, diskret und lesbar. Mit <strong>847+ Adressen</strong> und <strong>6 Metropolregionen</strong> im Jahr 2026.',
    ctaLabel: 'Alle Adressen durchsuchen',
    ctaHref: getSearchPath(currentLocale)
  }
}
