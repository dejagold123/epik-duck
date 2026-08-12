import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';

const port = 4173;
const baseUrl = `http://127.0.0.1:${port}/`;
const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);
const chromePath = chromeCandidates.find((candidate) => existsSync(candidate));
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844 },
];

const waitForServer = async () => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Vite did not start within the expected time.');
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port)], {
  cwd: process.cwd(),
  stdio: 'ignore',
});

let browser;
try {
  await waitForServer();
  assert(chromePath, 'Chrome or Chromium was not found. Set CHROME_PATH to run browser verification.');
  browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage({ viewport: viewports[0] });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    const heroHeading = page.locator('.hero__title');
    await heroHeading.waitFor({ state: 'visible', timeout: 5000 });
    assert((await heroHeading.textContent()).replace(/\s+/g, '') === 'TEHEPIKDUCK', `${viewport.name}: unexpected hero heading`);

    const geometry = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    assert(geometry.documentWidth <= geometry.viewportWidth + 1, `${viewport.name}: horizontal overflow detected`);

    if (viewport.width <= 720) {
      const menuToggle = page.getByRole('button', { name: 'Toggle navigation' });
      assert(await menuToggle.count() === 1, `${viewport.name}: mobile menu toggle is missing`);
      await menuToggle.click();
      const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' });
      const loreLink = mobileNav.getByRole('link', { name: 'Lore', exact: true });
      assert(await loreLink.count() === 1, `${viewport.name}: mobile Lore link is missing`);
      await loreLink.click();
      await page.waitForTimeout(50);
      assert(await page.locator('main').getAttribute('data-mobile-page') === 'lore', `${viewport.name}: Lore view did not activate`);
      assert(await page.locator('#lore').isVisible(), `${viewport.name}: Lore section is hidden after navigation`);
      await menuToggle.click();
      await mobileNav.getByRole('link', { name: 'Vault', exact: true }).click();
      await page.waitForTimeout(100);
      const vaultTabs = page.locator('.vault-calculator__tabs button');
      const tabGeometry = await vaultTabs.evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().toJSON()));
      assert(tabGeometry.length === 5, `${viewport.name}: vault calculator tabs are incomplete`);
      assert(new Set(tabGeometry.map(({ y }) => Math.round(y))).size === 1, `${viewport.name}: vault calculator tabs wrapped onto multiple rows`);
    } else {
      const desktopNav = page.locator('.header .nav');
      assert(await desktopNav.getByRole('link', { name: 'Home', exact: true }).count() === 1, `${viewport.name}: desktop Home link is missing`);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(100);
      assert(await page.locator('.sticky-nav.is-visible').count() === 1, `${viewport.name}: sticky navigation did not appear`);
    }
  }

  assert(errors.length === 0, `Browser errors detected: ${errors.join('; ')}`);
  console.log(`Browser verification passed for ${viewports.length} viewports.`);
} finally {
  if (browser) await browser.close();
  server.kill();
}
