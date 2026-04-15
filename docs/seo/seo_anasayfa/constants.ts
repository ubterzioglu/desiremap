/**
 * DesireMap Schema Constants — single source of truth
 */

export type VenueCategory =
  | 'fkk-club'
  | 'bordell'
  | 'escort'
  | 'privat-party'
  | 'sauna-club'
  | 'swinger-club'

export const SITE_CONFIG = {
  name: 'DesireMap',
  url: 'https://desiremap.de',
  locale: 'de-DE',
  language: 'de',
  countryCode: 'DE',
  foundingYear: 2026,
  organization: {
    legalName: 'DesireMap GmbH',
    email: 'info@desiremap.de',
    areaServed: 'DE',
  },
  social: {
    twitter: 'https://x.com/desiremapde',
    instagram: 'https://instagram.com/desiremapde',
  },
} as const


export const CATEGORY_CONFIG: Record<
  VenueCategory,
  {
    label: string
    plural: string
    schemaType: string
    slug: string
    metaTitle: string
    metaDesc: string
  }
> = {
  'fkk-club': {
    label: 'FKK Club',
    plural: 'FKK Clubs',
    schemaType: 'EntertainmentBusiness',
    slug: 'fkk-clubs',
    metaTitle: 'FKK Clubs in Deutschland – Verifizierte Adressen | DesireMap',
    metaDesc:
      'Alle seriösen FKK Clubs in Deutschland auf einen Blick. Geprüfte Adressen, Öffnungszeiten & direkte Reservierung – diskret, ohne explizite Inhalte.',
  },
  'bordell': {
    label: 'Bordell',
    plural: 'Bordelle',
    schemaType: 'EntertainmentBusiness',
    slug: 'bordelle',
    metaTitle: 'Bordelle in Deutschland – Geprüfte Adressen | DesireMap',
    metaDesc:
      'Verifizierte Bordelle in Deutschland mit Bewertungen, Öffnungszeiten und Reservierungsmöglichkeit. Diskret und seriös – ohne explizite Inhalte.',
  },
  'escort': {
    label: 'Escort Service',
    plural: 'Escort Services',
    schemaType: 'LocalBusiness',
    slug: 'escort',
    metaTitle: 'Escort Services in Deutschland – Seriöse Adressen | DesireMap',
    metaDesc:
      'Seriöse Escort-Services in Deutschland. Geprüfte Anbieter, diskrete Kontaktaufnahme und direkte Buchung über DesireMap.',
  },
  'privat-party': {
    label: 'Privatparty',
    plural: 'Privatpartys',
    schemaType: 'EntertainmentBusiness',
    slug: 'privat-partys',
    metaTitle: 'Privatpartys in Deutschland – Aktuelle Events | DesireMap',
    metaDesc:
      'Private Erwachsenenveranstaltungen in Deutschland. Diskret, verifiziert und direkt buchbar – DesireMap zeigt aktuelle Partys in Ihrer Nähe.',
  },
  'sauna-club': {
    label: 'Sauna Club',
    plural: 'Sauna Clubs',
    schemaType: 'HealthClub',
    slug: 'sauna-clubs',
    metaTitle: 'Sauna Clubs in Deutschland – Geprüfte Adressen | DesireMap',
    metaDesc:
      'Sauna Clubs in Deutschland mit verifizierten Bewertungen und Öffnungszeiten. Seriös, diskret und direkt buchbar auf DesireMap.',
  },
  'swinger-club': {
    label: 'Swingerclub',
    plural: 'Swingerclubs',
    schemaType: 'EntertainmentBusiness',
    slug: 'swinger-clubs',
    metaTitle: 'Swingerclubs in Deutschland – Verifizierte Adressen | DesireMap',
    metaDesc:
      'Verifizierte Swingerclubs in Deutschland. Diskrete Informationen zu Öffnungszeiten, Eintrittspreisen und Reservierung – ohne explizite Inhalte.',
  },
}

export const MAJOR_CITIES: Record<string, { lat: number; lng: number; state: string }> = {
  berlin: { lat: 52.52, lng: 13.405, state: 'Berlin' },
  hamburg: { lat: 53.5753, lng: 10.0153, state: 'Hamburg' },
  muenchen: { lat: 48.1351, lng: 11.582, state: 'Bayern' },
  koeln: { lat: 50.9333, lng: 6.95, state: 'Nordrhein-Westfalen' },
  frankfurt: { lat: 50.1109, lng: 8.6821, state: 'Hessen' },
  stuttgart: { lat: 48.7758, lng: 9.1829, state: 'Baden-Württemberg' },
  duesseldorf: { lat: 51.2217, lng: 6.7762, state: 'Nordrhein-Westfalen' },
  dortmund: { lat: 51.5136, lng: 7.4653, state: 'Nordrhein-Westfalen' },
  essen: { lat: 51.4566, lng: 7.0116, state: 'Nordrhein-Westfalen' },
  leipzig: { lat: 51.3397, lng: 12.3731, state: 'Sachsen' },
  bremen: { lat: 53.0793, lng: 8.8017, state: 'Bremen' },
  dresden: { lat: 51.0504, lng: 13.7373, state: 'Sachsen' },
  hannover: { lat: 52.3759, lng: 9.732, state: 'Niedersachsen' },
  nuernberg: { lat: 49.4521, lng: 11.0767, state: 'Bayern' },
  duisburg: { lat: 51.4349, lng: 6.7623, state: 'Nordrhein-Westfalen' },
}

export const SCHEMA_VERSION = '2.0.0'
