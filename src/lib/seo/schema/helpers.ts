import { SITE_URL, DEFAULT_LOCALE } from './constants'

/** A single JSON-LD node. Values are intentionally loose (`unknown`) — schema.org shapes vary. */
export type JsonLdNode = Record<string, unknown>

export interface JsonLdGraph {
  '@context': string
  '@graph': JsonLdNode[]
}

export interface BreadcrumbItem {
  name: string
  /** Relative path (e.g. `/stadt/koeln`). Omit on a terminal crumb to render name-only. */
  path?: string
}

const BCP47: Record<string, string> = {
  de: 'de-DE',
  en: 'en-US',
  tr: 'tr-TR',
  ar: 'ar-SA',
}

export function toBcp47(locale: string): string {
  return BCP47[locale] ?? BCP47[DEFAULT_LOCALE] ?? 'de-DE'
}

export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL
  if (path.startsWith('http')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function homeUrl(locale: string): string {
  return locale === DEFAULT_LOCALE ? SITE_URL : `${SITE_URL}/${locale}`
}

/** Best-effort German slug (München → muenchen, Köln → koeln). Matches the `/stadt/<slug>` convention. */
export function germanSlugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Immutably drop `undefined` / `null` / empty-string values from a node (shallow). */
export function prune<T extends JsonLdNode>(node: T): JsonLdNode {
  return Object.fromEntries(
    Object.entries(node).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

export function withGraph(nodes: JsonLdNode[]): JsonLdGraph {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
