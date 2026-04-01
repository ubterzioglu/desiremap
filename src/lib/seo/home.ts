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
    title: 'DesireMap | Verifizierte FKK Clubs, Laufhäuser und Studios in Deutschland',
    description:
      'DesireMap hilft Ihnen, verifizierte FKK Clubs, Laufhäuser, Studios und Privat-Adressen in Deutschland nach Stadt, Kategorie, Bewertung und Verfügbarkeit zu entdecken.'
  },
  en: {
    title: 'DesireMap | Verified FKK Clubs, Laufhaus Venues and Studios in Germany',
    description:
      'Discover verified FKK clubs, laufhaus venues, studios and private addresses across Germany with DesireMap.'
  },
  tr: {
    title: "DesireMap | Almanya'da dogrulanmis FKK kulubu, Laufhaus ve Studyo rehberi",
    description:
      "DesireMap ile Almanya genelinde dogrulanmis FKK kulubu, laufhaus, studyo ve ozel adresleri sehir, kategori ve guven sinyallerine gore kesfedin."
  },
  ar: {
    title: 'DesireMap | دليل موثق لنوادي FKK والاستوديوهات في المانيا',
    description:
      'اكتشف عبر DesireMap النوادي والاستوديوهات والعناوين الموثقة في المانيا حسب المدينة والفئة وعوامل الثقة.'
  }
}

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
      'DesireMap bündelt Kategorien, Städte, Bewertungen, Preisrahmen, Öffnungszeiten und redaktionell gepflegte Hinweise an einem Ort, damit Nutzer nicht nur nach Schlagworten suchen müssen.'
  },
  {
    question: 'Welche Kategorien deckt die Startseite ab?',
    answer:
      'Die Home-SEO-Struktur priorisiert FKK Clubs, Laufhäuser, Studios und Privat-Adressen, weil diese Cluster den klarsten Suchintent und die stärksten internen Link-Signale für den aktuellen Produktkern liefern.'
  },
  {
    question: 'Warum setzt die Startseite so stark auf Stadte und Kategorien?',
    answer:
      'Die Kombination aus Kategorie- und Stadtclustern hilft Besuchern schneller zum passenden Ziel zu kommen und verstärkt zugleich die interne Verlinkung auf die wichtigsten Suchpfade des Produkts.'
  },
  {
    question: 'Welche Vertrauenssignale sollen auf DesireMap sichtbar sein?',
    answer:
      'Verifizierte Profile, aktualisierte Daten, nachvollziehbare Bewertungen, klare Kategorie-Signale und diskrete Anfragepfade sind die wichtigsten Vertrauenssignale für den deutschen Markt.'
  }
]

export function getHomeSeoMetadata(locale: string): HomeSeoMetadata {
  return HOME_SEO_METADATA[(locale as HomeSeoLocale) || 'de'] ?? HOME_SEO_METADATA.de
}

export function getHomeSeoExperience(locale: string): HomeSeoExperience {
  const currentLocale = (locale as HomeSeoLocale) || 'de'
  const prefix = `/${currentLocale}`

  return {
    eyebrow: 'Verifizierte Orientierung für Deutschlands diskrete Suche',
    title: 'Passende FKK Clubs, Laufhäuser, Studios und Privat-Adressen in Deutschland finden',
    lead:
      'DesireMap bündelt die wichtigsten Kategorien, Städte und Vertrauenssignale für Nutzer, die in Deutschland diskret und gezielt nach passenden Adressen suchen.',
    supportingCopy:
      'Statt einer langen Textwand führt die Startseite direkt in die wichtigsten Suchpfade: FKK Clubs mit Wellness-Fokus, Laufhäuser mit großer Auswahl, diskrete Studios und Privat-Adressen für persönlichere Termine. So bleibt der Bereich lesbar, hochwertig und inhaltlich klar.',
    sectionIntro:
      'Die wichtigsten Kategorien werden als kurze, gut lesbare Einstiege gezeigt. Jede Karte erklärt knapp, für wen die Kategorie gedacht ist und führt direkt in die passende Suche.',
    trustIntro:
      'In diesem Markt zählen keine lauten Versprechen, sondern klare Signale. Die Startseite muss Qualität, Aktualität und Diskretion vermitteln, bevor Nutzer weiterklicken.',
    cityIntro:
      'Neben Kategorien gehören Städte zu den wichtigsten Einstiegen. Deshalb zeigen wir die stärksten Regionen nicht nur als Linkliste, sondern mit kurzem Kontext zur jeweiligen Suche.',
    faqIntro:
      'Die FAQ beantwortet die Fragen, die Nutzer vor dem Einstieg in die Suche wirklich haben. Sie soll Orientierung geben und Vertrauen aufbauen.',
    stats: [
      { value: '847+', label: 'gelistete Adressen im aktuellen Produktbild' },
      { value: '4', label: 'zentrale Kategorien für den Homepage-Einstieg' },
      { value: '6', label: 'wichtige Metropolregionen im Stadtfokus' },
      { value: '24/7', label: 'Signale für Suche, Routing und strukturierte Daten' }
    ],
    clusters: [
      {
        id: 'fkk',
        label: 'FKK Clubs',
        title: 'Wellness, Tagesbesuch und Club-Atmosphäre',
        description:
          'Ideal für Nutzer, die größere Clubs, Spa-Atmosphäre, Tagesplanung und verifizierte Rahmenbedingungen vergleichen möchten.',
        href: `${prefix}/search?category=fkk`,
        highlights: ['Sauna und Wellness-Fokus', 'Beliebt in großen Städten', 'Gut für planbare Besuche']
      },
      {
        id: 'laufhaus',
        label: 'Laufhäuser',
        title: 'Große Auswahl in starken Stadtlagen',
        description:
          'Besonders relevant für Suchanfragen aus Köln, Frankfurt und anderen urbanen Märkten mit klarer Vergleichsabsicht.',
        href: `${prefix}/search?category=laufhaus`,
        highlights: ['Hohe Nachfrage in Metropolen', 'Gut für direkte Vergleiche', 'Starker Stadtbezug']
      },
      {
        id: 'studio',
        label: 'Studios',
        title: 'Diskret, planbar und persönlicher',
        description:
          'Studios sind oft lokaler, diskreter und persönlicher. Dieser Einstieg passt zu Nutzern, die gezielt und ohne Umwege suchen möchten.',
        href: `${prefix}/search?category=studio`,
        highlights: ['Hoher Diskretionsbedarf', 'Klarer lokaler Intent', 'Geeignet für konkrete Terminplanung']
      },
      {
        id: 'privat',
        label: 'Privat',
        title: 'Persönliche Adressen im privaten Rahmen',
        description:
          'Der Privat-Bereich richtet sich an Nutzer, die bewusst kleinere, persönlichere und weniger clubartige Angebote suchen.',
        href: `${prefix}/search?category=privat`,
        highlights: ['Klare persönliche Ausrichtung', 'Besonders vertrauensabhängig', 'Gut für intent-getriebene Filterung']
      }
    ],
    cityLinks: BASE_CITY_LINKS.map((item) => ({
      ...item,
      href: `${prefix}/search?city=${encodeURIComponent(item.name)}`
    })),
    trustPoints: [
      {
        title: 'Verifizierte Profile',
        description:
          'Die Startseite muss klar zeigen, welche Listings redaktionell gepflegt, geprüft oder mit aktuellen Signalen angereichert sind.'
      },
      {
        title: 'Klare Suche nach Stadt und Kategorie',
        description:
          'Kategorie- und Stadtpfade müssen sichtbar verzahnt sein, damit Nutzer schnell in die passende Suche einsteigen können.'
      },
      {
        title: 'Aktuelle Informationen',
        description:
          'Öffnungszeiten, Preisrahmen, Bewertungen und Sichtbarkeit relevanter Adressen müssen nachvollziehbar und aktuell wirken.'
      },
      {
        title: 'Diskrete Orientierung',
        description:
          'Die Sprache soll kontrolliert, hilfreich und diskret bleiben. Vertrauen entsteht hier durch Klarheit, nicht durch Lautstärke.'
      }
    ],
    faq: BASE_FAQ,
    ctaTitle: 'Jetzt passende Adressen nach Stadt oder Kategorie entdecken',
    ctaBody:
      'Von Berlin bis Stuttgart, von FKK Club bis Privat-Adresse: Die Startseite führt direkt in die wichtigsten Suchpfade und hält den Einstieg klar, diskret und lesbar.',
    ctaLabel: 'Alle Adressen durchsuchen',
    ctaHref: `${prefix}/search`
  }
}
