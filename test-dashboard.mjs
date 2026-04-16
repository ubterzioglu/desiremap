import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const errors = [];
page.on('response', (resp) => {
  if (resp.status() >= 400) {
    errors.push({ url: resp.url(), status: resp.status() });
  }
});

console.log('1. Login...');
await page.goto('http://localhost:3000/de/login');
await page.waitForLoadState('networkidle');

await page.locator('input[type="email"]').fill('admin@desiremap.local');
await page.locator('input[type="password"]').fill('Admin123!');
await page.locator('button:has-text("Anmelden")').click();
await page.waitForTimeout(3000);

const authStorage = await page.evaluate(() => {
  const raw = localStorage.getItem('auth-storage');
  return raw ? JSON.parse(raw) : null;
});

if (!authStorage?.state?.isAuthenticated) {
  console.log('LOGIN FAILED');
  console.log('Auth:', JSON.stringify(authStorage));
  await browser.close();
  process.exit(1);
}
console.log('   Login OK. Token:', authStorage.state.token?.substring(0, 20) + '...');

console.log('\n2. Navigate to dashboard...');
await page.goto('http://localhost:3000/de/dashboard');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(3000);
console.log(`   URL: ${page.url()}`);

console.log('\n3. Checking for 404 errors...');
const customerErrors = errors.filter(e => e.url.includes('/api/customer'));
if (customerErrors.length > 0) {
  console.log('   FAILED — 404s found:');
  customerErrors.forEach(e => console.log(`   ${e.status} ${e.url}`));
} else {
  console.log('   OK — no /api/customer 404s');
}

console.log('\n4. Navigate to admin panel...');
errors.length = 0;
await page.goto('http://localhost:3000/de/admin');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(3000);
console.log(`   URL: ${page.url()}`);

const adminErrors = errors.filter(e => e.status >= 400);
if (adminErrors.length > 0) {
  console.log('   Errors on admin:');
  adminErrors.forEach(e => console.log(`   ${e.status} ${e.url}`));
} else {
  console.log('   OK — no errors on admin');
}

await browser.close();
console.log('\nDone!');
