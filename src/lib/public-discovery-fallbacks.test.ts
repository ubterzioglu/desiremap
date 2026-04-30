import { describe, expect, test } from 'bun:test'

import {
  getFallbackPublicCities,
  getFallbackPublicEstablishments,
  getFallbackPublicServiceTypes,
} from './public-discovery-fallbacks'

describe('public discovery fallbacks', () => {
  test('provides static city payloads when backend discovery is unavailable', () => {
    const cities = getFallbackPublicCities()

    expect(cities.length).toBeGreaterThan(0)
    expect(cities[0]).toHaveProperty('id')
    expect(cities[0]).toHaveProperty('slug')
    expect(cities[0]).toHaveProperty('name')
  })

  test('provides static service type payloads when backend discovery is unavailable', () => {
    const serviceTypes = getFallbackPublicServiceTypes()

    expect(serviceTypes).toEqual([
      { id: 1, slug: 'fkk', name: 'FKK Clubs' },
      { id: 2, slug: 'laufhaus', name: 'Laufhaus' },
      { id: 3, slug: 'bordell', name: 'Bordelle' },
      { id: 4, slug: 'studio', name: 'Studios' },
      { id: 5, slug: 'privat', name: 'Privat' },
    ])
  })

  test('provides static establishments with filtering and pagination', () => {
    const result = getFallbackPublicEstablishments({ type: 'fkk', limit: 2, offset: 0 })

    expect(result.total).toBeGreaterThan(0)
    expect(result.items).toHaveLength(2)
    expect(result.items.every((item) => item.type === 'fkk')).toBe(true)
    expect(result.items[0]).toHaveProperty('slug')
    expect(result.items[0]).toHaveProperty('images')
  })
})
