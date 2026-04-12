import { describe, expect, test } from 'bun:test'
import { NextRequest } from 'next/server'

import middleware from '../../middleware'

function runRootRequest(options?: {
  acceptLanguage?: string
  localeCookie?: string
}) {
  const headers = new Headers()

  if (options?.acceptLanguage) {
    headers.set('accept-language', options.acceptLanguage)
  }

  if (options?.localeCookie) {
    headers.set('cookie', `NEXT_LOCALE=${options.localeCookie}`)
  }

  return middleware(new NextRequest('https://desiremap.de/', { headers }))
}

describe('locale middleware root routing', () => {
  test('keeps the root path unprefixed for Turkish browser language', () => {
    const response = runRootRequest({ acceptLanguage: 'tr' })

    expect(response?.headers.get('location')).toBeNull()
  })

  test('keeps the root path unprefixed even when NEXT_LOCALE is Turkish', () => {
    const response = runRootRequest({ localeCookie: 'tr' })

    expect(response?.headers.get('location')).toBeNull()
  })
})
