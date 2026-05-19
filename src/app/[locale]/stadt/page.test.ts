import { describe, expect, test } from 'bun:test'

import { generateMetadata } from './page'

describe('stadt page metadata', () => {
  test('includes canonical, description, and Open Graph metadata for the German index URL', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'de' }),
    })

    expect(metadata.title).toBe('FKK Clubs & Studios nach Stadt finden in DE | DesireMap')
    expect(metadata.description).toContain('FKK Clubs')
    expect(metadata.description?.length).toBeGreaterThanOrEqual(120)
    expect(metadata.description?.length).toBeLessThanOrEqual(170)
    expect(metadata.alternates?.canonical).toBe('/stadt')
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      siteName: 'DesireMap',
      url: 'https://desiremap.de/stadt',
    })
  })

  test('uses localized metadata for a non-default city index URL', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })

    expect(metadata.title).toBe('Find FKK Clubs & Studios by City in DE | DesireMap')
    expect(metadata.alternates?.canonical).toBe('/en/stadt')
    expect(metadata.openGraph).toMatchObject({
      url: 'https://desiremap.de/en/stadt',
    })
  })
})
