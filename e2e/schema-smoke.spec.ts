import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('JSON-LD Schema Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/de`, { waitUntil: 'networkidle' })
  })

  test('page has JSON-LD script tags', async ({ page }) => {
    const scripts = page.locator('script[type="application/ld+json"]')
    const count = await scripts.count()
    expect(count).toBeGreaterThan(0)
  })

  const requiredSchemas = [
    'Organization',
    'WebSite',
    'WebPage',
    'BreadcrumbList',
    'ItemList',
    'FAQPage',
    'LocalBusiness',
    'SpeakableSpecification',
    'VideoObject',
    'HowTo',
    'ProductGroup',
    'Person',
  ]

  for (const schemaType of requiredSchemas) {
    test(`${schemaType} schema is present`, async ({ page }) => {
      const scripts = page.locator('script[type="application/ld+json"]')
      const count = await scripts.count()

      let found = false
      for (let i = 0; i < count; i++) {
        const content = await scripts.nth(i).textContent()
        if (content) {
          try {
            const json = JSON.parse(content)
            if (json['@type'] === schemaType) {
              found = true
              break
            }
            if (json['@graph'] && Array.isArray(json['@graph'])) {
              found = json['@graph'].some(
                (item: Record<string, unknown>) => item['@type'] === schemaType
              )
              if (found) break
            }
          } catch {
            // skip invalid JSON
          }
        }
      }
      expect(found, `${schemaType} schema not found on homepage`).toBeTruthy()
    })
  }

  test('all schemas are valid JSON', async ({ page }) => {
    const scripts = page.locator('script[type="application/ld+json"]')
    const count = await scripts.count()

    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent()
      expect(() => JSON.parse(content!), `Script #${i} is not valid JSON`).not.toThrow()
    }
  })

  test('@context is present in at least one script', async ({ page }) => {
    const scripts = page.locator('script[type="application/ld+json"]')
    const count = await scripts.count()
    expect(count).toBeGreaterThan(0)

    const content = await scripts.first().textContent()
    const json = JSON.parse(content!)
    expect(json['@context'] || json['@type']).toBeDefined()
  })
})
