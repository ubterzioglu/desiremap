export interface BlogPost {
  id: string
  slug: string
  title: string
  headline: string
  description: string
  content?: string
  image: string
  images?: string[]
  datePublished: string
  dateModified: string
  author: {
    name: string
    url?: string
    image?: string
    sameAs?: string[]
    jobTitle?: string
    description?: string
  }
  wordCount: number
  keywords: string[]
  inLanguage: string
  category: string
  tags: string[]
  faq?: Array<{
    question: string
    answer: string
  }>
  mentions?: Array<{
    name: string
    url: string
    type: 'Product' | 'Service' | 'Thing'
  }>
  commentCount?: number
}

export const blogPosts: BlogPost[] = [
  {
    id: 'premium-erotik-plattform',
    slug: 'premium-erotik-plattform',
    title: 'Premium Erotik Plattform - DesireMap',
    headline: 'DesireMap: Deutschlands Premium-Plattform für Erotik',
    description: 'DesireMap verbindet Sie mit den besten FKK Clubs, Laufhäusern und Bordellen in Deutschland. Entdecken Sie verifizierte Betriebe mit höchsten Qualitätsstandards.',
    image: 'https://desiremap.de/blog/premium-erotik-plattform.jpg',
    images: [
      'https://desiremap.de/blog/fkk-club-guide.jpg',
      'https://desiremap.de/blog/laufhaus-tipps.jpg'
    ],
    datePublished: '2026-03-08T10:00:00+01:00',
    dateModified: '2026-03-08T10:00:00+01:00',
    author: {
      name: 'Shahindzhan Yozbakar',
      jobTitle: 'Software developer',
      description: 'Shahindzhan Yozbakar entwickelt DesireMap als Produkt und Software-Plattform mit Fokus auf Routing, SEO, Datenqualität und stabile Nutzerpfade.'
    },
    wordCount: 2500,
    keywords: [
      'DesireMap',
      'Premium Erotik Plattform',
      'FKK Club',
      'Laufhaus',
      'Bordell',
      'Berlin',
      'Hamburg',
      'München',
      'erotische Dienstleistungen',
      'verifizierte Betriebe'
    ],
    inLanguage: 'de',
    category: 'Plattform-Guide',
    tags: ['DesireMap', 'Premium', 'Guide'],
    faq: [
      {
        question: 'Ist DesireMap kostenlos?',
        answer: 'Ja, die grundlegende Nutzung von DesireMap ist komplett kostenlos. Sie können suchen, vergleichen und Kontakt aufnehmen ohne zu zahlen.'
      },
      {
        question: 'Wie werden Betriebe verifiziert?',
        answer: 'Das DesireMap-Team prüft jeden Betrieb persönlich. Wir kontrollieren Existenz, Hygiene-Standards und Service-Qualität.'
      },
      {
        question: 'Bleibe ich anonym?',
        answer: 'Absolut. Auf DesireMap können Sie anonym suchen und stöbern. Ihre Privatsphäre hat für uns oberste Priorität.'
      },
      {
        question: 'Welche Städte deckt DesireMap ab?',
        answer: 'DesireMap ist in allen deutschen Großstädten vertreten: Berlin, Hamburg, München, Köln, Frankfurt und viele mehr.'
      },
      {
        question: 'Kann ich eine Bewertung schreiben?',
        answer: 'Ja! Nach Ihrem Besuch können Sie auf DesireMap eine authentische Bewertung hinterlassen.'
      }
    ],
    mentions: [
      {
        name: 'FKK Clubs in Deutschland',
        url: 'https://desiremap.de/kategorie/fkk',
        type: 'Service'
      },
      {
        name: 'Laufhäuser in Deutschland',
        url: 'https://desiremap.de/kategorie/laufhaus',
        type: 'Service'
      },
      {
        name: 'Bordelle in Deutschland',
        url: 'https://desiremap.de/kategorie/bordell',
        type: 'Service'
      },
      {
        name: 'Berlin',
        url: 'https://desiremap.de/stadt/berlin',
        type: 'Thing'
      },
      {
        name: 'Hamburg',
        url: 'https://desiremap.de/stadt/hamburg',
        type: 'Thing'
      },
      {
        name: 'Frankfurt',
        url: 'https://desiremap.de/stadt/frankfurt',
        type: 'Thing'
      }
    ],
    commentCount: 47
  }
]

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getAllBlogPostSlugs(): string[] {
  return blogPosts.map((post) => post.slug)
}

export function getRelatedBlogPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  return blogPosts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, limit)
}
