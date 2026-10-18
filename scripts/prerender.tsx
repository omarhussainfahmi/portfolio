import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createServer, loadEnv } from 'vite';
import { projects } from '../src/data/projects';
import { articles } from '../src/data/blog';
import { defaultOrigin, pageMetadata } from '../src/data/metadata';
import { siteConfig } from '../src/data/siteConfig';
const origin = (
  process.env.VITE_SITE_URL ||
  loadEnv('production', process.cwd(), 'VITE_').VITE_SITE_URL ||
  defaultOrigin
).replace(/\/$/, '');
if (new URL(origin).protocol !== 'https:')
  throw new Error('VITE_SITE_URL must be a public HTTPS origin.');
const routes = [
  '/',
  '/blog',
  '/privacy',
  '/terms',
  ...projects.map((p) => `/projects/${p.slug}`),
  ...projects.flatMap((p) => (p.caseStudy ? [p.caseStudy] : [])),
  ...articles.map((a) => `/blog/${a.slug}`),
];
const fontFiles = (await readdir('dist/assets')).filter((name) =>
  /^(inter-latin-400|poppins-latin-500)-normal-.*\.woff2$/.test(name),
);
const fontPreloads = fontFiles
  .map(
    (name) =>
      `<link rel="preload" href="/assets/${name}" as="font" type="font/woff2" crossorigin/>`,
  )
  .join('');
const template = (await readFile('dist/index.html', 'utf8')).replace(
  '<!--seo-->',
  fontPreloads + '<!--seo-->',
);
const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render } = (await vite.ssrLoadModule('/src/entry-server.tsx')) as {
    render: (path: string) => Promise<string>;
  };
  for (const path of [...routes, '/404']) {
    const m = pageMetadata(path);
    const image = m.image ? origin + m.image : null;
    const tags = `<title>${escape(m.title)}</title><meta name="description" content="${escape(m.description)}"/><meta name="robots" content="${m.known ? 'index,follow' : 'noindex,follow'}"/><link rel="canonical" href="${origin}${path}"/><meta property="og:site_name" content="Omar Hussain Fahmi Portfolio"/><meta property="og:image:alt" content="Omar Hussain Fahmi - developer portfolio"/><meta property="og:title" content="${escape(m.title)}"/><meta property="og:description" content="${escape(m.description)}"/><meta property="og:type" content="${m.type}"/><meta property="og:url" content="${origin}${path}"/><meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}"/><meta name="twitter:title" content="${escape(m.title)}"/><meta name="twitter:description" content="${escape(m.description)}"/>${image ? `<meta property="og:image" content="${image}"/><meta name="twitter:image" content="${image}"/>` : ''}`;
    const person =
      path === '/'
        ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: siteConfig.name, url: origin, jobTitle: siteConfig.title, email: siteConfig.email, sameAs: [siteConfig.github, siteConfig.linkedin], address: { '@type': 'PostalAddress', addressLocality: 'Jeddah', addressCountry: 'SA' }, alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Jordan' }, knowsLanguage: ['Arabic', 'English'] }).replace(/</g, '\\u003c')}</script>`
        : '';
    const output = template
      .replace(/<title>.*?<\/title>/, '')
      .replace('<!--seo-->', tags + person)
      .replace('<div id="root">', `<div id="root" data-path="${path}">`)
      .replace('<!--app-->', await render(path));
    const file = resolve(
      'dist',
      path === '/404' ? '404.html' : path === '/' ? 'index.html' : `${path.slice(1)}/index.html`,
    );
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, output);
    console.log(`Prerendered ${path}`);
  }
  await writeFile(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((path) => `<url><loc>${escape(origin + path)}</loc></url>`).join('')}</urlset>`,
  );
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
} finally {
  await vite.close();
}
