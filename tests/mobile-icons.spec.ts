import { test, expect } from '@playwright/test';
for (const width of [320, 375, 390, 430]) {
  test(`mobile foundation uses the available width at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    for (const recruiter of [false, true]) {
      if (recruiter) await page.getByRole('button', { name: 'Recruiter mode', exact: true }).click();
      const card = page.locator('.education-card');
      await card.scrollIntoViewIfNeeded();
      const text = await card.locator('div').boundingBox();
      const language = await card.locator('.education-languages').boundingBox();
      expect(text!.width).toBeGreaterThan(width - 160);
      expect(language!.y).toBeGreaterThanOrEqual(text!.y + text!.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    if (width === 390) await page.locator('#education').screenshot({ path: 'docs/qa/mobile-foundation-fixed.png' });
  });
}
test('all pages use SVG icons instead of emoji-prone symbols', async ({ page }) => {
  for (const path of ['/', '/blog', '/projects/next-chapter', '/projects/asp-net-project', '/case-studies/next-chapter', '/404']) {
    await page.goto(path);
    await expect(page.locator('body')).not.toContainText(/[↗↘↙↖→←↑↓✳✦]/);
  }
  await page.goto('/');
  await page.getByRole('button', { name: 'Recruiter mode', exact: true }).click();
  await expect(page.locator('.recruiter-banner a svg')).toBeVisible();
  await expect(page.locator('.certificate-meta svg')).toHaveCount(10);
});
