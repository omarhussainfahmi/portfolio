import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { articles, readingTime } from '../data/blog';
import { Tags } from '../components/ui';
import { NotFound } from '../App';
export default function Blog() {
  const { slug } = useParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  if (slug) {
    const a = articles.find((a) => a.slug === slug);
    if (!a) return <NotFound message="This article is not available." />;
    return (
      <article className="article-page">
        <Link className="text-link" to="/blog">
          <ArrowLeft size={18} /> All articles
        </Link>
        <h1>{a.title}</h1>
        <p>
          {a.category} / {a.publishedAt} / {readingTime(a)} min read
        </p>
        <Tags items={a.tags} />
        {a.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <h2>Related articles</h2>
        {articles
          .filter((b) => b.slug !== slug && b.category === a.category)
          .map((b) => (
            <Link key={b.slug} className="text-link" to={`/blog/${b.slug}`}>
              {b.title}
            </Link>
          ))}
      </article>
    );
  }
  const filtered = articles.filter(
    (a) =>
      (category === 'All' || a.category === category) &&
      `${a.title} ${a.description} ${a.tags.join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <section className="blog-page">
      <nav aria-label="Portfolio navigation">
        <Link className="text-link" to="/">
          <ArrowLeft size={18} /> Back to portfolio
        </Link>
      </nav>
      <header className="detail-hero">
        <h1>Things worth writing down.</h1>
        <p>Development, SAP, and lessons from the work.</p>
      </header>
      {articles.length ? (
        <>
          <label className="search-label">
            Search articles
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title or tag…"
            />
          </label>
          <div className="filters">
            {['All', ...new Set(articles.map((a) => a.category))].map((c) => (
              <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="article-grid">
            {filtered.map((a) => (
              <article key={a.slug}>
                <span className="article-context">
                  {a.category} / {readingTime(a)} min read
                </span>
                <h2>
                  <Link to={`/blog/${a.slug}`}>{a.title}</Link>
                </h2>
                <p>{a.description}</p>
                <time dateTime={a.publishedAt}>{a.publishedAt}</time>
                <Tags items={a.tags} />
              </article>
            ))}
          </div>
          {!filtered.length && <p role="status">No articles match your search.</p>}
        </>
      ) : (
        <div className="blog-empty">
          <BookOpen size={42} />
          <h2>Articles Coming Soon</h2>
          <p>
            This space is ready for the first article.
            <br />
            In the meantime, explore the projects.
          </p>
          <Link className="button secondary" to="/#projects">
            View projects
          </Link>
        </div>
      )}
    </section>
  );
}
