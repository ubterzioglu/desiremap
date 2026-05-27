import { describe, expect, test } from 'bun:test'

import { getPostAuthRedirect, resolveGoogleClientId } from './member-auth'

describe('resolveGoogleClientId', () => {
  test('returns the first non-empty client id from a comma-separated env value', () => {
    expect(resolveGoogleClientId('  first-client.apps.googleusercontent.com , second-client.apps.googleusercontent.com ')).toBe('first-client.apps.googleusercontent.com')
  })

  test('returns null when the env value is empty or missing', () => {
    expect(resolveGoogleClientId('   ')).toBeNull()
    expect(resolveGoogleClientId(undefined)).toBeNull()
    expect(resolveGoogleClientId(null)).toBeNull()
  })
})

describe('getPostAuthRedirect', () => {
  test('keeps the default locale on the root path', () => {
    expect(getPostAuthRedirect('de')).toBe('/')
  })

  test('prefixes non-default locales', () => {
    expect(getPostAuthRedirect('en')).toBe('/en')
  })
})
