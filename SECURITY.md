# Security and privacy

This is a static personal portfolio. It does not require a private GitHub token, email-service credential, or database password.

## Keep secrets out of the browser

- Never put private keys in React components, data files, HTML, public assets, or a `VITE_` environment variable. Values with that prefix are bundled for visitors to read.
- `.env.example` contains only the optional public canonical origin. Real environment files and common credential/key files are ignored.
- Any future authenticated integration must use a server-side component and its hosting provider's secret store. A client-side placeholder or obfuscation does not protect a real credential.
- Cloudflare's public analytics identifier is not a private API credential. Hosting tokens and account metadata are not stored in this repository.

## Repository boundary

CV/report files remain in the owner's local deployment folder and are downloaded through the live website. They are not versioned here. Dashboard screenshots, raw audit outputs, backups, internal notes, and old hosting metadata are also excluded. The site's public professional identity/contact details remain visible by design.

The initial public commit was reviewed with Gitleaks 8.30.1 and a separate check for machine paths, private account metadata, and excluded file types. Automated detection reduces risk; it cannot prove the absence of every possible secret or personal detail. CI scans Git history again on pushes and pull requests.

## If a credential is exposed

Revoke or rotate it at the provider first, remove it from source and affected Git history, and review usage. Deleting only the visible line does not invalidate a credential or remove it from older commits. See [GitHub's guidance](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

Please do not put a credential, private document, or personal identifying data in a public issue. Use GitHub's private vulnerability reporting where available, or contact Omar through the professional contact details on the [portfolio](https://omar-hussain-fahmi-portfolio.pages.dev/).
