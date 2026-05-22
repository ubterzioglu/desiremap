import { describe, expect, test } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'

describe('legal placeholder routes', () => {
  test('impressum and kontakt stay as placeholders until legal copy is ready', () => {
    for (const page of ['impressum', 'kontakt'] as const) {
      const fileUrl = new URL(`./${page}/page.tsx`, import.meta.url)

      expect(existsSync(fileUrl)).toBe(true)
      expect(readFileSync(fileUrl, 'utf8')).toContain('wird vorbereitet')
    }
  })

  test('agb contains detailed reservation terms and links to datenschutz', () => {
    const source = readFileSync(new URL('./agb/page.tsx', import.meta.url), 'utf8')

    expect(source).toContain('Reservierung')
    expect(source).toContain('Stornierung')
    expect(source).toContain('Rückerstattung')
    expect(source).toContain('Datenschutz')
    expect(source).toContain('/datenschutz')
  })

  test('datenschutz references reservation handling and links back to agb', () => {
    const source = readFileSync(new URL('./datenschutz/page.tsx', import.meta.url), 'utf8')

    expect(source).toContain('Reservierung')
    expect(source).toContain('personenbezogene Daten')
    expect(source).toContain('AGB')
    expect(source).toContain('/agb')
  })
})
