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
  if (!Number.isFinite(profile.public_repos) || !Array.isArray(repos) || !Array.isArray(events))
    throw new Error('GitHub returned an unexpected response.');
  return {
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
      .filter((e: GitHubSnapshot['events'][number]) => e.repo?.name && e.created_at)
      .map((e: GitHubSnapshot['events'][number]) => ({
        id: e.id,
        type: e.type,
        repo: { name: e.repo.name },
        created_at: e.created_at,
      })),
    fetchedAt: Date.now(),
  };
}
