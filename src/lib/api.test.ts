import { describe, expect, mock, test } from 'bun:test'

import { bookingApi } from './api'

describe('booking API contract', () => {
  test('blocks the stale legacy /bookings submission path before any network call', async () => {
    const originalFetch = globalThis.fetch
    const fetchSpy = mock(() => Promise.reject(new Error('fetch should not be called')))

    // @ts-expect-error test override
    globalThis.fetch = fetchSpy

    try {
      await expect(
        bookingApi.create({
          bordellId: 'leierkasten-munchen',
          date: '2026-05-22',
          time: '11:00',
          duration: 30,
          price: 35,
        })
      ).rejects.toThrow('neue DesireMap-Reservierungssystem')
      expect(fetchSpy).not.toHaveBeenCalled()
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
