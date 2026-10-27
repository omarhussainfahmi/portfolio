import { useEffect, useState } from 'react';
import { Github, Star } from 'lucide-react';
import { fetchGithub, githubConfig, isGithubSnapshot } from '../data/github';
import type { GitHubSnapshot } from '../data/github';
import { ExternalLink, Tags } from './ui';
import { projects } from '../data/projects';
export default function GithubSection() {
  const [data, setData] = useState<GitHubSnapshot | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    const target = document.getElementById('github');
    if (!target || !('IntersectionObserver' in window)) {
      setRequested(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRequested(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  const otherRepos =
    data?.repos
      .filter(
        (repo) =>
          !projects.some(
            (project) => project.githubUrl.toLowerCase() === repo.html_url.toLowerCase(),
          ),
      )
      .slice(0, 4) || [];
  useEffect(() => {
    if (!requested) return;
    const controller = new AbortController();
    let valid = true;
    async function refresh() {
      setError('');
      try {
        const saved = localStorage.getItem(githubConfig.cacheKey);
        if (saved) {
          const cache: unknown = JSON.parse(saved);
          if (isGithubSnapshot(cache) && Date.now() - cache.fetchedAt < githubConfig.cacheMs) {
            if (valid) setData(cache);
            return;
          }
        }
      } catch {
        /* Ignore unavailable or invalid local storage. */
      }
      try {
        const snapshot = await fetchGithub(controller.signal);
        if (valid) {
          setData(snapshot);
          try {
            localStorage.setItem(githubConfig.cacheKey, JSON.stringify(snapshot));
          } catch {
            /* caching is optional */
          }
        }
      } catch (e) {
        if (valid && !controller.signal.aborted)
          setError(e instanceof Error ? e.message : 'GitHub is unavailable.');
      }
    }
    void refresh();
    const timer = setInterval(refresh, githubConfig.refreshMs);
    return () => {
      valid = false;
      controller.abort();
      clearInterval(timer);
    };
  }, [attempt, requested]);
  const languages = data
    ? Object.entries(
        data.repos.reduce<Record<string, number>>((result, r) => {
          if (r.language) result[r.language] = (result[r.language] || 0) + 1;
          return result;
        }, {}),
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => `${name} · ${count} ${count === 1 ? 'repo' : 'repos'}`)
    : [];
  return (
    <>
      <div className="github-intro">
        <p>Public projects and recent activity, directly from GitHub.</p>
        <ExternalLink className="text-link" href={githubConfig.profileUrl}>
          <Github size={20} /> @omarhussainfahmi
        </ExternalLink>
      </div>
      <h3>Project repositories</h3>
      <p className="data-note">
        Personal and team projects, including Next Chapter in the shared project repository.
      </p>
      <div className="repo-grid project-repositories">
        {projects.map((project) => (
          <article key={project.id}>
            <ExternalLink href={project.githubUrl}>{project.title}</ExternalLink>
            <p>{project.description}</p>
            <span>{project.githubUrl.replace('https://github.com/', '')}</span>
          </article>
        ))}
      </div>
      {!data && !error && (
        <div className="github-loading" role="status">
          Loading public GitHub activity…
          <div className="skeleton" />
        </div>
      )}
      {error && (
        <div className="api-error" role="status">
          <p>{error} The profile remains available below.</p>
          <button className="button secondary" onClick={() => setAttempt((v) => v + 1)}>
            Retry GitHub
          </button>
        </div>
      )}
      {data && (
        <>
          <dl className="github-stats">
            <div>
              <dt>Public repositories</dt>
              <dd>{data.profile.public_repos}</dd>
            </div>
            <div>
              <dt>Stars across loaded repos</dt>
              <dd>{data.repos.reduce((a, r) => a + r.stargazers_count, 0)}</dd>
            </div>
            <div>
              <dt>Followers</dt>
              <dd>{data.profile.followers}</dd>
            </div>
            <div>
              <dt>Following</dt>
              <dd>{data.profile.following}</dd>
            </div>
          </dl>
          <h3>Most-used primary languages</h3>
          <Tags items={languages} />
          <p className="data-note">
            Based on the primary language of up to 100 recent public repositories; not a measure of
            proficiency.
          </p>
          {otherRepos.length > 0 && (
            <>
              <h3>Other recent repositories</h3>
              <div className="repo-grid">
                {otherRepos.map((r) => (
                  <article key={r.id}>
                    <ExternalLink href={r.html_url}>{r.name}</ExternalLink>
                    <p>{r.description || 'No public description provided.'}</p>
                    <span>
                      {r.language || 'Language not specified'} <Star size={13} />{' '}
                      {r.stargazers_count}
                    </span>
                  </article>
                ))}
              </div>
            </>
          )}
          <h3>Recent public activity</h3>
          {data.events.length ? (
            <ul className="activity-list">
              {data.events.map((e) => (
                <li key={e.id}>
                  <span>{e.type.replace(/Event$/, '')}</span>
                  <span>{e.repo.name}</span>
                  <time dateTime={e.created_at}>
                    {new Date(e.created_at).toLocaleDateString('en-GB')}
                  </time>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent public events returned by GitHub.</p>
          )}
          <p className="data-note">
            Fetched {new Date(data.fetchedAt).toLocaleString('en-GB')}. Cached for 15 minutes.
            Public events are not a total contribution count.
          </p>
        </>
      )}
      <ExternalLink className="text-link" href={githubConfig.profileUrl}>
        View profile & contribution graph
      </ExternalLink>
    </>
  );
}
