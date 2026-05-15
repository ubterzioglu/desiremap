import { expect, test, type Page } from '@playwright/test'

const establishment = {
  slug: 'e2e-studio',
  name: 'E2E Studio',
  city: 'Berlin',
  type: 'studio',
  description: 'Stable listing card fixture',
  images: ['/listing-bg.jpg'],
  rating: 4.8,
  reviewCount: 12,
  priceMin: 80,
  priceMax: 120,
  tags: ['Wellness', 'Massage'],
  verified: true,
  lat: null,
  lng: null,
  openingHours: {},
  isActive: true,
}

async function mockPublicDiscovery(page: Page) {
  await page.route('**/api/public/service-types', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: [{ id: 1, slug: 'studio', name: 'Studio' }],
      }),
    })
  })

  await page.route('**/api/public/establishments**', async (route) => {
    const url = new URL(route.request().url())
    const isCollection = url.pathname.endsWith('/api/public/establishments')

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        isCollection
          ? { results: [establishment], total: 1 }
          : establishment,
      ),
    })
  })
}

async function gotoListingCard(page: Page, locale: 'de' | 'en') {
  await mockPublicDiscovery(page)
  await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' })

  const card = page.getByTestId('listing-card-e2e-studio')
  await expect(card.getByRole('heading', { name: 'E2E Studio' })).toBeVisible()

  return card
}

test.describe('ListingCard interactions', () => {
  test('reservation CTA opens the auth modal without navigating to details', async ({ page }) => {
    const card = await gotoListingCard(page, 'de')

    const startingUrl = page.url()
    const reserveButton = card.getByTestId('listing-card-reserve-button')

    await expect(reserveButton).toHaveAccessibleName('Reservierung fuer E2E Studio starten')
    await reserveButton.click()

    await expect(page).toHaveURL(startingUrl)
    await expect(page.getByRole('dialog')).toContainText('Anmeldung erforderlich')
  })

  test('card details action is keyboard accessible', async ({ page }) => {
    const card = await gotoListingCard(page, 'de')
    const detailAction = card.getByTestId('listing-card-detail-surface')

    await expect(detailAction).toHaveAccessibleName('Details anzeigen: E2E Studio')
    await detailAction.focus()
    await page.keyboard.press('Enter')

    await expect(page).toHaveURL(/\/venue\/e2e-studio/)
  })

  test('card surface click navigates to details', async ({ page }) => {
    const card = await gotoListingCard(page, 'de')

    await card.getByTestId('listing-card-detail-surface').click()

    await expect(page).toHaveURL(/\/venue\/e2e-studio/)
  })

  test('eye detail CTA click navigates to details', async ({ page }) => {
    const card = await gotoListingCard(page, 'de')

    await card.getByTestId('listing-card-detail-button').click()

    await expect(page).toHaveURL(/\/venue\/e2e-studio/)
  })

  test('English locale renders translated labels and stateful favorite button labels', async ({ page }) => {
    const card = await gotoListingCard(page, 'en')
    const reserveButton = card.getByTestId('listing-card-reserve-button')
    const saveFavorite = card.getByTestId('listing-card-favorite-button')

    await expect(reserveButton).toHaveAccessibleName('Start reservation for E2E Studio')
    await expect(card.getByText('Price')).toBeVisible()

    await expect(saveFavorite).toHaveAccessibleName('Save E2E Studio to favorites')
    await expect(saveFavorite).toHaveAttribute('aria-pressed', 'false')

    await saveFavorite.click()

    await expect(saveFavorite).toHaveAccessibleName('Remove E2E Studio from favorites')
    await expect(saveFavorite).toHaveAttribute('aria-pressed', 'true')
  })
})
