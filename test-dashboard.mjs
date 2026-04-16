import { chromium } from 'playwright'
import config from './playwright.config.mjs'

const browser = await chromium.launch({
  headless: true,
  args: [`--host-resolver-rules=MAP ${config.adminHost} 127.0.0.1,MAP ${config.publicHost} 127.0.0.1`],
})
const adminPage = await browser.newPage()
const publicPage = await browser.newPage()

console.log('1. Admin host should open login...')
await adminPage.goto(`http://${config.adminHost}:${config.port}/`)
await adminPage.waitForLoadState('networkidle')
console.log(`   Admin root URL: ${adminPage.url()}`)

console.log('2. Public host should keep public login...')
await publicPage.goto(`http://${config.publicHost}:${config.port}/login`)
await publicPage.waitForLoadState('networkidle')
console.log(`   Public login URL: ${publicPage.url()}`)

console.log('3. Admin login flow...')
await adminPage.goto(`http://${config.adminHost}:${config.port}/login`)
await adminPage.locator('input[type="email"]').fill('admin@desiremap.local')
await adminPage.locator('input[type="password"]').fill('Admin123!')
await adminPage.locator('button:has-text("In Dashboard wechseln")').click()
await adminPage.waitForTimeout(3000)
await adminPage.screenshot({ path: '/Users/admin/Desktop/dev/desiremap/test-04-admin-panel.png' })
console.log(`   Dashboard URL: ${adminPage.url()}`)

await browser.close()
console.log('Done!')
