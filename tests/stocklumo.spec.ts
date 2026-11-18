import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Stocklumo is featured in both views and leads reviewers to the case study', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#projects');
  const card = page.locator('#projects .project-card').first();
  await expect(card.getByRole('heading', { name: 'Stocklumo' })).toBeVisible();
  await expect(card.getByRole('link', { name: 'Live demo' })).toHaveAttribute(
    'href',
    'https://stocklumo.onrender.com/',
  );
  await page.getByRole('button', { name: 'Recruiter mode', exact: true }).click();
  await card.getByRole('link', { name: 'View details' }).click();
  await expect(page).toHaveURL(/\/projects\/stocklumo\/?$/);
  await page.getByRole('link', { name: 'View case study' }).click();
  await expect(page).toHaveURL(/\/case-studies\/stocklumo\/?$/);
  await expect(page.getByRole('heading', { name: 'Testing the failure paths' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Protecting credentials and shared capacity' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Passing release checks' })).toHaveAttribute(
    'href',
    'https://github.com/omarhussainfahmi/stocklumo/actions/runs/44383902755',
  );
  const image = page.getByRole('img', { name: /^Stocklumo Markets page/ });
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
