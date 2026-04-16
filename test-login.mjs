import { chromium } from 'playwright'
import config from './playwright.config.mjs'

const browser = await chromium.launch({
  headless: true,
  args: [`--host-resolver-rules=MAP ${config.adminHost} 127.0.0.1,MAP ${config.publicHost} 127.0.0.1`],
})
const page = await browser.newPage()

console.log('1. Admin host login page...')
await page.goto(`http://${config.adminHost}:${config.port}/login`)
await page.waitForLoadState('networkidle')
console.log(`   URL: ${page.url()}`)

await page.locator('input[type="email"]').fill('admin@desiremap.local')
await page.locator('input[type="password"]').fill('Admin123!')
await page.screenshot({ path: '/Users/admin/Desktop/dev/desiremap/test-01-login-page.png' })

console.log('2. Submit admin login...')
await page.locator('button:has-text("In Dashboard wechseln")').click()
await page.waitForTimeout(3000)
await page.screenshot({ path: '/Users/admin/Desktop/dev/desiremap/test-02-form-filled.png' })

const authStorage = await page.evaluate(() => {
  const raw = localStorage.getItem('auth-storage')
  return raw ? JSON.parse(raw) : null
})

console.log(`   URL after login: ${page.url()}`)
console.log(`   Workspace: ${authStorage?.state?.user?.workspace}`)

if (authStorage?.state?.isAuthenticated) {
  await page.screenshot({ path: '/Users/admin/Desktop/dev/desiremap/test-03-after-login.png' })
}

await browser.close()
console.log('Done!')
