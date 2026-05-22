import { describe, expect, test } from 'bun:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Footer } from './Footer'

describe('Footer', () => {
  test('renders canonical German category and legal links with the current year', () => {
    const html = renderToStaticMarkup(createElement(Footer, { locale: 'de' }))
    const currentYear = new Date().getFullYear()

    expect(html).toContain('href="/kategorie/fkk"')
    expect(html).toContain('href="/kategorie/laufhaus"')
    expect(html).toContain('href="/kategorie/bordell"')
    expect(html).toContain('href="/kategorie/studio"')
    expect(html).toContain('href="/impressum"')
    expect(html).toContain('href="/datenschutz"')
    expect(html).toContain('href="/agb"')
    expect(html).toContain('href="/kontakt"')
    expect(html).toContain(`© ${currentYear}`)
    expect(html).not.toContain('© 2024')
  })
})
