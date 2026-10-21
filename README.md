# Omar Hussain Fahmi - Portfolio

[Visit the live portfolio](https://omar-hussain-fahmi-portfolio.pages.dev/) 
![Omar Hussain Fahmi portfolio](public/og.png)

My personal portfolio brings together full-stack development, SAP Fiori, ABAP Cloud, and UI/UX work. It presents selected projects, technical case studies, professional experience, education, and certifications, with a focused recruiter view for a quick introduction.

## Features

- Responsive layouts, light/dark themes, and a persistent mobile email/CV bar.
- Normal and recruiter modes, with projects and certifications available in both.
- Project pages and a documented Next Chapter case study, with an optional LinkedIn walkthrough.
- Searchable navigation, an interactive portfolio terminal, and keyboard-accessible dialogs.
- Public GitHub activity with caching, deferred requests, and useful rate-limit fallbacks.
- Prerendered HTML, page metadata, social previews, sitemap, robots.txt, and a custom 404.
- Self-hosted fonts, SVG icons, optimized images, and reduced-motion support.
- Privacy information and website terms. The deployed site uses cookie-free Cloudflare Web Analytics; LinkedIn media loads only when requested.

## Stack

React 19 · TypeScript · Vite · React Router · Lucide · CSS · Playwright · axe-core

The production site is hosted on Cloudflare Pages. It has no database, contact submission endpoint, or required private API key.

## Run locally

Use Node.js 24, the version used by CI.

```sh
git clone https://github.com/omarhussainfahmi/portfolio.git
cd portfolio
npm ci
npm run dev
```

Development opens at `http://127.0.0.1:5173`. For a production preview:

```sh
npm run build
npm run preview
```

The build type-checks the project and creates static pages in `dist/`. The preview runs at `http://127.0.0.1:4173`.

## Checks

```sh
npm run check:publication
npm run lint
npm run typecheck
npm run build
npm test
npx playwright test --browser=webkit
npm audit --audit-level=high
```

Install the test browsers once with `npx playwright install chromium webkit`. Automated checks cover routes, metadata, mobile layouts, accessibility in both themes, certificate filtering, dialogs and keyboard focus, project cards, API failures, and optional media loading. Fixtures are used only in tests.

The October 2026 release passed 36 checks each in Chromium and WebKit. Its public mobile Lighthouse run scored 99 for performance and 100 for accessibility, best practices, and SEO, with an LCP of 1.8 seconds. These are dated lab results, not guarantees for every device or connection.

## Project structure

- `src/data/` - profile, experience, certifications, projects, articles, and metadata.
- `src/pages/` - homepage, project/case-study pages, articles, privacy, and website terms.
- `src/components/` - shared interface, media, navigation tools, and GitHub activity.
- `src/styles.css` and `src/sections.css` - themes and responsive styling.
- `public/` - public brand assets, icons, fonts supplied by the build, and security headers.
- `scripts/prerender.tsx` - static page generation, metadata, sitemap, and robots.txt.
- `tests/` - browser and accessibility regression checks.

## Privacy and secrets

This repository contains reviewed website source. CV/report downloads, dashboard screenshots, raw audit logs, local backups, environment files, and old hosting metadata are intentionally excluded. Download links point to the existing live portfolio, so these personal documents do not need to be copied into GitHub.

The name, professional contact information, project links, and certifications already shown on the live portfolio remain part of the site content. No private API key is needed: GitHub data uses its public unauthenticated API. Never place credentials in client code or variables prefixed with `VITE_`, because those values are exposed to browsers. See [SECURITY.md](SECURITY.md).

## Configuration and deployment

`VITE_SITE_URL` is an optional **public** HTTPS origin used for canonical URLs, metadata, and the sitemap. `.env.example` documents it. Review `src/data/siteConfig.ts` and project download links when adapting the site for another owner or domain.

Run the checks, then upload the **contents of `dist/`** to Cloudflare Pages. Keep `public/_headers` so the host can apply CSP, HTTPS, referrer, and other security headers. Vite's local preview does not simulate host headers. Cloudflare analytics is enabled in the owner's hosting dashboard; no tracking credential is committed here.

See [deployment notes](docs/DEPLOYMENT.md) and [sources and attribution](docs/SOURCES.md).

## Content and reuse

This is Omar Hussain Fahmi's personal portfolio. Personal content, certificates, project documentation, third-party trademarks, and linked repositories retain their respective ownership and license terms. Review those rights before reusing materials; publication of this repository does not grant a blanket license to personal documents or third-party project assets.

For optional local commit protection, install Gitleaks and run `git config core.hooksPath .githooks`. The hook checks staged source and blocks a commit if its checks fail. CI performs the publication check and a redacted Git-history secret scan as well.

## Reel review improvements - 21 October 2026

[Review notes](docs/REEL-REVIEW.md) map all ten supplied reels to applicable changes and explain review limits and excluded advice. Scroll progress now avoids a full React tree update on every pixel and coalesces work per animation frame. Command search adds Home/End navigation and keeps selection visible; the navigation disclosure supports outside/focus dismissal and Escape focus return. GitHub cache/provider validation rejects corrupt or future-dated data and unsafe cached links. The Vite development dependency was patched to 7.3.7 after a package audit reported advisories. Existing architecture, themes, content, routes and downloads are preserved.

Verification: production build, TypeScript and ESLint passed; all 40 tests passed in Chromium and all 40 passed in WebKit. The package audit reported zero known vulnerabilities. Publication policy checks passed for the reviewed source; private downloads and internal records remain excluded from GitHub. Tests cover all existing routes, nine responsive widths, both themes, mobile actions, filtering, dialogs, optional media, command selection and malformed/future cache data. Pending scroll work is non-urgent so it does not interrupt hydration of deferred sections.

The tested application build from commit `4ffcf8e` was uploaded to the existing Cloudflare Pages project and the dashboard confirmed deployment success. The live command palette's End navigation selected and revealed Terminal correctly. Local source/website ZIPs and dated backups were refreshed. The remote README edit that removed the top case-study link was preserved when integrating this work.
