import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'bun:test'

function readLocalFile(relativePathFromThisFile: string) {
  return readFileSync(new URL(relativePathFromThisFile, import.meta.url), 'utf8')
}

const headerSource = readLocalFile('./Header.tsx')
const mobileMenuSource = readLocalFile('./MobileMenu.tsx')

describe('Header login fallback', () => {
  test('renders a localized login link even when no callback is provided', () => {
    expect(headerSource).toContain("const loginPath = getLocalizedPath(locale, '/login')")
    expect(headerSource).toContain('asChild')
    expect(headerSource).toContain('<Link href={loginPath}>')
  })

  test('keeps mobile navigation able to reach the localized login page', () => {
    expect(mobileMenuSource).toContain("const loginPath = getLocalizedPath(locale, '/login')")
    expect(mobileMenuSource).toContain('href={loginPath}')
  })
})
