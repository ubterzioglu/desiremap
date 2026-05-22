import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'

function readLocalFile(relativePathFromThisFile: string) {
  return readFileSync(new URL(relativePathFromThisFile, import.meta.url), 'utf8')
}

describe('blog route contracts', () => {
  test('blog index uses locale-safe helpers instead of hardcoded default-locale prefixes', () => {
    const source = readLocalFile('./page.tsx')

    expect(source).toContain("getLocalizedPath(locale, `/blog/${post.slug}`)")
    expect(source).toContain("getLocalizedPath(locale, '/')")
    expect(source).not.toContain("href={`/${locale}/blog/${post.slug}`}")
    expect(source).not.toContain("href={`/${locale}`}")
  })

  test('blog detail breadcrumb and CTA use locale-safe helpers', () => {
    const source = readLocalFile('./[slug]/page.tsx')

    expect(source).toContain("getLocalizedPath(locale, '/')")
    expect(source).toContain("getLocalizedPath(locale, '/blog')")
    expect(source).not.toContain("href={`/${locale}`}")
    expect(source).not.toContain("href={`/${locale}/blog`}")
  })
})
