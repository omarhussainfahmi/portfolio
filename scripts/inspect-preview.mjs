import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
const failures = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('response', (r) => {
  if (r.status() >= 400) failures.push({ url: r.url(), status: r.status() });
});
await mkdir('docs/qa', { recursive: true });
await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
await page.goto('http://127.0.0.1:4173/');
await page.waitForSelector('#contact');
await page.locator('.github-stats, .api-error').waitFor({ timeout: 25000 });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'docs/qa/desktop-dark.png', fullPage: true });
await page.getByRole('button', { name: 'Toggle theme', exact: true }).click();
await page.screenshot({ path: 'docs/qa/desktop-light.png', fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: 'docs/qa/mobile-light.png', fullPage: true });
const github = await page.locator('#github').innerText();
const timing = await page.evaluate(() => {
  const n = performance.getEntriesByType('navigation')[0];
  return {
    domContentLoadedMs: n.domContentLoadedEventEnd,
    responseEndMs: n.responseEnd,
    loadedResourceBytes: performance
      .getEntriesByType('resource')
      .reduce((s, r) => s + r.transferSize, 0),
  };
});
await writeFile(
  'docs/qa/browser-inspection.json',
  JSON.stringify({ errors, failures, github, timing }, null, 2),
);
console.log(JSON.stringify({ errors, failures, github: github.slice(0, 220), timing }));
await browser.close();
