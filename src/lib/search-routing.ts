import { citiesData } from '@/data/cities'

type SearchPathParams = {
  q?: string
  city?: string
  category?: string
}

type ResolvedSearchCity = {
  slug: string
  name: string
}

const categoryAliases: Record<string, string> = {
  bordell: 'bordell',
  bordelle: 'bordell',
  brothel: 'bordell',
  brothels: 'bordell',
  genelev: 'bordell',
  kerhane: 'bordell',
  laufhaus: 'laufhaus',
  laufhaeuser: 'laufhaus',
  fkk: 'fkk',
  fkkclub: 'fkk',
  fkkclubs: 'fkk',
  sauna: 'sauna',
  saunaclub: 'sauna',
  studio: 'studio',
  studios: 'studio',
  thermalspa: 'thermal-spa',
  wellness: 'wellness',
}

const searchCategoryLabels: Record<string, string> = {
  bordell: 'brothels',
  fkk: 'FKK clubs',
  laufhaus: 'laufhaus',
  massage: 'massage',
  privat: 'private venues',
  sauna: 'sauna clubs',
  studio: 'studios',
  'thermal-spa': 'thermal spa',
  wellness: 'wellness venues',
}

const cityAliases: Record<string, string[]> = {
  berlin: ['Berlin', 'برلين'],
  hamburg: ['Hamburg', 'هامبورغ'],
  muenchen: ['München', 'Munich', 'Münih', 'ميونخ'],
  koeln: ['Köln', 'Cologne', 'كولونيا'],
  frankfurt: ['Frankfurt', 'فرانكفورت'],
  duesseldorf: ['Düsseldorf', 'Dusseldorf', 'دوسلدورف'],
  stuttgart: ['Stuttgart', 'شتوتغارت'],
  nuernberg: ['Nürnberg', 'Nuremberg', 'Nürnberg', 'نورنبرغ'],
  karlsruhe: ['Karlsruhe', 'كارلسروه', 'Ettlingen', 'إتلينغن'],
}

const supportedCategorySlugs = new Set([
  'bordell',
  'fkk',
  'laufhaus',
  'massage',
  'privat',
  'sauna',
  'studio',
  'thermal-spa',
  'wellness',
])

const categoryMatchers = [
  {
    category: 'bordell',
    mode: 'always',
    patterns: ['bordell', 'brothel'],
  },
  {
    category: 'bordell',
    mode: 'inventory-aware',
    patterns: ['genelev', 'kerhane', 'orospu', 'sikiş', 'red light', 'بيت دعارة', 'سكس'],
  },
  {
    category: 'laufhaus',
    mode: 'always',
    patterns: ['laufhaus'],
  },
  {
    category: 'fkk',
    mode: 'always',
    patterns: ['fkk club', 'fkk kulübü', 'نادي fkk'],
  },
  {
    category: 'sauna',
    mode: 'always',
    patterns: ['saunaclub', 'sauna club', 'fkk sauna', 'ساونا كلوب'],
  },
  {
    category: 'studio',
    mode: 'always',
    patterns: ['studio', 'استوديو'],
  },
] as const

function normalizeComparable(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, '')
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getAliasesForCity(slug: string, name: string): string[] {
  return [slug, name, ...(cityAliases[slug] ?? [])]
}

function stripLeadingCityToken(tag: string, city: ResolvedSearchCity): string {
  const candidates = getAliasesForCity(city.slug, city.name).sort((left, right) => right.length - left.length)

  for (const candidate of candidates) {
    const pattern = new RegExp(`^${escapeRegExp(candidate)}(?:\\s+|[-–—:]+)?`, 'iu')
    if (pattern.test(tag)) {
      return tag.replace(pattern, '').trim()
    }
  }

  return tag.trim()
}

function detectSearchCategory(rawTag: string): { category: string; mode: 'always' | 'inventory-aware' } | null {
  const normalizedTag = rawTag.trim().toLowerCase()

  for (const matcher of categoryMatchers) {
    if (matcher.patterns.some((pattern) => normalizedTag.includes(pattern.toLowerCase()))) {
      return supportedCategorySlugs.has(matcher.category)
        ? { category: matcher.category, mode: matcher.mode }
        : null
    }
  }

  return null
}

export function resolveSearchCity(city?: string): ResolvedSearchCity | null {
  if (!city?.trim()) {
    return null
  }

  const comparable = normalizeComparable(city)

  for (const entry of citiesData) {
    const aliases = getAliasesForCity(entry.slug, entry.name)
    if (aliases.some((alias) => normalizeComparable(alias) === comparable)) {
      return {
        slug: entry.slug,
        name: entry.name,
      }
    }
  }

  return null
}

export function normalizeSearchCityParam(city?: string): string {
  const resolved = resolveSearchCity(city)
  return resolved?.slug ?? city?.trim() ?? ''
}

export function getSearchCityDisplayName(city?: string): string {
  const resolved = resolveSearchCity(city)
  return resolved?.name ?? city?.trim() ?? ''
}

export function normalizeSearchCategoryParam(category?: string): string {
  if (!category?.trim()) {
    return ''
  }

  const comparable = normalizeComparable(category)
  const normalized = categoryAliases[comparable] ?? category.trim().toLowerCase()

  return supportedCategorySlugs.has(normalized) ? normalized : ''
}

export function getSearchCategoryLabel(category?: string): string {
  const normalized = normalizeSearchCategoryParam(category)
  return normalized ? (searchCategoryLabels[normalized] ?? normalized) : ''
}

export function buildSearchTagParams({
  tag,
  citySlug,
  cityName,
  availableCategories = [],
}: {
  tag: string
  citySlug: string
  cityName: string
  availableCategories?: string[]
}): SearchPathParams {
  const city = resolveSearchCity(citySlug) ?? resolveSearchCity(cityName) ?? { slug: citySlug, name: cityName }
  const strippedTag = stripLeadingCityToken(tag, city)
  const detectedCategory = detectSearchCategory(strippedTag)
  const normalizedAvailableCategories = availableCategories
    .map((value) => normalizeSearchCategoryParam(value))
    .filter(Boolean)

  if (detectedCategory) {
    if (detectedCategory.mode === 'inventory-aware' && normalizedAvailableCategories.length === 0) {
      return {
        city: city.slug,
      }
    }

    if (
      normalizedAvailableCategories.length > 0
      && !normalizedAvailableCategories.includes(detectedCategory.category)
    ) {
      return {
        city: city.slug,
      }
    }

    return {
      city: city.slug,
      category: detectedCategory.category,
    }
  }

  return strippedTag
    ? {
        city: city.slug,
        q: strippedTag,
      }
    : {
        city: city.slug,
      }
}

export function normalizeIncomingSearchParams({
  q,
  city,
  category,
}: {
  q?: string
  city?: string
  category?: string
}): SearchPathParams {
  const trimmedQuery = q?.trim() ?? ''
  const normalizedCategory = normalizeSearchCategoryParam(category)
  const normalizedCity = normalizeSearchCityParam(city)

  if (!normalizedCategory && trimmedQuery && normalizedCity) {
    const resolvedCity = resolveSearchCity(normalizedCity)
    const cityName = resolvedCity?.name ?? getSearchCityDisplayName(city)
    const strippedQuery = stripLeadingCityToken(trimmedQuery, {
      slug: normalizedCity,
      name: cityName,
    })

    if (strippedQuery !== trimmedQuery) {
      return buildSearchTagParams({
        tag: trimmedQuery,
        citySlug: normalizedCity,
        cityName,
      })
    }
  }

  return {
    ...(trimmedQuery ? { q: trimmedQuery } : {}),
    ...(normalizedCity ? { city: normalizedCity } : {}),
    ...(normalizedCategory ? { category: normalizedCategory } : {}),
  }
}
