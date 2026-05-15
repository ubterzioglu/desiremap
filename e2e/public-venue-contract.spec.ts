import { expect, test, type Page } from '@playwright/test'

const summaryEstablishment = {
  slug: 'e2e-public-contract',
  name: 'E2E Public Contract',
  city: 'Berlin',
  type: 'fkk',
  description: null,
  image: '/listing-bg.jpg',
  images: ['/covers/pascha-bg.jpg'],
  rating: null,
  reviewCount: 0,
  priceMin: null,
  priceMax: null,
  tags: [],
  verified: true,
  lat: null,
  lng: null,
  openingHours: {},
  isActive: true,
}

const detailEstablishment = {
  ...summaryEstablishment,
  image: '/covers/artemis-bg.jpg',
  images: ['/covers/pascha-bg.jpg'],
  detailContent: null,
}

async function mockPublicDiscovery(page: Page) {
  await page.route('**/api/public/service-types', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: [{ id: 1, slug: 'fkk', name: 'FKK Club' }] }),
    })
  })

  await page.route('**/api/public/establishments**', async (route) => {
    const url = new URL(route.request().url())
    const isCollection = url.pathname.endsWith('/api/public/establishments')

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(isCollection ? { results: [summaryEstablishment], total: 1 } : detailEstablishment),
    })
  })
}

test.describe('public venue rendering contract', () => {
  test('listing card uses listing image instead of gallery fallback', async ({ page }) => {
    await mockPublicDiscovery(page)
    await page.goto('/de', { waitUntil: 'domcontentloaded' })

    const card = page.getByTestId('listing-card-e2e-public-contract')
    await expect(card.getByRole('heading', { name: 'E2E Public Contract' })).toBeVisible()

    const cardImage = card.locator('img[alt="E2E Public Contract"]')
    await expect(cardImage).toHaveAttribute('src', /listing-bg\.jpg/)
    await expect(cardImage).not.toHaveAttribute('src', /pascha-bg\.jpg/)
  })

  test('detail page uses hero image, keeps gallery in JSON-LD, and hides empty public content', async ({ page }) => {
    await mockPublicDiscovery(page)

    await page.goto('/venue/e2e-public-contract', { waitUntil: 'networkidle' })

    await expect(page.getByRole('heading', { name: 'E2E Public Contract', level: 1 })).toBeVisible()

    const hero = page.locator('section').first()
    await expect(hero).toHaveAttribute('style', /artemis-bg\.jpg/)
    await expect(hero).not.toHaveAttribute('style', /pascha-bg\.jpg/)

    const scripts = page.locator('script[type="application/ld+json"]')
    const structuredDataText = await scripts.first().textContent()
    expect(structuredDataText).not.toBeNull()
    const structuredData = JSON.parse(structuredDataText ?? '{}') as { '@graph'?: Array<Record<string, unknown>> }
    const productSchema = structuredData['@graph']?.find((node) => node['@type'] === 'Product')
    expect(productSchema?.image).toEqual(['/covers/artemis-bg.jpg', '/covers/pascha-bg.jpg'])

    await expect(page.getByText('renommierter')).toHaveCount(0)
    await expect(page.getByText('umfangreiches Serviceportfolio')).toHaveCount(0)
    await expect(page.getByText('Die Preise in E2E Public Contract')).toHaveCount(0)
    await expect(page.getByText('Öffnungszeiten')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: /Häufig gestellte Fragen/ })).toHaveCount(0)
  })
})
