import { test, expect } from '@playwright/test';
import { siteConfig } from '../src/data/siteConfig';

for (const width of [390, 768, 1280]) {
  test(`focus panel stays independent of title rotation and button hover at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: 1000 });
    await page.clock.install();
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const panel = page.locator('.hero-panel');
    const geometry = () =>
      panel.evaluate((element) => {
        const r = element.getBoundingClientRect();
        return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
      });
    const original = await geometry();
    const originalImage = width === 1280 ? await panel.screenshot() : null;
    const verify = async () => {
      const current = await geometry();
      for (const key of ['x', 'y', 'width', 'height'] as const) {
        expect(current[key]).toBeCloseTo(original[key], 2);
      }
      if (originalImage) expect((await panel.screenshot()).equals(originalImage)).toBe(true);
    };
    for (const label of siteConfig.roles.slice(1).concat(siteConfig.roles[0])) {
      await page.clock.fastForward(4000);
      await expect(page.locator('.role-active')).toHaveText(label);
      await expect(page.locator('.role-rotator [aria-hidden="false"]')).toHaveCount(1);
      await verify();
    }
    for (const selector of ['.primary', '.secondary']) {
      await page.locator(`.hero-actions ${selector}`).hover();
      await verify();
      await page.locator(`.hero-actions ${selector}`).focus();
      await verify();
    }
  });
}
