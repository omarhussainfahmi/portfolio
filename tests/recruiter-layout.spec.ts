import { test, expect } from '@playwright/test';
test('recruiter cards align and show updated identity and skills', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('.brand')).toContainText('Omar Hussain Fahmi');
  await page.getByRole('button', { name: 'Recruiter mode', exact: true }).click();
  await expect(page.locator('.hero-description')).toContainText('SQL, and OOP');
  const cards = page.locator('#projects .project-card');
  const first = await cards.nth(0).locator('.project-body').boundingBox();
  const second = await cards.nth(1).locator('.project-body').boundingBox();
  expect(Math.abs(first!.y - second!.y)).toBeLessThan(2);
  const a = await cards.nth(0).locator('.project-links').boundingBox();
  const b = await cards.nth(1).locator('.project-links').boundingBox();
  expect(Math.abs(a!.y - b!.y)).toBeLessThan(2);
  await expect(cards.nth(1).locator('.project-art > svg')).toBeVisible();
  await page.screenshot({ path: 'docs/qa/recruiter-layout-fixed.png', fullPage: true });
});

test('normal-mode project cards align', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const cards = page.locator('#projects .project-card');
  for (const selector of ['.project-body', '.project-links']) {
    const a = await cards.nth(0).locator(selector).boundingBox();
    const b = await cards.nth(1).locator(selector).boundingBox();
    expect(Math.abs(a!.y - b!.y)).toBeLessThan(2);
  }
  await page.locator('#projects').screenshot({ path: 'docs/qa/normal-cards-fixed.png' });
});
