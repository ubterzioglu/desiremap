import { test, expect, type Page } from '@playwright/test'

async function bypassAgeGate(page: Page) {
  await page.context().addCookies([
    {
      name: 'dm_age_verified',
      value: '1',
      url: 'http://127.0.0.1:3000',
    },
  ])
}

test.describe('stadt seo tags', () => {
  test('stadt faq uses semantic details markup', async ({ page }) => {
    await bypassAgeGate(page)
    await page.goto('/stadt', { waitUntil: 'networkidle' })

    const faqItems = page.locator('details')

    await expect(faqItems.first()).toBeVisible()
    await expect(faqItems.first().locator('summary')).toBeVisible()
    await faqItems.first().locator('summary').click()
    await expect(faqItems.first().locator('p')).toBeVisible()
    await expect(page.locator('dt')).toHaveCount(0)
    await expect(page.locator('dd')).toHaveCount(0)
  })

  test('city tags renders searchable badge links', async ({ page }) => {
    await bypassAgeGate(page)
    await page.goto('/stadt/berlin', { waitUntil: 'networkidle' })

    await expect(page.getByRole('heading', { name: /tags|suchanfragen|etiketler|الوسوم/i })).toBeVisible()
    await expect(page.locator('a[href*="/search?city=berlin&category=bordell"]')).toBeVisible()
    await expect(page.locator('a[href*="/search?city=berlin&category=fkk"]')).toBeVisible()
    await expect(page.locator('main p').filter({ hasText: '{#' })).toHaveCount(0)
  })
})
