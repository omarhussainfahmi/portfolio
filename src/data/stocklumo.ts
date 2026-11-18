import type { Project } from './projects';

const repository = 'https://github.com/omarhussainfahmi/stocklumo';
const revision = 'a6c4d71fc4505277419e7ba26ef1833060d24064';
const gallery: Project['gallery'] = [
  {
    src: '/images/stocklumo-home-dark.webp',
    alt: 'Stocklumo homepage in dark mode with stock search and links to Markets and Watchlist',
    caption: 'Homepage in dark mode.',
  },
  {
    src: '/images/stocklumo-home-light.webp',
    alt: 'Stocklumo homepage in light mode with stock search and links to Markets and Watchlist',
    caption: 'Homepage in light mode.',
  },
  {
    src: '/images/stocklumo-market-overview.webp',
    alt: 'Stocklumo dashboard with market coverage, a daily stock snapshot, and research links',
    caption:
      'Market overview. Coverage, quote availability, and changes for the daily stock selection.',
  },
  {
    src: '/images/stocklumo-stock-spotlight.webp',
    alt: 'Stocklumo spotlight showing eight stocks with prices, daily changes, and quote timestamps',
    caption: 'Stock spotlight. The daily selection shows when each quote was captured.',
  },
  {
    src: '/images/stocklumo-watchlist.webp',
    alt: 'Stocklumo watchlist with saved companies, reorder and remove controls, and recently viewed stocks',
    caption: 'Watchlist. Saved stocks and recently viewed companies stay in the same browser.',
  },
  {
    src: '/images/stocklumo-news.webp',
    alt: 'Stocklumo news page in light mode with publisher names, timestamps, and article summaries',
    caption:
      'News. Publisher attribution and timestamps give readers context before they open a story.',
  },
  {
    src: '/images/stocklumo-explore.webp',
    alt: 'Stocklumo Markets grid with company symbols, prices, quote timestamps, and a More stocks button',
    caption: 'Explore stocks. Open a company from the grid or load more symbols.',
  },
  {
    src: '/images/stocklumo-screener.webp',
    alt: 'Stocklumo screener with a company table, an Apple detail panel, and a size-versus-change plot',
    caption:
      'Stock screener. Inspect a company and see how its size and daily change compare with the filtered set.',
  },
  {
    src: '/images/stocklumo-company-detail.webp',
    alt: 'Alphabet detail page showing the latest quote, unavailable historical prices, trading ranges, and company profile',
    caption:
      'Company detail. The session view shows the latest observation when historical prices are unavailable.',
  },
  {
    src: '/images/stocklumo-comparison.webp',
    alt: 'Stocklumo comparison of Apple and Microsoft by price change, market cap, price-to-earnings ratio, and dividend yield',
    caption:
      'Stock comparison. The latest-snapshot view keeps quote times and metric units visible.',
  },
  {
    src: '/images/stocklumo-practice-portfolio.webp',
    alt: 'Stocklumo virtual portfolio with four practice holdings, allocation, and unrealized gains',
    caption:
      'Virtual portfolio. Example holdings show allocation and unrealized gain or loss in USD.',
  },
  {
    src: '/images/stocklumo-earnings.webp',
    alt: 'Stocklumo earnings calendar with date filters and a timeline comparing estimated and reported earnings per share',
    caption:
      'Earnings calendar. Announcement groups show estimates, reported results, and unavailable values.',
  },
  {
    src: '/images/stocklumo-footer.webp',
    alt: 'Stocklumo footer with research navigation, data attribution, privacy controls, and a motion setting',
    caption:
      'Site footer. Research links sit alongside data attribution, privacy settings, and the motion control.',
  },
];

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
  gallery,
  cardImage: '/images/stocklumo-market-overview.webp',
  galleryInvite: 'Explore the markets, look up a company, or build a watchlist in the live app.',
  liveUrl: 'https://stocklumo.onrender.com/',
  githubUrl: repository,
  caseStudy: '/case-studies/stocklumo',
  featured: true,
  status: 'Personal project',
  features: [
    'Live prices with quote timestamps and stale-data indicators',
    'Company search, stock pages, interactive charts, and publisher-linked news',
    'Watchlist, recently viewed stocks, and theme preferences stored in the browser',
    'Stock screener, side-by-side comparison, virtual portfolio, and earnings calendar',
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
    {
      label: 'Research endpoints',
      url: `${repository}/blob/${revision}/MarketDesk/Controllers/ResearchController.cs`,
    },
    {
      label: 'Research interface code',
      url: `${repository}/tree/${revision}/MarketDesk/wwwroot/js/research`,
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
    'From the dashboard to a company',
    'I separated three numbers that are easy to confuse: companies in the eligible symbol catalogue, stocks in the daily spotlight, and spotlight stocks with quotes available. The fixed ticker stays separate from the daily selection, though both use the same quote and subscription infrastructure. The dashboard averages available spotlight changes against the previous close, and labels which selection the figure describes. A reader can open an individual company to see its quote age, profile, and day and 52-week ranges.',
  ],
  [
    'One provider connection, multiple browsers',
    'The ASP.NET Core server uses Finnhub REST endpoints for snapshots, company information, news, and research data. One shared WebSocket receives trades, and reference counts let multiple views follow the same symbol without opening separate provider connections. The server releases unused subscriptions, reconnects and resubscribes after a drop, and sends browser snapshots through server-sent events. Several trades may be combined into one UI update.',
  ],
  [
    'Making data limits visible',
    'The interface reports feed connectivity, market hours, and quote freshness separately. An open connection can still carry an older quote, especially after hours. When the provider plan does not return historical candles, the session view can display observations received during the visit. A single observation appears as a latest quote because a trend needs at least two points.',
  ],
  [
    'Screening and comparing stocks',
    'The screener filters and sorts a curated set of 12 US companies by values such as price, industry, market cap, and average volume. The table and charts use the same filtered companies. Comparison accepts two to five symbols and labels the units and quote times for each. When historical data is available, the chart aligns the common dates and rebases closes to 100. The public snapshot shown in the gallery instead compares fundamentals and price changes against each stock’s previous close.',
  ],
  [
    'Valuing a practice portfolio',
    'A practice lot records its symbol, purchase date, quantity, and purchase price. The app uses eligible quotes to calculate cost basis, latest value, unrealized gain or loss, and allocation. Totals stay grouped by currency, and missing or pre-purchase quotes can leave a total incomplete. The holdings are hypothetical, stored in the browser, and used for practice only.',
  ],
  [
    'Earnings and publisher-linked news',
    'The calendar groups earnings by announcement date and keeps fiscal reporting periods separate. It displays estimated and reported earnings per share side by side, preserving the difference between a missing value and zero. The news page adds publisher attribution and timestamps and sends readers to the original article.',
  ],
  [
    'Keeping the workspace in the browser',
    'Watchlists, recent stocks, practice holdings, and preferences remain in browser storage. The watchlist supports reordering and removal and shows quote age next to price. The backup flow exports local data and validates a selected file before showing what it will replace. A separate confirmation applies the restore.',
  ],
  [
    'Designing for different ways to use it',
    'I used Razor for the page structure and JavaScript for updates such as search, chart inspection, and research filters. Search supports keyboard navigation, and chart inspection is available through keyboard and pointer controls where a series is available. Both themes preserve price signs and labels alongside color. The footer makes data attribution, privacy settings, and the motion control available across pages.',
  ],
  [
    'Protecting credentials and shared capacity',
    'The browser talks to the app server, which supplies the Finnhub credential from server-side configuration. I added symbol validation, bounded responses and caches, and limits on requests and concurrent streams. The Render release also applies per-network limits so a single busy client cannot consume the whole shared allowance. GitHub Actions checks the container image and project dependencies.',
  ],
  [
    'Testing the failure paths',
    'Backend tests cover provider throttling, credential isolation, stream cleanup, and admission limits. JavaScript tests exercise research calculations and rendering, including incomplete valuations. Playwright uses controlled fixtures for unavailable, stale, and delayed data and checks search, charts, watchlist persistence, and backup restore across desktop, Android Chromium, and iPhone WebKit profiles. The linked 18 November 2026 release run passed the backend, frontend, browser, and runtime image checks.',
  ],
  [
    'Development and release history',
    'Stocklumo grew from quote tracking into a research workspace. I separated chart rendering, feed handling, and page-specific research logic so those behaviors could be maintained and tested independently. The linked rate-limit pull request records a later production change and its verification. GitHub Actions builds and checks the Docker image and runs the test suites before Render deploys from main.',
  ],
] as const;
