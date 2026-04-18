import { test, expect } from '@playwright/test'

test('home page shows real establishment data', async ({ page }) => {
  const apiResponses: Record<string, unknown> = {}

  page.on('response', async res => {
    const url = res.url()
    if (url.includes('/api/public/')) {
      const key = url.replace(/.*\/api\/public\//, '').replace(/\?.*/, '')
      try { apiResponses[key] = await res.json() } catch { /* ignore */ }
    }
  })

  await page.goto('https://desiremap.de', { waitUntil: 'networkidle' })
  await page.waitForTimeout(4000)

  // BFF responses
  console.log('establishments BFF:', JSON.stringify(apiResponses['establishments']).slice(0, 200))
  console.log('service-types BFF:', JSON.stringify(apiResponses['service-types']).slice(0, 100))
  console.log('cities BFF:', JSON.stringify(apiResponses['cities']).slice(0, 100))

  // DOM checks
  const countText = await page.locator('text=/\\d+ verifizierte Betriebe/').textContent().catch(() => 'NOT FOUND')
  console.log('Count text:', countText)

  const cardCount = await page.locator('[class*="rounded-2xl"]').count()
  console.log('Card elements:', cardCount)

  const categoryButtons = await page.locator('button').filter({ hasText: /Sauna|Wellness|Bordell|Studio/i }).count()
  console.log('Category buttons:', categoryButtons)

  await page.screenshot({ path: 'test-results/home-after-fix.png', fullPage: false })

  expect(countText).not.toBe('NOT FOUND')
  expect(countText).not.toContain('0 verifizierte')
})
