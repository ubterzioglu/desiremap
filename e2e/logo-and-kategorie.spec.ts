import { test, expect } from '@playwright/test'

test.describe('Header logo', () => {
  test('shows webp image instead of text', async ({ page }) => {
    await page.goto('/')

    const logoImg = page.locator('header img[alt="DesireMap"]')
    await expect(logoImg).toBeVisible()
    await expect(logoImg).toHaveAttribute('src', /desiremap_strict1_neon_flicker\.webp/)
  })

  test('logo link href points to root /', async ({ page }) => {
    await page.goto('/search')
    const logoLink = page.locator('header a[aria-label*="DesireMap"]')
    await expect(logoLink).toHaveAttribute('href', '/')
  })

  test('no DesireMap text node in header', async ({ page }) => {
    await page.goto('/')
    const textLogo = page.locator('header a', { hasText: /^DesireMap$/ })
    await expect(textLogo).toHaveCount(0)
  })
})

test.describe('/kategorie/[slug] routes', () => {
  test('bordelle route loads and shows h1', async ({ page }) => {
    const res = await page.goto('/kategorie/bordelle')
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
    await page.screenshot({ path: 'test-results/kategorie-bordelle.png' })
  })

  test('fkk-clubs route loads and shows h1', async ({ page }) => {
    const res = await page.goto('/kategorie/fkk-clubs')
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
    await page.screenshot({ path: 'test-results/kategorie-fkk-clubs.png' })
  })

  test('kategorie page has search input', async ({ page }) => {
    await page.goto('/kategorie/bordelle')
    const searchInput = page.locator('input[placeholder*="Suche"]')
    await expect(searchInput.first()).toBeVisible()
  })

  test('home category cards link to /kategorie/[slug]', async ({ page }) => {
    await page.goto('/')
    const categoryLink = page.locator('a[href*="/kategorie/"]').first()
    const href = await categoryLink.getAttribute('href')
    expect(href).toMatch(/\/kategorie\//)
  })
})
