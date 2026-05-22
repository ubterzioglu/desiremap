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

test.describe('search tag flow', () => {
  test('old raw tag url redirects into canonical structured search state', async ({ page }) => {
    await bypassAgeGate(page)
    await page.goto('/search?q=K%C3%B6ln%20bordell&city=koeln', { waitUntil: 'networkidle' })

    await expect(page).toHaveURL(/\/search\?city=koeln&category=bordell$/)
    await expect(page.getByText('Pascha Laufhaus und Hotel')).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('combobox')).toContainText('Köln')
  })

  test('legacy explicit turkish raw url redirects into city-only fallback', async ({ page }) => {
    await bypassAgeGate(page)
    await page.goto('/tr/search?q=Berlin%20siki%C5%9F&city=berlin', { waitUntil: 'networkidle' })

    await expect(page).toHaveURL(/\/tr\/search\?city=berlin$/)
    await expect(page.getByText('Artemis Berlin')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Sonuç bulunamadı')).toHaveCount(0)
  })

  test('koeln bordell tag opens structured search state with results', async ({ page }) => {
    await bypassAgeGate(page)
    await page.goto('/stadt/koeln', { waitUntil: 'networkidle' })

    await page.getByRole('link', { name: 'Köln bordell' }).click()

    await expect(page).toHaveURL(/\/search\?city=koeln&category=bordell$/)
    await expect(page.getByRole('combobox')).toContainText('Köln')
    await expect(page.getByRole('button', { name: 'Bordelle' })).toHaveClass(/bg-\[#8b1a4a\]/)
    await expect(page.getByText('Pascha Laufhaus und Hotel')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Keine Ergebnisse gefunden')).toHaveCount(0)
  })

  test('city-only search shows loading state before hydrated results', async ({ page }) => {
    await bypassAgeGate(page)
    await page.goto('/search?city=koeln', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('[data-testid="search-results-loading"]')).toBeVisible()
    await expect(page.getByText('Pascha Laufhaus und Hotel')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Keine Ergebnisse gefunden')).toHaveCount(0)
    await expect(page.getByRole('combobox')).toContainText('Köln')
  })

  test('turkish explicit Berlin tag falls back to result-bearing city search', async ({ page }) => {
    await bypassAgeGate(page)
    await page.goto('/tr/stadt/berlin', { waitUntil: 'networkidle' })

    await page.getByRole('link', { name: 'Berlin sikiş' }).click()

    await expect(page).toHaveURL(/\/tr\/search\?city=berlin$/)
    await expect(page.getByText('Artemis Berlin')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Sonuç bulunamadı')).toHaveCount(0)
    await expect(page.getByRole('combobox')).toContainText('Berlin')
  })
})
