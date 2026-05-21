import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'

function readLocalFile(relativePathFromThisFile: string): string {
  return readFileSync(new URL(relativePathFromThisFile, import.meta.url), 'utf8')
}

describe('HeroSection SEO semantics', () => {
  test('uses a real GET form for hero search submission', () => {
    const source = readLocalFile('./HeroSection.tsx')

    expect(source).toContain('<form')
    expect(source).toContain('action={getSearchPath(locale)}')
    expect(source).toContain('method="get"')
    expect(source).toContain('type="submit"')
    expect(source).toContain('name="city"')
    expect(source).toContain('name="category"')
  })

  test('renders hero slides with next image instead of inline background images', () => {
    const source = readLocalFile('./HeroSection.tsx')

    expect(source).toContain("import Image from 'next/image'")
    expect(source).toContain('<Image')
    expect(source).toContain('fill')
    expect(source).toContain('priority={index === 0}')
    expect(source).not.toContain('backgroundImage:')
  })

  test('does not ship empty alt text for hero images', () => {
    const source = readLocalFile('./HeroSection.tsx')

    expect(source).not.toContain('alt=""')
    expect(source).toContain('translations.slideLabel')
  })
})
