import { expect, test } from '@playwright/test'

const LOCAL_URL = 'http://127.0.0.1:3000'
const PROD_URL = 'https://desiremap.de'

async function captureHomepage(page: import('@playwright/test').Page, url: string, name: string) {
  const apiResponses: string[] = []

  page.on('response', async (response) => {
    if (response.url().includes('/api/public/establishments')) {
      try {
        apiResponses.push(await response.text())
      } catch {
        apiResponses.push('unreadable')
      }
    }
  })

  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.setViewportSize({ width: 1440, height: 2200 })
  await page.locator('h2').filter({ hasText: /Ausgewaehlte Betriebe/i }).scrollIntoViewIfNeeded()
  await page.locator('text=/\\d+ verifizierte Betriebe/').first().waitFor({ timeout: 15000 })
  await page.waitForTimeout(1500)

  const firstCardImage = await page.locator('img[alt]').filter({ hasNotText: '' }).nth(5).getAttribute('src').catch(() => null)
  const title = await page.locator('h2').filter({ hasText: /Ausgewaehlte Betriebe/i }).textContent().catch(() => null)
  const countText = await page.locator('text=/\\d+ verifizierte Betriebe/').textContent().catch(() => null)

  await page.screenshot({ path: `test-results/${name}.png`, fullPage: false })

  return {
    firstCardImage,
    title,
    countText,
    apiResponses,
  }
}

test('compare local homepage against production homepage', async ({ browser }) => {
  const localPage = await browser.newPage()
  const prodPage = await browser.newPage()

  const local = await captureHomepage(localPage, LOCAL_URL, 'homepage-local')
  const prod = await captureHomepage(prodPage, PROD_URL, 'homepage-prod')

  console.log('local firstCardImage:', local.firstCardImage)
  console.log('prod firstCardImage:', prod.firstCardImage)
  console.log('local countText:', local.countText)
  console.log('prod countText:', prod.countText)
  console.log('local establishments payload:', local.apiResponses[0]?.slice(0, 300) ?? 'missing')
  console.log('prod establishments payload:', prod.apiResponses[0]?.slice(0, 300) ?? 'missing')

  expect(local.title).toBe(prod.title)
  expect(local.countText).toBe(prod.countText)
})
