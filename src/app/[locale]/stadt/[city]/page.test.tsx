import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { CitySearchTagsSection, getCityDescriptionContent } from './page'

const berlinCity = {
  slug: 'berlin',
  name: 'Berlin',
  description: {
    de: 'Berlin bietet geprüfte Adressen mit klarer lokaler Einordnung.',
    en: 'Berlin offers verified venues with clear local discovery.',
    tr: 'Berlin yerel olarak kolay bulunan doğrulanmış mekanlar sunar.',
    ar: 'تقدم برلين أماكن موثقة مع وصول محلي واضح.',
  },
}

describe('City page search tags', () => {
  test('normalizes visible description and extracts localized tags', () => {
    const content = getCityDescriptionContent(berlinCity, 'tr')

    expect(content.normalizedDescription).toBe('Berlin yerel olarak kolay bulunan doğrulanmış mekanlar sunar.')
    expect(content.descriptionWithTags).toContain('{#Berlin genelev}')
    expect(content.descriptionWithTags).toContain('{#Berlin sikiş}')
    expect(content.normalizedDescription).not.toContain('{#')
    expect(content.searchTags).toEqual(expect.arrayContaining(['Berlin genelev', 'Berlin sikiş']))
  })

  test('renders tag links without brace syntax and with encoded search hrefs', () => {
    const html = renderToStaticMarkup(
      <CitySearchTagsSection
        heading="Tags"
        description="Popular phrases"
        tags={['Berlin genelev', 'Berlin fkk kulübü']}
        locale="tr"
        citySlug="berlin"
        cityName="Berlin"
        availableCategories={['fkk', 'sauna']}
      />,
    )

    expect(html).toContain('Berlin genelev')
    expect(html).toContain('Berlin fkk kulübü')
    expect(html).not.toContain('{#')
    expect(html).toContain('/tr/search?city=berlin')
    expect(html).toContain('/tr/search?city=berlin&amp;category=fkk')
    expect(html).not.toContain('/tr/search?q=Berlin+genelev&amp;city=berlin')
    expect(html).not.toContain('/tr/search?q=Berlin+fkk+kul%C3%BCb%C3%BC&amp;city=berlin')
  })

  test('returns no markup when tag list is empty', () => {
    const html = renderToStaticMarkup(
      <CitySearchTagsSection
        heading="Tags"
        description="Popular phrases"
        tags={[]}
        locale="de"
        citySlug="berlin"
        cityName="Berlin"
        availableCategories={[]}
      />,
    )

    expect(html).toBe('')
  })
})
