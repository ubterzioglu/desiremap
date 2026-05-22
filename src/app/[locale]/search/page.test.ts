import { describe, expect, test } from 'bun:test'

import { generateMetadata } from './page'

describe('Search page metadata', () => {
  test('uses display city label instead of raw slug in metadata title', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'de' }),
      searchParams: Promise.resolve({ city: 'koeln', q: 'bordell' }),
    })

    expect(metadata.title).toContain('Köln')
    expect(metadata.title).not.toContain('koeln')
  })
})
