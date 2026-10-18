import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://api.github.com/**', (route) =>
    route.fulfill({ status: 403, json: { message: 'Rate limited' } }),
  );
});

test('all ten certifications remain available in recruiter mode and after filtering', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.certificate-card')).toHaveCount(10);
  await page.getByRole('button', { name: 'Recruiter mode', exact: true }).click();
  await expect(page.locator('.certificate-card')).toHaveCount(10);
  await page.locator('#certifications').getByRole('button', { name: 'Cloud', exact: true }).click();
  await expect(page.locator('.certificate-card')).toHaveCount(1);
  await expect(page.locator('.certificate-card')).toContainText('2025');
  await page.locator('#certifications').getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.certificate-card')).toHaveCount(10);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Recruiter mode', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('.certificate-card')).toHaveCount(10);
});

test('both project repositories survive an API failure and removed sections are absent', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#github .project-repositories a')).toHaveCount(2);
  await expect(
    page.locator('#github').getByRole('link', { name: /^Next Chapter/ }),
  ).toHaveAttribute('href', 'https://github.com/qus0i/Graduation-project');
  await expect(
    page.locator('#github').getByRole('link', { name: /^ASP.NET Project/ }),
  ).toHaveAttribute(
    'href',
    'https://github.com/omarhussainfahmi/ASP.NET-project-Full-dummy-sample-',
  );
  await expect(page.locator('#testimonials, section#blog')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Kind words' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Notes from the journey' })).toHaveCount(0);
});

test('seven supplied credential links appear in their correct certificate dialogs', async ({
  page,
}) => {
  const credentials = [
    ['Asp.Net Core', 'https://www.udemy.com/certificate/UC-aad41ab5-82f7-4395-a090-0cfc86ec9f80/'],
    [
      'UI/UX Design',
      'https://www.credential.net/c648b458-7494-4da5-b556-c5e6b535d500#acc.AbSNBPJI',
    ],
    [
      'Cloud Foundations',
      'https://www.credly.com/badges/8d67a740-6611-4c60-8a4c-dd4fed672600/print',
    ],
    [
      'MySQL Bootcamp',
      'https://www.udemy.com/certificate/UC-7fdef9d1-acec-46fc-9ee1-64f97da9eb29/',
    ],
    [
      'Game Development',
      'https://www.credential.net/24d4de1f-de84-4971-bb2c-42cd65e200b4#acc.DrlgwuQq',
    ],
    [
      'Flutter Program',
      'https://www.credential.net/59d465dc-c531-417d-9e19-162ac99e4831#acc.mhPU7u82',
    ],
    ['E-marketing', 'https://learndigital.withgoogle.com/link/1g13k7gbvgg'],
  ];
  await page.goto('/#certifications');
  for (const [name, url] of credentials) {
    await page.locator('.certificate-card').filter({ hasText: name }).click();
    await expect(
      page
        .getByRole('dialog')
        .getByRole('link', {
          name: name === 'E-marketing' ? /Visit Google learning/ : /View credential/,
        }),
    ).toHaveAttribute('href', url);
    await page.keyboard.press('Escape');
  }
});

test('video showcase loads official LinkedIn embed only on request on all relevant pages', async ({
  page,
}) => {
  await page.route('https://www.linkedin.com/embed/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<html><body>LinkedIn player fixture</body></html>',
    }),
  );
  for (const url of ['/', '/projects/next-chapter', '/case-studies/next-chapter']) {
    await page.goto(url);
    await expect(page.locator('.video-showcase iframe')).toHaveCount(0);
    await page.getByRole('button', { name: 'Play Next Chapter walkthrough', exact: true }).click();
    await expect(page.locator('.video-showcase iframe')).toHaveAttribute(
      'src',
      'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7346077985780723713',
    );
    await expect(page.getByRole('link', { name: /Watch on LinkedIn/ })).toHaveAttribute(
      'href',
      'https://lnkd.in/p/evh-tuQV',
    );
  }
});
