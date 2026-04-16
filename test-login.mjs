import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

console.log('1. Navigating to login page...');
await page.goto('http://localhost:3000/de/login');
await page.waitForLoadState('networkidle');
console.log(`   URL: ${page.url()}`);
console.log(`   Title: ${await page.title()}`);

await page.screenshot({ path: '/Users/admin/Desktop/dev/desiremap/test-01-login-page.png' });
console.log('   Screenshot: test-01-login-page.png');

console.log('\n2. Filling email...');
const emailInput = page.locator('input[type="email"]');
await emailInput.fill('admin@desiremap.local');
console.log(`   Email value: ${await emailInput.inputValue()}`);

console.log('\n3. Filling password...');
const passwordInput = page.locator('input[type="password"]');
await passwordInput.fill('Admin123!');
console.log(`   Password filled: ${String(await passwordInput.inputValue()).length} chars`);

await page.screenshot({ path: '/Users/admin/Desktop/dev/desiremap/test-02-form-filled.png' });
console.log('   Screenshot: test-02-form-filled.png');

console.log('\n4. Clicking Anmelden button...');
const submitBtn = page.locator('button:has-text("Anmelden")');
await submitBtn.click();

await page.waitForTimeout(3000);

const currentUrl = page.url();
console.log(`   URL after login: ${currentUrl}`);

await page.screenshot({ path: '/Users/admin/Desktop/dev/desiremap/test-03-after-login.png' });
console.log('   Screenshot: test-03-after-login.png');

const authStorage = await page.evaluate(() => {
  const raw = localStorage.getItem('auth-storage');
  return raw ? JSON.parse(raw) : null;
});

if (authStorage?.state?.isAuthenticated) {
  console.log('\n5. LOGIN SUCCESS!');
  console.log(`   User: ${JSON.stringify(authStorage.state.user)}`);
  console.log(`   Token: ${authStorage.state.token?.substring(0, 20)}...`);
  console.log(`   Authenticated: ${authStorage.state.isAuthenticated}`);
} else {
  console.log('\n5. LOGIN FAILED!');
  console.log(`   Auth storage: ${JSON.stringify(authStorage)}`);
  const errorText = await page.locator('.text-red-400').textContent().catch(() => 'no error visible');
  console.log(`   Error on page: ${errorText}`);
}

if (authStorage?.state?.isAuthenticated) {
  console.log('\n6. Navigating to admin panel...');
  await page.goto('http://localhost:3000/de/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  console.log(`   Admin URL: ${page.url()}`);
  await page.screenshot({ path: '/Users/admin/Desktop/dev/desiremap/test-04-admin-panel.png' });
  console.log('   Screenshot: test-04-admin-panel.png');
}

await browser.close();
console.log('\nDone!');
