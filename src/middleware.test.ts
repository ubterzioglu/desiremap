import { afterEach, describe, expect, test } from 'bun:test'
import { NextRequest } from 'next/server'

import { proxy } from './proxy'

type FetchCall = [RequestInfo | URL, RequestInit | undefined]

function createWaitUntilEvent(): {
  event: Parameters<typeof proxy>[1]
  pending: Promise<unknown>[]
} {
  const pending: Promise<unknown>[] = []
  const event = {
    waitUntil(promise: Promise<unknown>): void {
      pending.push(promise)
    },
  } as Parameters<typeof proxy>[1]

  return { event, pending }
}

const originalBackendUrl = process.env.BACKEND_API_URL
const originalTrackingToken = process.env.INTERNAL_TRACKING_TOKEN
const originalFetch = globalThis.fetch

afterEach(() => {
  process.env.BACKEND_API_URL = originalBackendUrl
  process.env.INTERNAL_TRACKING_TOKEN = originalTrackingToken
  globalThis.fetch = originalFetch
})

describe('middleware page-view tracking', () => {
  test('records public page views with normalized backend URL and bot metadata', async () => {
    process.env.BACKEND_API_URL = 'https://api.example.test/api/'
    process.env.INTERNAL_TRACKING_TOKEN = 'internal-secret'
    const calls: FetchCall[] = []
    globalThis.fetch = (async (input, init) => {
      calls.push([input, init])
      return new Response(null, { status: 204 })
    }) as typeof fetch

    const request = new NextRequest('https://desiremap.de/stadt/muenchen', {
      method: 'GET',
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'x-forwarded-for': '66.249.66.1, 10.0.0.2',
        referer: 'https://www.google.com/',
      },
    })
    const { event, pending } = createWaitUntilEvent()

    proxy(request, event)
    await Promise.all(pending)

    expect(calls).toHaveLength(1)
    const firstCall = calls[0]
    expect(firstCall).toBeDefined()
    if (!firstCall) throw new Error('fetch was not called')
    const [url, init] = firstCall
    expect(url).toBe('https://api.example.test/api/internal/page-view')
    expect(init?.method).toBe('POST')
    expect(new Headers(init?.headers).get('X-Internal-Token')).toBe('internal-secret')
    expect(JSON.parse(String(init?.body))).toMatchObject({
      path: '/stadt/muenchen',
      method: 'GET',
      ip: '66.249.66.1',
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      referer: 'https://www.google.com/',
      botName: 'Googlebot',
    })
  })

  test('does not record Next API route requests as frontend page views', async () => {
    process.env.BACKEND_API_URL = 'https://api.example.test/api'
    process.env.INTERNAL_TRACKING_TOKEN = 'internal-secret'
    const calls: FetchCall[] = []
    globalThis.fetch = (async (input, init) => {
      calls.push([input, init])
      return new Response(null, { status: 204 })
    }) as typeof fetch

    const request = new NextRequest('https://desiremap.de/api/public/hero', {
      method: 'GET',
      headers: { 'user-agent': 'Mozilla/5.0' },
    })
    const { event, pending } = createWaitUntilEvent()

    proxy(request, event)
    await Promise.all(pending)

    expect(calls).toHaveLength(0)
  })
})

describe('middleware crawler and abuse filtering', () => {
  test('detects priority crawler user agents for SOC bot labels', async () => {
    process.env.BACKEND_API_URL = 'https://api.example.test/api'
    process.env.INTERNAL_TRACKING_TOKEN = 'internal-secret'
    const bodies: unknown[] = []
    globalThis.fetch = (async (_input, init) => {
      bodies.push(JSON.parse(String(init?.body)))
      return new Response(null, { status: 204 })
    }) as typeof fetch

    const userAgents = [
      {
        ua: 'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)',
        botName: 'Meta External Agent',
      },
      {
        ua: 'Mozilla/5.0 (Linux; Android 7.0;) AppleWebKit/537.36 (HTML, like Gecko) Mobile Safari/537.36 (compatible; PetalBot;+https://webmaster.petalsearch.com/site/petalbot)',
        botName: 'PetalBot',
      },
      {
        ua: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        botName: 'Googlebot',
      },
      { ua: 'Mozilla/5.0 (compatible; Googlebot/2.1)', botName: 'Googlebot' },
      { ua: 'GPTBot/1.2; +https://openai.com/gptbot', botName: 'GPTBot' },
      { ua: 'Google-Extended', botName: 'Google-Extended' },
      { ua: 'GoogleOther', botName: 'GoogleOther' },
      { ua: 'Gemini-Deep-Research', botName: 'Gemini Deep Research' },
      { ua: 'ClaudeBot/1.0', botName: 'ClaudeBot' },
      { ua: 'Claude-SearchBot/1.0', botName: 'Claude SearchBot' },
    ]

    for (const { ua } of userAgents) {
      const request = new NextRequest('https://desiremap.de/stadt/muenchen', {
        method: 'GET',
        headers: { 'user-agent': ua },
      })
      const { event, pending } = createWaitUntilEvent()
      proxy(request, event)
      await Promise.all(pending)
    }

    expect(bodies.map((body) => (body as { botName: string }).botName)).toEqual(
      userAgents.map(({ botName }) => botName),
    )
  })

  test('permanently redirects forbidden /de paths to canonical non-locale paths without tracking', async () => {
    process.env.BACKEND_API_URL = 'https://api.example.test/api'
    process.env.INTERNAL_TRACKING_TOKEN = 'internal-secret'
    const calls: FetchCall[] = []
    globalThis.fetch = (async (input, init) => {
      calls.push([input, init])
      return new Response(null, { status: 204 })
    }) as typeof fetch

    const request = new NextRequest('https://desiremap.de/de/stadt/muenchen?utm=bot', {
      method: 'GET',
      headers: { 'user-agent': 'Mozilla/5.0' },
    })
    const { event, pending } = createWaitUntilEvent()

    const response = proxy(request, event)
    await Promise.all(pending)

    expect(response.status).toBe(308)
    expect(response.headers.get('location')).toBe('https://desiremap.de/stadt/muenchen?utm=bot')
    expect(calls).toHaveLength(0)
  })
})

describe('middleware abuse signal handling', () => {
  test('labels empty user agents and extracts public IPs from suspicious proxy chains', async () => {
    process.env.BACKEND_API_URL = 'https://api.example.test/api'
    process.env.INTERNAL_TRACKING_TOKEN = 'internal-secret'
    const bodies: unknown[] = []
    globalThis.fetch = (async (_input, init) => {
      bodies.push(JSON.parse(String(init?.body)))
      return new Response(null, { status: 204 })
    }) as typeof fetch

    const request = new NextRequest('https://desiremap.de/stadt/muenchen', {
      method: 'GET',
      headers: {
        'user-agent': '   ',
        'x-forwarded-for': '127.0.0.1:66.249.66.1, 10.0.0.12',
        'x-real-ip': '127.0.0.1',
      },
    })
    const { event, pending } = createWaitUntilEvent()

    proxy(request, event)
    await Promise.all(pending)

    expect(bodies).toHaveLength(1)
    expect(bodies[0]).toMatchObject({
      ip: '66.249.66.1',
      userAgent: '',
      botName: 'Empty User-Agent',
    })
  })

  test('extracts public IPs after repeated loopback hops in forwarded headers', async () => {
    process.env.BACKEND_API_URL = 'https://api.example.test/api'
    process.env.INTERNAL_TRACKING_TOKEN = 'internal-secret'
    const bodies: unknown[] = []
    globalThis.fetch = (async (_input, init) => {
      bodies.push(JSON.parse(String(init?.body)))
      return new Response(null, { status: 204 })
    }) as typeof fetch

    const forwardedHeaders = [
      { header: '127.0.0.1, 185.177.72.31', expectedIp: '185.177.72.31' },
      { header: '127.0.0.1, 127.0.0.1, 185.177.72.205', expectedIp: '185.177.72.205' },
    ]

    for (const { header } of forwardedHeaders) {
      const request = new NextRequest('https://desiremap.de/stadt/muenchen', {
        method: 'GET',
        headers: {
          'user-agent': 'Mozilla/5.0',
          'x-forwarded-for': header,
        },
      })
      const { event, pending } = createWaitUntilEvent()
      proxy(request, event)
      await Promise.all(pending)
    }

    expect(bodies.map((body) => (body as { ip: string }).ip)).toEqual(
      forwardedHeaders.map(({ expectedIp }) => expectedIp),
    )
  })

  test('falls back to the first public IPv6 address when no public IPv4 exists', async () => {
    process.env.BACKEND_API_URL = 'https://api.example.test/api'
    process.env.INTERNAL_TRACKING_TOKEN = 'internal-secret'
    const bodies: unknown[] = []
    globalThis.fetch = (async (_input, init) => {
      bodies.push(JSON.parse(String(init?.body)))
      return new Response(null, { status: 204 })
    }) as typeof fetch

    const request = new NextRequest('https://desiremap.de/stadt/muenchen', {
      method: 'GET',
      headers: {
        'user-agent': 'Mozilla/5.0',
        'x-forwarded-for': '::1, 2001:4860:4860::8888',
      },
    })
    const { event, pending } = createWaitUntilEvent()

    proxy(request, event)
    await Promise.all(pending)

    expect(bodies).toHaveLength(1)
    expect(bodies[0]).toMatchObject({ ip: '2001:4860:4860::8888' })
  })

  test('blocks empty user-agent requests after logging them to SOC', async () => {
    process.env.BACKEND_API_URL = 'https://api.example.test/api'
    process.env.INTERNAL_TRACKING_TOKEN = 'internal-secret'
    const bodies: unknown[] = []
    globalThis.fetch = (async (_input, init) => {
      bodies.push(JSON.parse(String(init?.body)))
      return new Response(null, { status: 204 })
    }) as typeof fetch

    const request = new NextRequest('https://desiremap.de/stadt/muenchen', {
      method: 'GET',
      headers: {
        'user-agent': '   ',
        'x-forwarded-for': '127.0.0.1, 185.177.72.31',
      },
    })
    const { event, pending } = createWaitUntilEvent()

    const response = proxy(request, event)
    await Promise.all(pending)

    expect(response.status).toBe(403)
    expect(bodies).toHaveLength(1)
    expect(bodies[0]).toMatchObject({
      ip: '185.177.72.31',
      userAgent: '',
      botName: 'Empty User-Agent',
    })
  })
})
