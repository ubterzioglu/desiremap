import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'

import {
  AGE_VERIFICATION_COOKIE_NAME,
  buildAgeVerificationCookie,
  hasAgeVerificationCookie,
  shouldRenderAgeGate,
} from './ageGate'

function readLocalFile(relativePathFromThisFile: string): string {
  return readFileSync(new URL(relativePathFromThisFile, import.meta.url), 'utf8')
}

describe('age gate helpers', () => {
  test('only renders for mounted human visitors without verified cookie', () => {
    expect(shouldRenderAgeGate({ hasMounted: false, hasVerifiedAge: false, userAgent: 'Mozilla/5.0' })).toBe(false)
    expect(shouldRenderAgeGate({ hasMounted: true, hasVerifiedAge: true, userAgent: 'Mozilla/5.0' })).toBe(false)
    expect(shouldRenderAgeGate({ hasMounted: true, hasVerifiedAge: false, userAgent: 'Mozilla/5.0' })).toBe(true)
  })

  test('bypasses known bot user agents', () => {
    expect(
      shouldRenderAgeGate({
        hasMounted: true,
        hasVerifiedAge: false,
        userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1)',
      }),
    ).toBe(false)
  })

  test('parses and builds persistent age verification cookies', () => {
    expect(hasAgeVerificationCookie(`${AGE_VERIFICATION_COOKIE_NAME}=1; foo=bar`)).toBe(true)
    expect(hasAgeVerificationCookie('foo=bar')).toBe(false)

    const cookie = buildAgeVerificationCookie()
    expect(cookie).toContain(`${AGE_VERIFICATION_COOKIE_NAME}=1`)
    expect(cookie).toContain('path=/')
    expect(cookie.toLowerCase()).toContain('samesite=lax')
    expect(cookie.toLowerCase()).toContain('secure')
  })
})

describe('age gate integration', () => {
  test('uses a client-only age gate component with the 18plus asset in locale layout', () => {
    const componentSource = readLocalFile('../components/layout/AgeGate.tsx')
    const layoutSource = readLocalFile('../app/[locale]/layout.tsx')

    expect(componentSource.startsWith("'use client'"))
      .toBe(true)
    expect(componentSource).toContain('/18plus.png')
    expect(layoutSource).toContain("import { AgeGate } from '@/components/layout/AgeGate'")
    expect(layoutSource).toContain('<AgeGate />')
  })
})
