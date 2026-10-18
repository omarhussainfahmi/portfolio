import { projects } from './projects';
import { articles } from './blog';
import { siteConfig } from './siteConfig';
export const defaultOrigin = 'https://omar-hussain-fahmi-portfolio.pages.dev';
export function pageMetadata(path: string) {
  const clean = path.replace(/\/$/, '') || '/';
  const p = projects.find((p) => clean === `/projects/${p.slug}` || clean === p.caseStudy);
  const a = articles.find((a) => clean === `/blog/${a.slug}`);
  const policy =
    clean === '/privacy'
      ? {
          title: 'Privacy & cookies',
          description:
            'How Omar Hussain Fahmi’s portfolio uses browser preferences, cookie-free analytics, external media, and information sent by email.',
        }
      : clean === '/terms'
        ? {
            title: 'Website terms',
            description:
              'Information about using Omar Hussain Fahmi’s personal portfolio, project materials, external resources, and professional enquiries.',
          }
        : undefined;
  const known = clean === '/' || clean === '/blog' || !!p || !!a || !!policy;
  const title = policy
    ? `${policy.title} | ${siteConfig.name}`
    : clean === '/'
      ? `${siteConfig.name} | ${siteConfig.title}`
      : p
        ? `${p.title}${clean.startsWith('/case-studies') ? ' - Case Study' : ''} | ${siteConfig.name}`
        : a
          ? `${a.title} | ${siteConfig.name}`
          : clean === '/blog'
            ? `Articles | ${siteConfig.name}`
            : `Page not found | ${siteConfig.name}`;
  const description =
    policy?.description ||
    (p
      ? p.longDescription
      : a
        ? a.description
        : clean === '/blog'
          ? 'Articles and notes on development, SAP, and continuous learning. Articles coming soon.'
          : siteConfig.summary);
  return {
    title,
    description,
    image: a?.image || '/og.png',
    known,
    type: a ? 'article' : 'website',
    path: clean,
  };
}
