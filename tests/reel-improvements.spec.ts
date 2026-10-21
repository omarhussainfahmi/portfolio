import { test, expect } from '@playwright/test';
import { githubConfig, isGithubSnapshot } from '../src/data/github';

test('palette keeps the selected command visible and handles empty results safely', async ({
  page,
}) => {
  await page.goto('/');
  const opener = page.getByRole('button', { name: 'Open command palette', exact: true });
  await opener.click();
  const search = page.getByRole('combobox', { name: 'Search commands' });
  await search.press('End');
  await expect(page.getByRole('option', { selected: true })).toHaveText('Terminal');
  await expect.poll(() => page.getByRole('option', { selected: true }).evaluate((el) => {
    const rect = el.getBoundingClientRect(),
      parent = el.parentElement!.getBoundingClientRect();
    return rect.top >= parent.top - 1 && rect.bottom <= parent.bottom + 1;
  })).toBe(true);
  await search.press('Home');
  await expect(page.getByRole('option', { selected: true })).toHaveText('About');
  await search.fill('no-command-matches');
  await search.press('ArrowDown');
  await search.press('Enter');
  await expect(page.getByRole('dialog').getByRole('status')).toHaveText('No commands found.');
  await expect(search).toHaveAttribute('aria-expanded', 'false');
  await search.fill('projects');
  await search.press('Enter');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page).toHaveURL(/#projects$/);
});

test('mobile disclosure closes on Escape, outside click and focus leaving the header', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Open navigation', exact: true });
  await button.click();
  const nav = page.getByRole('navigation', { name: 'All sections' });
  await nav.getByRole('link').first().focus();
  await page.keyboard.press('Escape');
  await expect(nav).toHaveCount(0);
  await expect(button).toBeFocused();
  await button.click();
  await page.locator('h1').click();
  await expect(nav).toHaveCount(0);
  await button.click();
  await page.locator('.hero-actions a').first().focus();
  await expect(nav).toHaveCount(0);
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('GitHub cache rejects future dates, missing counts and unsafe cached links', () => {
  const data = {
    profile: { public_repos: 1, followers: 0, following: 0 },
    repos: [
      {
        id: 1,
        name: 'fixture',
        html_url: githubConfig.profileUrl + '/fixture',
        description: null,
        language: null,
        stargazers_count: 0,
        updated_at: '2026-01-01',
      },
    ],
    events: [],
    fetchedAt: Date.now() - 1000,
  };
  expect(isGithubSnapshot(data)).toBe(true);
  expect(isGithubSnapshot({ ...data, fetchedAt: Date.now() + 86400000 })).toBe(false);
  expect(isGithubSnapshot({ ...data, profile: { public_repos: 1 } })).toBe(false);
  expect(
    isGithubSnapshot({ ...data, repos: [{ ...data.repos[0], html_url: 'javascript:alert(1)' }] }),
  ).toBe(false);
  expect(isGithubSnapshot({ ...data, repos: [null] })).toBe(false);
});

test('corrupt cached GitHub data and malformed provider output fail without breaking the page', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() =>
    localStorage.setItem(
      'omar-github-v1',
      JSON.stringify({ profile: {}, repos: [null], events: [], fetchedAt: Date.now() + 10000 }),
    ),
  );
  await page.route('https://api.github.com/**', (route) =>
    route.fulfill({
      json: route.request().url().includes('/repos?')
        ? [null]
        : route.request().url().includes('/events/')
          ? []
          : { public_repos: 1 },
    }),
  );
  await page.goto('/#github');
  await expect(page.locator('#github')).toContainText('unexpected response');
  await expect(page.locator('.github-stats')).toHaveCount(0);
  await expect(page.locator('#contact')).toBeAttached();
  expect(errors).toEqual([]);
});
