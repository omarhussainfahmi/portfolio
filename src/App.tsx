import { Component, Suspense, lazy, startTransition, useEffect, useState } from 'react';
import type { ReactNode, ComponentType } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Mail,
  Download,
  ArrowUpRight,
  ArrowUp,
  Menu,
  Moon,
  Sun,
  Terminal,
  Search,
  X,
} from 'lucide-react';
import Home from './pages/Home';
import Seo from './components/Seo';
import SiteInformation from './pages/SiteInformation';
import { nav, siteConfig } from './data/siteConfig';
import { ExternalLink } from './components/ui';
import './styles.css';
const ExtendedHome = lazy(() => import('./pages/ExtendedHome'));
const Detail = lazy(() => import('./pages/Detail'));
const Blog = lazy(() => import('./pages/Blog'));
const CommandCenter = lazy(() => import('./components/CommandCenter'));
export function NotFound({ message = 'This page could not be found.' }: { message?: string }) {
  return (
    <section className="empty-page">
      <span className="eyebrow">404 / A WRONG TURN</span>
      <h1>Let’s get you back.</h1>
      <p>{message}</p>
      <Link className="button primary" to="/">
        Back to home
      </Link>
    </section>
  );
}
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <section className="empty-page">
        <h1>Something went wrong.</h1>
        <p>Please reload the page, or contact Omar directly.</p>
        <a className="button primary" href="/">
          Reload portfolio
        </a>
        <a href={`mailto:${siteConfig.email}`}>Email Omar</a>
      </section>
    ) : (
      this.props.children
    );
  }
}
export interface ServerPages {
  ExtendedHome: ComponentType<{ recruiter: boolean }>;
  Detail: ComponentType<{ caseStudy?: boolean }>;
  Blog: ComponentType;
}
export default function App({ pages }: { pages?: ServerPages } = {}) {
  const HomeSections = pages?.ExtendedHome || ExtendedHome;
  const DetailPage = pages?.Detail || Detail;
  const BlogPage = pages?.Blog || Blog;
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [recruiter, setRecruiter] = useState(false);
  const [tool, setTool] = useState<'palette' | 'terminal' | null>(null);
  const [active, setActive] = useState('');
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    startTransition(() => {
      setTheme(document.documentElement.dataset.theme || 'dark');
      try {
        setRecruiter(localStorage.getItem('recruiter') === 'true');
      } catch {
        /* storage is optional */
      }
    });
  }, []);
  useEffect(() => {
    setMenu(false);
    if (location.hash) {
      const id = location.hash.slice(1);
      if (['github', 'case-studies', 'tech-stack', 'testimonials', 'blog'].includes(id)) {
        setRecruiter(false);
        try {
          localStorage.setItem('recruiter', 'false');
        } catch {
          /* optional preference */
        }
      }
      const scroll = () => {
        const target = document.getElementById(id);
        if (!target || target.getClientRects().length === 0) return false;
        target.scrollIntoView();
        return true;
      };
      const observer = new MutationObserver(() => {
        if (scroll()) observer.disconnect();
      });
      const timer = setTimeout(() => {
        if (!scroll())
          observer.observe(document.getElementById('main')!, {
            subtree: true,
            childList: true,
            attributes: true,
          });
      }, 100);
      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    } else {
      window.scrollTo(0, 0);
      document.getElementById('main')?.focus({ preventScroll: true });
    }
  }, [location]);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      setProgress(total > 0 ? scrollY / total : 0);
      const found = Array.from(document.querySelectorAll('main section[id]'))
        .filter((el) => el.getBoundingClientRect().top < 180)
        .at(-1);
      setActive(found?.id || '');
    };
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setTool((v) => (v === 'palette' ? null : 'palette'));
      }
      if (e.key === 'Escape') setMenu(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', key);
    };
  }, []);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage is optional */
    }
  };
  const toggleRecruiter = () =>
    setRecruiter((v) => {
      try {
        localStorage.setItem('recruiter', String(!v));
      } catch {
        /* storage is optional */
      }
      return !v;
    });
  return (
    <ErrorBoundary>
      <Seo />
      <div className={recruiter ? 'app recruiter' : 'app'}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
        <header className={progress > 0.01 ? 'header scrolled' : 'header'}>
          <div className="header-inner">
            <Link className="brand" to="/" aria-label="Omar Hussain Fahmi home">
              <span className="brand-mark">
                OF<span>.</span>
              </span>
              <span>
                OMAR HUSSAIN FAHMI<small>DEVELOPER & SYSTEMS THINKER</small>
              </span>
            </Link>
            <nav aria-label="Primary" className="desktop-nav">
              {[
                ['Work', 'projects'],
                ['About', 'about'],
                ['Experience', 'experience'],
                ['Contact', 'contact'],
              ].map(([label, id]) => (
                <Link key={id} className={active === id ? 'active' : ''} to={`/#${id}`}>
                  {label}
                </Link>
              ))}
            </nav>
            <div className="header-tools">
              <button
                className="recruiter-toggle"
                aria-pressed={recruiter}
                onClick={toggleRecruiter}
              >
                <span className="toggle-track">
                  <i />
                </span>
                Recruiter mode
              </button>
              <button
                className="icon-button"
                aria-label="Open command palette"
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  setTool('palette');
                }}
              >
                <Search size={18} />
              </button>
              <button
                className="icon-button"
                aria-label="Open terminal"
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  setTool('terminal');
                }}
              >
                <Terminal size={18} />
              </button>
              <button className="icon-button" aria-label="Toggle theme" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                className="icon-button"
                aria-label={menu ? 'Close navigation' : 'Open navigation'}
                aria-expanded={menu}
                aria-controls="full-navigation"
                onClick={() => setMenu((v) => !v)}
              >
                {menu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          {menu && (
            <nav id="full-navigation" className="full-nav" aria-label="All sections">
              {nav.map(([label, id]) => (
                <Link
                  onClick={() => setMenu(false)}
                  key={label}
                  to={id === 'blog' ? '/blog' : `/${id ? '#' + id : ''}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </header>
        {recruiter && (
          <div className="recruiter-banner">
            RECRUITER VIEW{' '}
            <span>
              Your 30-second introduction. Experience, projects, and a direct way to connect.
            </span>
            <a href={siteConfig.cv} download>
              Download CV <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        )}
        <main id="main" tabIndex={-1}>
          <Suspense
            fallback={
              <div className="loading" role="status">
                Loading portfolio…
              </div>
            }
          >
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Home recruiter={recruiter} />
                    <HomeSections recruiter={recruiter} />
                  </>
                }
              />
              <Route path="/projects/:slug" element={<DetailPage />} />
              <Route path="/case-studies/:slug" element={<DetailPage caseStudy />} />
              <Route path="/privacy" element={<SiteInformation />} />
              <Route path="/terms" element={<SiteInformation terms />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <footer>
          <div>
            <Link className="brand-mark" to="/">
              OF.
            </Link>
            <h2>{siteConfig.name}</h2>
            <p>
              {siteConfig.title}
              <br />
              {siteConfig.location}
            </p>
          </div>
          <div className="footer-links">
            <ExternalLink href={siteConfig.github}>GitHub</ExternalLink>
            <ExternalLink href={siteConfig.linkedin}>LinkedIn</ExternalLink>
            <a href={`mailto:${siteConfig.email}`} className="text-link">
              Email <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="footer-legal">
            <Link to="/privacy">Privacy & cookies</Link>
            <Link to="/terms">Website terms</Link>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Omar Hussain Fahmi</span>
            <span>Built with React + TypeScript</span>
            <button
              onClick={(event) => {
                event.currentTarget.focus({ preventScroll: true });
                setTool('palette');
              }}
            >
              Find anything <kbd>Ctrl K</kbd>
            </button>
          </div>
        </footer>
        <nav className="mobile-contact" aria-label="Quick contact">
          <a href={`mailto:${siteConfig.email}`}>
            <Mail size={18} aria-hidden="true" /> Email Omar
          </a>
          <a href={siteConfig.cv} download>
            <Download size={18} aria-hidden="true" /> CV
          </a>
        </nav>
        <button
          className="back-top icon-button"
          aria-label="Back to top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'instant'
                : 'smooth',
            })
          }
        >
          <ArrowUp size={20} />
        </button>
        {tool && (
          <Suspense fallback={<div role="status">Opening tools…</div>}>
            <CommandCenter
              mode={tool}
              setMode={setTool}
              onClose={() => setTool(null)}
              toggleTheme={toggleTheme}
              toggleRecruiter={toggleRecruiter}
            />
          </Suspense>
        )}
      </div>
    </ErrorBoundary>
  );
}
