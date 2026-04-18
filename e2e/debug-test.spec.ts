import { test } from '@playwright/test'

test('debug link click vs button click', async ({ page }) => {
  page.on('console', msg => {
    const txt = msg.text()
    if (!txt.includes('DevTools') && !txt.includes('WebSocket') && !txt.includes('Download')) {
      console.log('PAGE:', txt.slice(0, 200))
    }
  })
  
  await page.goto('http://127.0.0.1:3000/operator/login')
  await page.waitForLoadState('networkidle')
  
  // Check if a simple <a> link click works (standard HTML, no React needed)
  const initialUrl = page.url()
  console.log('Initial URL:', initialUrl)
  
  // Click the "Admin-Login →" anchor link
  await page.locator('a[href="/auth/login"]').click()
  await page.waitForTimeout(1000)
  console.log('URL after link click:', page.url())
  
  await page.goBack()
  await page.waitForLoadState('networkidle')
  
  // Fill the form
  await page.locator('input[type="email"]').fill('x@y.com')
  
  // Check if keydown event works for Enter key
  await page.locator('input[type="email"]').press('Enter')
  await page.waitForTimeout(500)
  console.log('URL after Enter on email:', page.url())
  
  // Check if onChange on email fired (React controlled input)
  const emailValue = await page.evaluate(() => {
    return (document.querySelector('input[type="email"]') as HTMLInputElement).value
  })
  console.log('Email value in DOM:', emailValue)
})
