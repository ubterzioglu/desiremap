import { expect, test, type Page } from '@playwright/test'
import { AGE_VERIFICATION_COOKIE_NAME } from '../src/lib/ageGate'

const defaultBaseUrl = 'http://127.0.0.1:3000'

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

async function gotoListingCard(page: Page, locale: 'de' | 'en', baseURL: string | undefined) {
  await mockPublicDiscovery(page)
  await page.context().addCookies([
    {
      name: AGE_VERIFICATION_COOKIE_NAME,
      value: '1',
      url: baseURL ?? defaultBaseUrl,
    },
  ])
  await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' })

  const card = page.getByTestId(`listing-card-${establishment.slug}`)
  await expect(card).toHaveCount(1)

  const detailLabel = locale === 'en' ? 'Show details: E2E Studio' : 'Details anzeigen: E2E Studio'
  const titleLink = card.getByRole('link', { name: detailLabel }).filter({ hasText: 'E2E Studio' })
  await expect(titleLink).toBeVisible()

  return {
    card,
    titleLink,
    detailButton: card.getByTestId('listing-card-detail-link'),
    reserveButton: card.getByTestId('listing-card-reserve-button'),
    favoriteButton: card.getByTestId('listing-card-favorite-button'),
  }
}

test.describe('ListingCard interactions', () => {
  test('reservation CTA opens the reservation modal without navigating to details', async ({ page, baseURL }) => {
    const listing = await gotoListingCard(page, 'de', baseURL)

    const startingUrl = page.url()
    const reserveButton = listing.reserveButton

    await expect(reserveButton).toHaveAccessibleName('Reservierung fuer E2E Studio starten')
    await reserveButton.click()

    await expect(page).toHaveURL(startingUrl)
    await expect(page.getByRole('dialog')).toContainText('Reservierung')
    await expect(page.getByRole('dialog')).toContainText('E2E Studio - Berlin')
  })

  test('card details action is keyboard accessible', async ({ page, baseURL }) => {
    const listing = await gotoListingCard(page, 'de', baseURL)
    const detailAction = listing.titleLink

    await expect(detailAction).toHaveAccessibleName('Details anzeigen: E2E Studio')
    await detailAction.focus()
    await page.keyboard.press('Enter')

    await expect(page).toHaveURL(/\/venue\/e2e-studio/)
  })

  test('card title link click navigates to details', async ({ page, baseURL }) => {
    const listing = await gotoListingCard(page, 'de', baseURL)

    await listing.titleLink.click()

    await expect(page).toHaveURL(/\/venue\/e2e-studio/)
  })

  test('eye detail CTA click navigates to details', async ({ page, baseURL }) => {
    const listing = await gotoListingCard(page, 'de', baseURL)

    await listing.detailButton.click()

    await expect(page).toHaveURL(/\/venue\/e2e-studio/)
  })

  test('English locale renders translated labels and stateful favorite button labels', async ({ page, baseURL }) => {
    const listing = await gotoListingCard(page, 'en', baseURL)
    const reserveButton = listing.reserveButton
    const saveFavorite = listing.favoriteButton

    await expect(reserveButton).toHaveAccessibleName('Start reservation for E2E Studio')
    await expect(listing.card.getByText('Price', { exact: true })).toBeVisible()

    await expect(saveFavorite).toHaveAccessibleName('Save E2E Studio to favorites')
    await expect(saveFavorite).toHaveAttribute('aria-pressed', 'false')

    await saveFavorite.click()

    await expect(saveFavorite).toHaveAccessibleName('Remove E2E Studio from favorites')
    await expect(saveFavorite).toHaveAttribute('aria-pressed', 'true')
  })
})
