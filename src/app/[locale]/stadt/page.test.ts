import { describe, expect, test } from 'bun:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { PublicCity } from '@/types'

import { generateMetadata, getStadtCardCopy, getStadtSeoContent, getStadtSeoWordCount, StadtSeoSection } from './page'

describe('stadt page metadata', () => {
  test('includes canonical, description, and Open Graph metadata for the German index URL', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'de' }),
    })

    expect(metadata.title).toBe('FKK Clubs & Studios nach Stadt finden in DE | DesireMap')
    expect(metadata.description).toContain('FKK Clubs')
    expect(metadata.description).toContain('Berlin, Hamburg, München')
    expect(metadata.description).toContain('schneller')
    expect(metadata.description?.length).toBeGreaterThanOrEqual(120)
    expect(metadata.description?.length).toBeLessThanOrEqual(180)
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

  test('keeps German stadt SEO copy above 700 words', () => {
    expect(getStadtSeoWordCount('de')).toBeGreaterThanOrEqual(700)
  })

  test('uses a category-rich German H1 for easier city discovery intent', () => {
    const seoContent = getStadtSeoContent('de')

    expect(seoContent.heroTitle).toContain('FKK Clubs')
    expect(seoContent.heroTitle).toContain('Bordelle')
    expect(seoContent.heroTitle).toContain('Laufhäuser')
    expect(seoContent.heroTitle).toContain('Studios')
  })

  test('prefers localized subtitle and description on city cards', () => {
    const city: PublicCity = {
      id: 1,
      slug: 'berlin',
      name: 'Berlin',
      subtitle: { de: 'Diskret suchen, schneller finden' },
      description: { de: 'Geprüfte FKK Clubs, Bordelle, Laufhäuser und Studios für Berlin. {#berlin bordell} {#berlin fkk club}' },
    }

    expect(getStadtCardCopy(city, 'de')).toEqual({
      subtitle: 'Diskret suchen, schneller finden',
      description: 'Geprüfte FKK Clubs, Bordelle, Laufhäuser und Studios für Berlin.',
    })
  })

  test('renders faq section with details and summary semantics', () => {
    const html = renderToStaticMarkup(createElement(StadtSeoSection, { locale: 'de' }))

    expect(html).toContain('<details')
    expect(html).toContain('<summary')
    expect(html).toContain('<p')
    expect(html).not.toContain('<dt')
    expect(html).not.toContain('<dd')
  })
})
