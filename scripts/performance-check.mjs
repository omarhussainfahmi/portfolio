// Usage: LIGHTHOUSE_MODULE must name an installed Lighthouse core/index.js file.
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { writeFile } from 'node:fs/promises';
if (!process.env.LIGHTHOUSE_MODULE)
  throw new Error('Set LIGHTHOUSE_MODULE to your installed lighthouse/core/index.js');
const { default: lighthouse } = await import(pathToFileURL(process.env.LIGHTHOUSE_MODULE).href);
const browser = await chromium.launch({ headless: true, args: ['--remote-debugging-port=9223'] });
try {
  const result = await lighthouse('http://127.0.0.1:4173/', {
    port: 9223,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  });
  await writeFile('docs/qa/lighthouse.json', result.report);
  console.log(
    JSON.stringify({
      scores: Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, value]) => [key, value.score]),
      ),
      metrics: {
        LCP: result.lhr.audits['largest-contentful-paint'].displayValue,
        CLS: result.lhr.audits['cumulative-layout-shift'].displayValue,
      },
      runtimeError: result.lhr.runtimeError,
    }),
  );
} finally {
  await browser.close();
}
