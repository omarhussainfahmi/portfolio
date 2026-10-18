# Deployment

Public website: https://omar-hussain-fahmi-portfolio.pages.dev/

## Build and publish

Use Node.js 24 and run `npm ci`, `npm run lint`, `npm run build`, `npm test`, and `npm audit --audit-level=high`. For WebKit checks, install its browser and run `npx playwright test --browser=webkit`.

Upload only the contents of `dist/` to Cloudflare Pages. The build includes prerendered pages, a real 404 page, page metadata, social previews, a sitemap, and robots.txt. `public/_headers` contains the production security and cache headers. Vite preview does not apply these host-specific headers.

Set `VITE_SITE_URL` only when changing the public HTTPS origin. No private API token belongs in that variable or any browser-visible setting. Cloudflare Web Analytics is configured in the hosting dashboard; it is injected by the host and not installed with a private credential in source.

## Personal downloads

The public repository intentionally omits the CV PDF and Next Chapter report. Their links point to the existing live portfolio, so a local clone still offers those downloads. An owner deployment may keep those files locally in `public/`; they are ignored by Git. When adapting the project, change the download URLs and use documents you are authorized to publish.

## Backups

The owner's Windows checkout has a release backup script. `npm run prepare-release` runs checks, build, tests and dependency audit, then updates the source and website ZIPs in the checkout's parent folder. Previous copies and SHA-256 manifests stay under ignored `backups/`.

An owner source backup can include local CV/report files and internal notes when present. Keep it private and never upload it as a website or GitHub source archive. Publish only reviewed Git-tracked source; deploy only `dist/`. Cloudflare's retained deployments can also be used for rollback.
