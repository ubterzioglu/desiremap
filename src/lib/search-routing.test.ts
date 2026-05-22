import { describe, expect, test } from 'bun:test'

import {
  buildSearchTagParams,
  getSearchCityDisplayName,
  normalizeIncomingSearchParams,
  normalizeSearchCityParam,
  resolveSearchCity,
} from './search-routing'

describe('search routing helpers', () => {
  test('normalizes visible city labels and slugs to canonical slug', () => {
    expect(normalizeSearchCityParam('Köln')).toBe('koeln')
    expect(normalizeSearchCityParam('koeln')).toBe('koeln')
    expect(resolveSearchCity('Köln')).toEqual({ slug: 'koeln', name: 'Köln' })
    expect(getSearchCityDisplayName('koeln')).toBe('Köln')
  })

  test('maps direct category tags to structured search params', () => {
    expect(buildSearchTagParams({ tag: 'Berlin bordell', citySlug: 'berlin', cityName: 'Berlin' })).toEqual({
      city: 'berlin',
      category: 'bordell',
    })

    expect(buildSearchTagParams({ tag: 'Berlin sikiş', citySlug: 'berlin', cityName: 'Berlin' })).toEqual({
      city: 'berlin',
    })
  })

  test('maps sauna-like phrases to the verified sauna category', () => {
    expect(buildSearchTagParams({ tag: 'Berlin fkk sauna', citySlug: 'berlin', cityName: 'Berlin' })).toEqual({
      city: 'berlin',
      category: 'sauna',
    })
  })

  test('normalizes old raw tag URLs into canonical structured search params', () => {
    expect(normalizeIncomingSearchParams({ q: 'Köln bordell', city: 'koeln' })).toEqual({
      city: 'koeln',
      category: 'bordell',
    })
  })

  test('normalizes legacy explicit raw URLs into city-only fallback when inventory is unknown', () => {
    expect(normalizeIncomingSearchParams({ q: 'Berlin sikiş', city: 'berlin' })).toEqual({
      city: 'berlin',
    })
  })

  test('normalizes category aliases into canonical slugs', () => {
    expect(normalizeIncomingSearchParams({ city: 'Köln', category: 'Bordelle' })).toEqual({
      city: 'koeln',
      category: 'bordell',
    })
  })

  test('falls back to city-only route when detected category is unavailable for the city', () => {
    expect(buildSearchTagParams({
      tag: 'Berlin sikiş',
      citySlug: 'berlin',
      cityName: 'Berlin',
      availableCategories: ['fkk', 'sauna'],
    })).toEqual({ city: 'berlin' })
  })
})
