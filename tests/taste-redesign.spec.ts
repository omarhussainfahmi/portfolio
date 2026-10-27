import { test, expect } from '@playwright/test';
test('redesign preserves the requested front-card skills and experience copy', async ({ page }) => {
  await page.goto('/');
  for (const recruiter of [false, true]) {
    if (recruiter) await page.getByRole('button', { name: 'Recruiter mode', exact: true }).click();
    await expect(page.locator('#projects .project-card').nth(0).locator('.tags span')).toHaveText([
      'HTML',
      'PHP',
      'MySQL',
      'Google Books API',
    ]);
    await expect(page.locator('#projects .project-card').nth(1).locator('.tags span')).toHaveText([
      'C#',
      'ASP.NET Core MVC',
      '.NET 8',
      'Razor',
    ]);
    const jobs = page.locator('.timeline-row');
    await expect(jobs.nth(0).locator('.tags')).toContainText('SQL');
    await expect(jobs.nth(0).locator('.tags')).toContainText('OOP');
    await expect(jobs.nth(1)).toContainText(
      'Engineered and deployed a book discovery web platform ("Next Chapter"). Built full-stack functionality utilizing HTML, PHP, CSS, JavaScript, and MySQL. Integrated Google Books API and implemented secure user authentication protocols.',
    );
    await expect(jobs.nth(1).locator('.tags span')).toHaveText([
      'HTML',
      'PHP',
      'CSS',
      'JavaScript',
      'MySQL',
      'Google Books API',
    ]);
    await expect(page.locator('.certificate-card').first()).toContainText('Asp.Net Core 10');
    await expect(page.locator('#about')).not.toContainText('SAP training');
    await expect(page.locator('main')).not.toContainText(/[—–]/);
  }
});
test('documented screenshots are local, labelled and available to the project gallery', async ({
  page,
  request,
}) => {
  await page.goto('/projects/next-chapter');
  await expect(page.locator('.project-gallery figure')).toHaveCount(5);
  for (const image of ['landing', 'genres', 'discovery', 'library']) {
    const response = await request.get(`/images/next-chapter-${image}.webp`);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('image/webp');
  }
  await expect(page.getByRole('button', { name: 'Live demo unavailable' })).not.toHaveAttribute(
    'title',
    /404|September/,
  );
  await page.getByRole('button', { name: /Enlarge: Next Chapter genre preferences/ }).click();
  await expect(page.getByRole('dialog', { name: 'Project image' })).toContainText(
    'Genre preferences',
  );
});
