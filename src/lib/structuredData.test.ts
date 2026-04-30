import { describe, expect, test } from 'bun:test'

import { getStructuredData } from './structuredData'

describe('homepage structured data', () => {
  test('returns stable JSON-LD for identical inputs', async () => {
    const first = getStructuredData('de', 'Test title', 'Test description', ['de', 'en', 'tr', 'ar'])

    await new Promise((resolve) => setTimeout(resolve, 5))

    const second = getStructuredData('de', 'Test title', 'Test description', ['de', 'en', 'tr', 'ar'])

    expect(first).toEqual(second)
  })
})
