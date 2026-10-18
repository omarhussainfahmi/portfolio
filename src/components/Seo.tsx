import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { defaultOrigin, pageMetadata } from '../data/metadata';
export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = pageMetadata(pathname);
    const origin = (import.meta.env.VITE_SITE_URL || defaultOrigin).replace(/\/$/, '');
    document.title = meta.title;
    const set = (key: string, value: string | undefined, property = false) => {
      let el = document.head.querySelector<HTMLMetaElement>(
        `meta[${property ? 'property' : 'name'}="${key}"]`,
      );
      if (!value) {
        el?.remove();
        return;
      }
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(property ? 'property' : 'name', key);
        document.head.append(el);
      }
      el.content = value;
    };
    set('description', meta.description);
    set('robots', meta.known ? 'index,follow' : 'noindex,follow');
    set('og:site_name', 'Omar Hussain Fahmi Portfolio', true);
    set('og:image:alt', 'Omar Hussain Fahmi - developer portfolio', true);
    set('og:title', meta.title, true);
    set('og:description', meta.description, true);
    set('og:type', meta.type, true);
    set('og:url', `${origin}${meta.path}`, true);
    set('og:image', meta.image ? origin + meta.image : undefined, true);
    set('twitter:card', meta.image ? 'summary_large_image' : 'summary');
    set('twitter:title', meta.title);
    set('twitter:description', meta.description);
    set('twitter:image', meta.image ? origin + meta.image : undefined);
    let canonical = document.querySelector<HTMLLinkElement>('link[rel=canonical]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = origin + meta.path;
  }, [pathname]);
  return null;
}
