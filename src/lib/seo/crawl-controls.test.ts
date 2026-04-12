import { readFileSync } from 'node:fs'

import { describe, expect, test } from 'bun:test'

import nextConfig from '../../../next.config'

function readLocalFile(relativePathFromThisFile: string) {
  return readFileSync(new URL(relativePathFromThisFile, import.meta.url), 'utf8')
}

describe('crawl controls contracts', () => {
  test('locale layout declares indexable robots metadata for public pages', () => {
    const source = readLocalFile('../../app/[locale]/layout.tsx')

    expect(source).toContain('robots:')
    expect(source).toContain('index: true')
    expect(source).toContain('follow: true')
    expect(source).toContain("'max-image-preview': 'large'")
    expect(source).toContain("'max-snippet': -1")
    expect(source).toContain("'max-video-preview': -1")
  })

  test('next config publishes X-Robots-Tag rules for public and restricted surfaces', async () => {
    const headers = typeof nextConfig.headers === 'function' ? await nextConfig.headers() : []

    expect(headers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: '/',
          headers: expect.arrayContaining([
            expect.objectContaining({
              key: 'X-Robots-Tag',
              value: expect.stringContaining('index, follow')
            })
          ])
        }),
        expect.objectContaining({
          source: '/:locale(en|tr|ar)',
          headers: expect.arrayContaining([
            expect.objectContaining({
              key: 'X-Robots-Tag',
              value: expect.stringContaining('index, follow')
            })
          ])
        }),
        expect.objectContaining({
          source: '/api/:path*',
          headers: expect.arrayContaining([
            expect.objectContaining({
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow'
            })
          ])
        }),
        expect.objectContaining({
          source: '/search',
          headers: expect.arrayContaining([
            expect.objectContaining({
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow'
            })
          ])
        }),
        expect.objectContaining({
          source: '/login',
          headers: expect.arrayContaining([
            expect.objectContaining({
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow'
            })
          ])
        }),
        expect.objectContaining({
          source: '/:locale(en|tr|ar)/login',
          headers: expect.arrayContaining([
            expect.objectContaining({
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow'
            })
          ])
        }),
        expect.objectContaining({
          source: '/admin/:path*',
          headers: expect.arrayContaining([
            expect.objectContaining({
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow'
            })
          ])
        })
      ])
    )
  })
})
