import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync } from 'node:fs';
test.beforeEach(async ({ page }) => {
  await page.route('https://api.github.com/**', (route) =>
    route.fulfill({
      status: 403,
      contentType: 'application/json',
      body: '{"message":"API rate limit exceeded"}',
    }),
  );
});
test('routes, metadata, local assets and truthful empty states', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const [route, title] of [
    ['/', 'Hello, I’m'],
    ['/projects/next-chapter', 'Next Chapter'],
    ['/projects/asp-net-project', 'ASP.NET Project'],
    ['/case-studies/next-chapter', 'Behind the build.'],
    ['/blog', 'Things worth'],
    ['/projects/missing', 'Let’s get you back.'],
    ['/blog/missing', 'Let’s get you back.'],
    ['/not-a-page', 'Let’s get you back.'],
  ]) {
    await page.goto(route);
    await expect(page.locator('h1')).toContainText(title);
    await expect(page).toHaveTitle(/Omar Hussain Fahmi/);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'),
    );
    // Finish lazy imports before the next full navigation. WebKit otherwise reports
    // cancelled imports from the document being unloaded as rendering errors.
    await page.waitForLoadState('networkidle');
  }
  if (existsSync('public/OmarHussainCV.pdf')) {
    const pdf = await request.get('/OmarHussainCV.pdf');
    expect(pdf.status()).toBe(200);
    expect((await pdf.body()).subarray(0, 4).toString()).toBe('%PDF');
  }
  await page.goto('/');
  await expect(page.locator('.hero-actions a[download]')).toHaveAttribute(
    'href',
    'https://omar-hussain-fahmi-portfolio.pages.dev/OmarHussainCV.pdf?v=20260929',
  );
  for (const path of [
    '/og.png',
    '/icon-192.png',
    '/favicon.svg',
    '/site.webmanifest',
    '/sitemap.xml',
    '/robots.txt',
    '/images/next-chapter-wireframe.webp',
  ])
    expect((await request.get(path)).ok()).toBeTruthy();
  expect(errors).toEqual([]);
});
test('theme persists, recruiter mode transforms and mobile menu navigates', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle theme', exact: true }).click();
  const theme = await page.locator('html').getAttribute('data-theme');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme!);
  await page.getByRole('button', { name: 'Recruiter mode', exact: true }).click();
  await expect(page.locator('.recruiter-banner')).toBeVisible();
  await expect(page.locator('.hero-panel')).toBeHidden();
  await page.reload();
  await expect(page.locator('.recruiter-banner')).toBeVisible();
  await page.getByRole('button', { name: 'Recruiter mode', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .locator('#full-navigation')
    .getByRole('link', { name: 'Certifications', exact: true })
    .click();
  await expect(page).toHaveURL(/#certifications$/);
  await expect(page.locator('#full-navigation')).toHaveCount(0);
});
test('certificate filtering, modal focus and wireframe lightbox', async ({ page }) => {
  await page.goto('/#certifications');
  await page.locator('#certifications').getByRole('button', { name: 'Cloud', exact: true }).click();
  await expect(page.locator('.certificate-card')).toHaveCount(1);
  await page.locator('.certificate-card').click();
  await expect(page.getByRole('dialog')).toContainText('20 training hours');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.certificate-card')).toBeFocused();
  await page.goto('/projects/next-chapter');
  await page.getByRole('button', { name: /Enlarge/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').locator('img')).toBeVisible();
  await page.keyboard.press('Escape');
});
test('command palette keyboard navigation and terminal history', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open command palette', exact: true }).click();
  await expect(page.getByRole('combobox')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox').fill('blog');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByText('Articles Coming Soon', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Open terminal' }).click();
  const input = page.getByRole('textbox', { name: 'Terminal command' });
  await input.fill('pro');
  await input.press('Tab');
  await expect(input).toHaveValue('projects');
  await input.press('Enter');
  await expect(page.getByRole('log')).toContainText('Next Chapter');
  await input.press('ArrowUp');
  await expect(input).toHaveValue('projects');
  await input.fill('about');
  await input.press('Enter');
  await expect(page.getByRole('log')).toContainText('Computer Information Systems junior');
  await page.getByRole('button', { name: 'Maximize terminal' }).click();
  await expect(page.getByRole('dialog')).toHaveClass(/maximized/);
  await page.getByRole('button', { name: 'Minimize terminal' }).click();
  await page.getByRole('button', { name: 'Restore terminal', exact: true }).click();
  await expect(page.getByRole('log')).toContainText('Computer Information Systems junior');
  await input.fill('clear');
  await input.press('Enter');
  await expect(page.getByRole('log')).toBeEmpty();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('GitHub fallback and external/contact links', async ({ page }) => {
  await page.goto('/#github');
  await expect(page.locator('#github')).toContainText('temporarily rate-limited');
  await expect(page.getByRole('button', { name: 'Retry GitHub' })).toBeVisible();
  expect(await page.locator('a[target="_blank"]:not([rel~="noopener"])').count()).toBe(0);
  await expect(
    page.locator('#contact').getByRole('link', { name: 'Email me', exact: true }),
  ).toHaveAttribute('href', 'mailto:omarhussainfahmi@hotmail.com');
  await expect(page.locator('#contact a[href^="tel:"]')).toHaveAttribute(
    'href',
    'tel:+966500411051',
  );
});
test('GitHub success, cached data and source limits', async ({ page }) => {
  await page.unroute('https://api.github.com/**');
  await page.route('https://api.github.com/**', (route) => {
    const url = route.request().url();
    const data = url.includes('/repos?')
      ? [
          {
            id: 1,
            name: 'test-fixture',
            html_url: 'https://github.com/omarhussainfahmi/test-fixture',
            description: 'Test fixture only',
            language: 'C#',
            stargazers_count: 2,
            updated_at: '2026-09-27',
          },
        ]
      : url.includes('/events/')
        ? []
        : { public_repos: 1, followers: 3, following: 4 };
    return route.fulfill({ json: data });
  });
  await page.goto('/#github');
  await expect(page.locator('.github-stats')).toContainText('Public repositories1');
  await expect(page.locator('.repo-grid:not(.project-repositories)')).toContainText('test-fixture');
  await expect(page.locator('#github')).toContainText('not a total contribution count');
  await page.reload();
  await expect(page.locator('.repo-grid:not(.project-repositories)')).toContainText('test-fixture');
});
for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920])
  test(`responsive layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('#contact')).toBeAttached();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    expect(overflow).toBe(false);
    await page.goto('/case-studies/next-chapter');
    await expect(page.locator('.case-content')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(
      false,
    );
  });
for (const theme of ['dark', 'light'])
  test(`accessibility ${theme}`, async ({ page }) => {
    await page.addInitScript((theme) => localStorage.setItem('theme', theme), theme);
    await page.goto('/');
    await expect(page.locator('#contact')).toBeAttached();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    await page.getByRole('button', { name: 'Open command palette' }).click();
    const dialog = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(dialog.violations).toEqual([]);
  });
test('static HTML contains page-specific content before JavaScript', async ({ request }) => {
  const response = await request.get('/projects/asp-net-project/');
  const html = await response.text();
  expect(html).toContain('Technical notes');
  expect(html).toContain('net8.0');
  expect(html).toContain('og:title');
  expect(html).not.toContain('<!--app-->');
});
