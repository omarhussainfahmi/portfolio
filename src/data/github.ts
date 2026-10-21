export const githubConfig = {
  username: 'omarhussainfahmi',
  profileUrl: 'https://github.com/omarhussainfahmi',
  apiOrigin: 'https://api.github.com',
  cacheMs: 15 * 60 * 1000,
  refreshMs: 15 * 60 * 1000,
  cacheKey: 'omar-github-v1',
};
export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
}
export interface GitHubSnapshot {
  profile: { public_repos: number; followers: number; following: number };
  repos: GitHubRepo[];
  events: { id: string; type: string; repo: { name: string }; created_at: string }[];
  fetchedAt: number;
}
export function isGithubSnapshot(value: unknown): value is GitHubSnapshot {
  if (!value || typeof value !== 'object') return false;
  const data = value as GitHubSnapshot;
  const count = (n: unknown) => typeof n === 'number' && Number.isInteger(n) && n >= 0;
  return (
    !!data.profile &&
    [data.profile.public_repos, data.profile.followers, data.profile.following].every(count) &&
    Number.isFinite(data.fetchedAt) &&
    data.fetchedAt > 0 &&
    data.fetchedAt <= Date.now() &&
    Array.isArray(data.repos) &&
    data.repos.length <= 100 &&
    data.repos.every(
      (r) =>
        r &&
        count(r.id) &&
        typeof r.name === 'string' &&
        r.name.length > 0 &&
        r.html_url === `${githubConfig.profileUrl}/${encodeURIComponent(r.name)}` &&
        (r.description === null || typeof r.description === 'string') &&
        (r.language === null || typeof r.language === 'string') &&
        count(r.stargazers_count) &&
        Number.isFinite(Date.parse(r.updated_at)),
    ) &&
    Array.isArray(data.events) &&
    data.events.length <= 5 &&
    data.events.every(
      (e) =>
        e &&
        typeof e.id === 'string' &&
        typeof e.type === 'string' &&
        typeof e.repo?.name === 'string' &&
        Number.isFinite(Date.parse(e.created_at)),
    )
  );
}
export async function fetchGithub(signal: AbortSignal): Promise<GitHubSnapshot> {
  const get = async (path: string) => {
    const response = await fetch(`${githubConfig.apiOrigin}${path}`, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]),
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok)
      throw new Error(
        response.status === 403 || response.status === 429
          ? 'GitHub’s public API is temporarily rate-limited.'
          : 'GitHub is temporarily unavailable.',
      );
    return response.json();
  };
  const [profile, repos, events] = await Promise.all([
    get(`/users/${githubConfig.username}`),
    get(`/users/${githubConfig.username}/repos?sort=updated&per_page=100`),
    get(`/users/${githubConfig.username}/events/public?per_page=5`),
  ]);
  if (
    !profile ||
    !Array.isArray(repos) ||
    !repos.every((r) => r && typeof r.name === 'string') ||
    !Array.isArray(events)
  )
    throw new Error('GitHub returned an unexpected response.');
  const snapshot = {
    profile: {
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
    },
    repos: repos.map((r: GitHubRepo) => ({
      id: r.id,
      name: r.name,
      html_url: `${githubConfig.profileUrl}/${encodeURIComponent(r.name)}`,
      description: typeof r.description === 'string' ? r.description : null,
      language: typeof r.language === 'string' ? r.language : null,
      stargazers_count: Number(r.stargazers_count) || 0,
      updated_at: r.updated_at,
    })),
    events: events
      .filter((e: GitHubSnapshot['events'][number]) => e?.repo?.name && e.created_at)
      .map((e: GitHubSnapshot['events'][number]) => ({
        id: e.id,
        type: e.type,
        repo: { name: e.repo.name },
        created_at: e.created_at,
      })),
    fetchedAt: Date.now(),
  };
  if (!isGithubSnapshot(snapshot)) throw new Error('GitHub returned an unexpected response.');
  return snapshot;
}
