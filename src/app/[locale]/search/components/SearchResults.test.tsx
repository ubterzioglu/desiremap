import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { SearchResults } from './SearchResults'

const translations = {
  found: 'Ergebnisse gefunden',
  sponsored: 'Gesponsert',
  premium: 'Premium',
  noResults: 'Keine Ergebnisse gefunden',
  noResultsHint: 'Versuchen Sie andere Suchbegriffe oder entfernen Sie Filter',
  clearFilters: 'Filter entfernen',
}

describe('SearchResults', () => {
  test('renders loading state instead of false empty-state during fetch', () => {
    const html = renderToStaticMarkup(
      <SearchResults
        sponsoredResults={[]}
        regularResults={[]}
        totalCount={0}
        isLoading
        translations={translations}
        locale="de"
        onClearFiltersAction={() => {}}
      />,
    )

    expect(html).toContain('data-testid="search-results-loading"')
    expect(html).not.toContain('Keine Ergebnisse gefunden')
  })

  test('renders no-results state only after loading ends', () => {
    const html = renderToStaticMarkup(
      <SearchResults
        sponsoredResults={[]}
        regularResults={[]}
        totalCount={0}
        isLoading={false}
        translations={translations}
        locale="de"
        onClearFiltersAction={() => {}}
      />,
    )

    expect(html).toContain('Keine Ergebnisse gefunden')
  })
})
