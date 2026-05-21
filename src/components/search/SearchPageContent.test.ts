import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'

function readLocalFile(relativePathFromThisFile: string): string {
  return readFileSync(new URL(relativePathFromThisFile, import.meta.url), 'utf8')
}

describe('Search page hero image semantics', () => {
  test('uses non-empty alt text for search page background images', () => {
    const sharedSearchPage = readLocalFile('./SearchPageContent.tsx')
    const appSearchPage = readLocalFile('../../app/[locale]/search/SearchPageContent.tsx')

    expect(sharedSearchPage).not.toContain('alt=""')
    expect(appSearchPage).not.toContain('alt=""')
    expect(sharedSearchPage).toContain("alt={t('results')}")
    expect(appSearchPage).toContain("alt={t('results')}")
    expect(sharedSearchPage).toContain('aria-hidden="true"')
    expect(appSearchPage).toContain('aria-hidden="true"')
  })
})
