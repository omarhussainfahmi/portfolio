import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const width of [390, 1440]) {
  test(`visible control text matches accessible labels at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    for (const recruiter of [false, true]) {
      if (recruiter)
        await page.getByRole('button', { name: 'Recruiter mode', exact: true }).click();
      const result = await new AxeBuilder({ page })
        .withRules(['label-content-name-mismatch'])
        .analyze();
      expect(result.violations).toEqual([]);
    }
  });
}
for (const width of [320, 375, 390, 430]) {
  test(`mobile CTAs and contact access at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 640 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    for (const recruiter of [false, true]) {
      if (recruiter)
        await page.getByRole('button', { name: 'Recruiter mode', exact: true }).click();
      const cta = await page.locator('.hero-actions .primary').boundingBox();
      expect(cta!.y + cta!.height).toBeLessThan(575);
      await expect(page.locator('.mobile-contact')).toBeVisible();
      await page.locator('#contact').scrollIntoViewIfNeeded();
      const sticky = await page.locator('.mobile-contact').boundingBox();
      expect(sticky!.y + sticky!.height).toBeLessThanOrEqual(640);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
    if (width === 390) {
      await page.goto('/');
      await page.screenshot({ path: 'docs/qa/mobile-cta-audit.png' });
    }
  });
}
test('privacy and terms have static metadata, social previews and accessible content', async ({
  page,
  request,
}) => {
  for (const route of ['/privacy', '/terms']) {
    const html = await (await request.get(route + '/')).text();
    expect(html).toContain('data-path="' + route + '"');
    expect(html).toContain('name="description"');
    expect(html).toContain('property="og:image"');
    await page.goto(route);
    await expect(page.locator('h1')).toContainText(
      route === '/privacy' ? 'Privacy & cookies' : 'Website terms',
    );
    for (const theme of ['dark', 'light']) {
      await page.evaluate((t) => {
        document.documentElement.dataset.theme = t;
      }, theme);
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
      ).toEqual([]);
    }
  }
});
test('internal links, images and all route metadata are valid', async ({ page, request }) => {
  const visited = new Set<string>();
  for (const route of [
    '/',
    '/privacy',
    '/terms',
    '/blog',
    '/projects/next-chapter',
    '/projects/asp-net-project',
    '/case-studies/next-chapter',
  ]) {
    await page.goto(route);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /^https:\/\/.+\/og.png$/,
    );
    for (const image of await page.locator('img').all())
      expect(await image.getAttribute('alt')).not.toBeNull();
    for (const href of await page
      .locator('a[href]')
      .evaluateAll((links) => links.map((l) => l.getAttribute('href')!))) {
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const [path, hash] = href.split('#');
      const normalized = path || '/';
      if (!visited.has(normalized)) {
        const response = await request.get(normalized);
        expect(response.ok(), normalized).toBeTruthy();
        visited.add(normalized);
      }
      if (hash && normalized === '/') {
        const home = await (await request.get('/')).text();
        expect(home, href).toContain(`id="${hash}"`);
      }
    }
  }
});

test('GitHub and LinkedIn do not add third-party requests before their sections are used', async ({
  page,
}) => {
  let githubRequests = 0;
  let linkedInRequests = 0;
  page.on('request', (request) => {
    if (request.url().startsWith('https://api.github.com/')) githubRequests++;
    if (request.url().startsWith('https://www.linkedin.com/embed/')) linkedInRequests++;
  });
  await page.route('https://api.github.com/**', (route) =>
    route.fulfill({ status: 403, body: '{}', contentType: 'application/json' }),
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Open command palette', exact: true }).click();
  await page.getByRole('combobox').fill('privacy');
  await page.keyboard.press('Escape');
  expect(githubRequests).toBe(0);
  expect(linkedInRequests).toBe(0);
  await page.locator('#github').scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Retry GitHub' })).toBeVisible();
  expect(githubRequests).toBeGreaterThan(0);
});
