import type { Project } from './projects';

const repository = 'https://github.com/omarhussainfahmi/stocklumo';
const revision = 'a6c4d71fc4505277419e7ba26ef1833060d24064';
const screenshot = '/images/stocklumo-markets.webp';

export const stocklumo: Project = {
  id: 'stocklumo',
  slug: 'stocklumo',
  title: 'Stocklumo',
  category: 'Full-stack market data application',
  description: 'A stock dashboard with streaming quotes, company research, and a local watchlist.',
  longDescription:
    'I built and deployed a stock-tracking app that turns Finnhub market data into a dashboard with streaming quotes, company pages, charts, news, and a browser-local watchlist.',
  cardTechnologies: ['C#', 'ASP.NET Core 10', 'JavaScript', 'Finnhub API'],
  technologies: [
    'C#',
    'ASP.NET Core 10 MVC',
    'Razor',
    'JavaScript',
    'Finnhub API',
    'WebSockets',
    'Server-Sent Events',
    'xUnit',
    'Playwright',
    'GitHub Actions',
    'Docker',
    'Render',
  ],
  gallery: [
    {
      src: screenshot,
      alt: 'Stocklumo Markets page showing the quote ticker, daily stock selection, and price changes',
      caption: 'Markets view captured from the deployed app. Prices reflect the time of capture.',
    },
  ],
  cardImage: screenshot,
  liveUrl: 'https://stocklumo.onrender.com/',
  githubUrl: repository,
  caseStudy: '/case-studies/stocklumo',
  featured: true,
  status: 'Personal project',
  features: [
    'Live prices with quote timestamps and stale-data indicators',
    'Company search, stock pages, interactive charts, and publisher-linked news',
    'Watchlist, recently viewed stocks, and theme preferences stored in the browser',
    'Responsive interface with keyboard-accessible search and chart controls',
  ],
  technical: [
    'ASP.NET Core MVC serves Razor pages, while JavaScript updates charts and quote views.',
    'A shared upstream WebSocket receives Finnhub trades. Server-sent events deliver snapshots to browsers.',
    'The deployed app runs in a Docker container on Render. GitHub Actions builds and verifies changes.',
  ],
  evidence: [
    {
      label: 'Market data implementation',
      url: `${repository}/blob/${revision}/MarketDesk/Services/FinnhubFeed.cs`,
    },
    { label: 'Backend tests', url: `${repository}/tree/${revision}/MarketDesk.Tests` },
    { label: 'Frontend and browser tests', url: `${repository}/tree/${revision}/tests` },
    { label: 'Passing release checks', url: `${repository}/actions/runs/44383902755` },
    { label: 'Rate limiting and release review', url: `${repository}/pull/3` },
    { label: 'Commit history', url: `${repository}/commits/main/` },
  ],
};

export const stocklumoCaseSections = [
  [
    'What I built',
    'I built Stocklumo so someone following a handful of companies could move from a price change to the chart, company profile, or source article without leaving the workflow. I implemented the market-data pipeline, the Razor and JavaScript interface, automated tests, and the deployment to Render.',
  ],
  [
    'One provider connection, multiple browsers',
    'I used one shared Finnhub WebSocket so opening another tab would not open another provider connection. The server tracks which stock symbols browsers need and distributes price snapshots through server-sent events. It releases unused subscriptions, reconnects when the feed drops, and can combine several trades into one UI update.',
  ],
  [
    'Making data limits visible',
    'The interface distinguishes feed connectivity, market hours, and quote freshness. When historical candles are unavailable under the provider plan, users can still inspect the session chart built from trades received while the page is open. Search and chart controls work with a keyboard, and watchlist entries persist across reloads in the same browser.',
  ],
  [
    'Protecting credentials and shared capacity',
    'The browser talks to the app server, which supplies the Finnhub credential from server-side configuration. I added symbol validation, bounded responses and caches, and limits on requests and concurrent streams. The Render release also applies per-network limits so a single busy client cannot consume the whole shared allowance. GitHub Actions checks the container image and project dependencies.',
  ],
  [
    'Testing the failure paths',
    'Backend tests exercise provider throttling, credential isolation, stream cleanup, and admission limits. JavaScript and Playwright tests cover search, charts, watchlist persistence, and responsive layouts. The browser tests use controlled fixtures to reproduce unavailable, stale, and delayed data. The linked GitHub Actions run passed for the 18 November 2026 release, including the backend, frontend, browser, and runtime image checks.',
  ],
  [
    'Development and release history',
    'The public history shows how the project evolved from quote tracking into an application with a shared feed, reusable frontend modules, and repeatable release checks. The linked rate-limit pull request shows a production change from implementation through review and verification. Render deploys from main after the required checks pass.',
  ],
] as const;
