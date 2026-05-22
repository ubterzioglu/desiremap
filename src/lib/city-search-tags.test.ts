import { describe, expect, test } from 'bun:test'

import type { PublicCity } from '@/types'

import {
  appendSearchTagsToText,
  extractSearchTags,
  getCitySearchPhrases,
  getTaggedCityDescription,
  stripSearchTags,
} from './city-search-tags'

const berlinCity: Pick<PublicCity, 'slug' | 'name' | 'description'> = {
  slug: 'berlin',
  name: 'Berlin',
  description: {
    de: 'Berlin bietet geprüfte Adressen mit klarer lokaler Einordnung.',
    en: 'Berlin offers verified venues with clear local discovery.',
    tr: 'Berlin yerel olarak kolay bulunan doğrulanmış mekanlar sunar.',
    ar: 'تقدم برلين أماكن موثقة مع وصول محلي واضح.',
  },
}

describe('city search tags helpers', () => {
  test('extracts multi-word brace tags in order', () => {
    const text = 'Berlin bietet Auswahl {#berlin bordell} {#berlin fkk club} {#berlin bordell}'

    expect(extractSearchTags(text)).toEqual(['berlin bordell', 'berlin fkk club'])
  })

  test('strips brace tags without changing visible description', () => {
    const text = 'Berlin bietet geprüfte Adressen. {#berlin bordell} {#berlin fkk club}'

    expect(stripSearchTags(text)).toBe('Berlin bietet geprüfte Adressen.')
  })

  test('returns german fallback phrases for unknown locales', () => {
    expect(getCitySearchPhrases('berlin', 'Berlin', 'es')).toContain('Berlin bordell')
  })

  test('returns generic templates for unknown cities', () => {
    expect(getCitySearchPhrases('bremen', 'Bremen', 'de')).toEqual([
      'Bremen bordell',
      'Bremen laufhaus',
      'Bremen fkk club',
      'Bremen saunaclub',
      'Bremen studio',
    ])
  })

  test('ignores malformed tag blocks during strip', () => {
    expect(stripSearchTags('Berlin {#berlin bordell Berlin bleibt sichtbar')).toBe('Berlin {#berlin bordell Berlin bleibt sichtbar')
  })

  test('deduplicates appended tags', () => {
    expect(appendSearchTagsToText('Berlin', ['berlin bordell', 'berlin bordell', 'berlin fkk'])).toBe(
      'Berlin {#berlin bordell} {#berlin fkk}',
    )
  })

  test('builds tagged city descriptions from localized content', () => {
    const tagged = getTaggedCityDescription(berlinCity, 'tr')

    expect(tagged).toContain('Berlin yerel olarak kolay bulunan doğrulanmış mekanlar sunar.')
    expect(tagged).toContain('{#Berlin genelev}')
    expect(tagged).toContain('{#Berlin sikiş}')
  })
})
