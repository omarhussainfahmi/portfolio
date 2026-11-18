import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Stocklumo is featured in both views and leads reviewers to the case study', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#projects');
  const card = page.locator('#projects .project-card').first();
  await expect(card.getByRole('heading', { name: 'Stocklumo' })).toBeVisible();
  await expect(card.locator('img')).toHaveAttribute(
    'src',
    '/images/stocklumo-market-overview.webp',
  );
  await expect(card.getByRole('link', { name: 'Live demo' })).toHaveAttribute(
    'href',
    'https://stocklumo.onrender.com/',
  );
  await page.getByRole('button', { name: 'Recruiter mode', exact: true }).click();
  await card.getByRole('link', { name: 'View details' }).click();
  await expect(page).toHaveURL(/\/projects\/stocklumo\/?$/);
  await expect(page.locator('.project-gallery figure')).toHaveCount(13);
  await page.getByRole('link', { name: 'View case study' }).click();
  await expect(page).toHaveURL(/\/case-studies\/stocklumo\/?$/);
  await expect(page.getByRole('heading', { name: 'Testing the failure paths' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Valuing a practice portfolio' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Protecting credentials and shared capacity' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Passing release checks' })).toHaveAttribute(
    'href',
    'https://github.com/omarhussainfahmi/stocklumo/actions/runs/44383902755',
  );
  await expect(page.locator('.project-gallery figure')).toHaveCount(13);
  const image = page.getByRole('img', { name: /^Stocklumo dashboard/ });
  await image.scrollIntoViewIfNeeded();
  await expect
    .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
  const fitsViewport = await page.evaluate(
    () => document.documentElement.scrollWidth <= innerWidth,
  );
  expect(fitsViewport).toBe(true);
  const results = await new AxeBuilder({ page }).include('.detail-page').analyze();
  expect(results.violations).toEqual([]);
});

test('all supplied gallery assets load and open at full size', async ({ page, request }) => {
  await page.goto('/projects/stocklumo/');
  const images = page.locator('.project-gallery figure img');
  const sources = await images.evaluateAll((items) =>
    items.map((item) => (item as HTMLImageElement).src),
  );
  expect(new Set(sources).size).toBe(13);
  expect(sources[0]).toMatch(/stocklumo-home-dark\.webp$/);
  expect(sources[1]).toMatch(/stocklumo-home-light\.webp$/);
  expect(sources[6]).toMatch(/stocklumo-explore\.webp$/);
  await expect(page.getByRole('link', { name: 'Visit Stocklumo' })).toHaveAttribute(
    'href',
    'https://stocklumo.onrender.com/',
  );
  await Promise.all(
    sources.map(async (url) => {
      const response = await request.get(url);
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('image/webp');
    }),
  );
  const preview = page.getByRole('button', { name: /^Enlarge: Stocklumo earnings calendar/ });
  await preview.click();
  const dialog = page.getByRole('dialog', { name: 'Project screenshot' });
  await expect(dialog.getByRole('link', { name: 'Open full-size image' })).toHaveAttribute(
    'href',
    '/images/stocklumo-earnings.webp',
  );
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(preview).toBeFocused();
});
