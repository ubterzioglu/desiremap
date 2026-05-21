import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'

function readLocalFile(relativePathFromThisFile: string): string {
  return readFileSync(new URL(relativePathFromThisFile, import.meta.url), 'utf8')
}

describe('LanguageSwitcher crawlability', () => {
  test('keeps desktop locale links in the source without open-only conditional mounting', () => {
    const source = readLocalFile('./LanguageSwitcher.tsx')

    expect(source).toContain('href={getLocalizedPath(lang.code, basePath)}')
    expect(source).not.toContain('{open && (')
  })
})
