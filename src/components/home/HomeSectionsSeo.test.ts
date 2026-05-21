import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'

function readLocalFile(relativePathFromThisFile: string): string {
  return readFileSync(new URL(relativePathFromThisFile, import.meta.url), 'utf8')
}

describe('Home section icon and SSR visibility guards', () => {
  test('maps distinct icons for expanded category set', () => {
    const source = readLocalFile('./CategoriesSection.tsx')

    expect(source).toContain('massage:')
    expect(source).toContain('sauna:')
    expect(source).toContain('thermal:')
    expect(source).toContain('wellness:')
  })

  test('does not SSR hidden motion states for home sections', () => {
    const files = [
      './CategoriesSection.tsx',
      './FeaturedCities.tsx',
      './SEOContentSection.tsx',
      './PromoSections.tsx',
    ].map(readLocalFile)

    for (const source of files) {
      expect(source).not.toContain('initial={{ opacity: 0')
    }
  })
})
