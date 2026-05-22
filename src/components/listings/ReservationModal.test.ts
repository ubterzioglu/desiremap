import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'

function readLocalFile(relativePathFromThisFile: string) {
  return readFileSync(new URL(relativePathFromThisFile, import.meta.url), 'utf8')
}

describe('Reservation modal contract', () => {
  test('step three requires terms acceptance and links to localized AGB', () => {
    const source = readLocalFile('./ReservationModal.tsx')

    expect(source).toContain('acceptedTerms')
    expect(source).toContain('Checkbox')
    expect(source).toContain("getLocalizedPath(locale, '/agb')")
    expect(source).toContain("tReservation('termsLabel')")
    expect(source).toContain("tReservation('termsDescription')")
    expect(source).toContain("tReservation('termsLinkLabel')")
    expect(source).toContain('aria-invalid')
  })
})
