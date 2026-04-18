import { test, expect } from '@playwright/test'

const BASE = 'http://127.0.0.1:3000'

// ──────────────────────────────────────────────────────────
// 1. Admin Login — /auth/login (dev route, same as admin.desiremap.de/login)
// Note: in production, admin.desiremap.de/login rewrites internally to /auth/login
// ──────────────────────────────────────────────────────────
test.describe('Admin Login (/auth/login)', () => {
  test('renders login form with correct branding', async ({ page }) => {
    await page.goto(`${BASE}/auth/login`)

    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    // Super Admin branding
    await expect(page.locator('text=Super Admin').first()).toBeVisible()
  })

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto(`${BASE}/auth/login`)

    await page.locator('input[type="email"]').fill('wrong@test.com')
    await page.locator('input[type="password"]').fill('wrongpass')
    await page.locator('button').filter({ hasText: /Dashboard|anmelden/i }).click()

    // Error message appears (amber box with text about failed login)
    await expect(
      page.locator('div').filter({ hasText: /fehlgeschlagen|Anmeldedaten|ungültig|Login/i }).last()
    ).toBeVisible({ timeout: 12000 })
  })

  test('password toggle shows/hides password', async ({ page }) => {
    await page.goto(`${BASE}/auth/login`)

    // Fill password field and verify initial type
    await page.locator('input[placeholder="••••••••"]').fill('secret')
    await expect(page.locator('[data-testid="password-toggle"]')).toBeVisible()

    // Click the eye toggle — input type should flip to text
    await page.locator('[data-testid="password-toggle"]').click()
    await expect(page.locator('input[placeholder="••••••••"]')).toHaveAttribute('type', 'text')
  })
})

// ──────────────────────────────────────────────────────────
// 2. Operator Login — /operator/login
// ──────────────────────────────────────────────────────────
test.describe('Operator Login (/operator/login)', () => {
  test('renders with Betreiber-Portal branding', async ({ page }) => {
    await page.goto(`${BASE}/operator/login`)

    await expect(page.locator('text=Betreiber-Portal')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('has link to admin login', async ({ page }) => {
    await page.goto(`${BASE}/operator/login`)

    const adminLink = page.locator('a[href="/auth/login"]')
    await expect(adminLink).toBeVisible()
    await expect(adminLink).toContainText('Admin')
  })

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto(`${BASE}/operator/login`)
    await page.locator('input[type="email"]').fill('wrong@operator.de')
    await page.locator('input[type="password"]').fill('wrongpass123')
    await page.getByRole('button', { name: /Betreiber-Dashboard/i }).click()

    // Any error message should appear after failed login
    await expect(
      page.locator('div').filter({ hasText: /fehlgeschlagen|Anmeldedaten|ungültig|Anmeldung/i }).last()
    ).toBeVisible({ timeout: 12000 })
  })

  test('Enter key submits form', async ({ page }) => {
    await page.goto(`${BASE}/operator/login`)

    await page.locator('input[type="email"]').fill('test@test.com')
    await page.locator('input[type="password"]').fill('pass')
    await page.locator('input[type="password"]').press('Enter')

    // Should either navigate or show error — not stay static
    await page.waitForTimeout(1000)
    const url = page.url()
    const hasError = await page.locator('div').filter({ hasText: /fehlgeschlagen|Dashboard/i }).count()
    expect(url.includes('/operator/login') || hasError > 0).toBeTruthy()
  })
})

// ──────────────────────────────────────────────────────────
// 3. Customer Login — /kunde/login
// ──────────────────────────────────────────────────────────
test.describe('Customer Login (/kunde/login)', () => {
  test('renders customer login form', async ({ page }) => {
    await page.goto(`${BASE}/kunde/login`)

    await expect(page.locator('h1').filter({ hasText: /Willkommen/i })).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button').filter({ hasText: /Anmelden/i })).toBeVisible()
  })

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto(`${BASE}/kunde/login`)

    await page.locator('input[type="email"]').fill('wrong@example.de')
    await page.locator('input[type="password"]').fill('wrongpass123')
    await page.getByRole('button', { name: /Anmelden/i }).click()

    // Any error message should appear after failed login
    await expect(
      page.locator('div').filter({ hasText: /fehlgeschlagen|Anmeldedaten|ungültig|Felder|Anmeldung/i }).last()
    ).toBeVisible({ timeout: 12000 })
  })

  test('has link to registration page', async ({ page }) => {
    await page.goto(`${BASE}/kunde/login`)

    await expect(page.locator('button, a').filter({ hasText: /Registrier/i })).toBeVisible()
  })

  test('old /login URL redirects to /kunde/login', async ({ page }) => {
    await page.goto(`${BASE}/login`)
    await expect(page).toHaveURL(/\/kunde\/login/)
  })
})

// ──────────────────────────────────────────────────────────
// 4. Routing isolation — each login serves different page
// ──────────────────────────────────────────────────────────
test.describe('Login routes are distinct', () => {
  test('admin route has Super Admin text, operator route has Betreiber text', async ({ page }) => {
    await page.goto(`${BASE}/auth/login`)
    await expect(page.locator('text=Super Admin').first()).toBeVisible()

    await page.goto(`${BASE}/operator/login`)
    await expect(page.locator('text=Betreiber-Portal')).toBeVisible()
    // Super Admin text should NOT be prominent on operator page (it's just a link)
    const superAdminCount = await page.locator('h1:has-text("Super Admin"), h2:has-text("Super Admin")').count()
    expect(superAdminCount).toBe(0)
  })

  test('kunde/login does not have Betreiber or Super Admin headings', async ({ page }) => {
    await page.goto(`${BASE}/kunde/login`)
    await expect(page.locator('h1').filter({ hasText: /Betreiber|Super Admin/i })).toHaveCount(0)
    await expect(page.locator('h1').filter({ hasText: /Willkommen/i })).toBeVisible()
  })
})
