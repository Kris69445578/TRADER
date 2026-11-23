# Changes made to the upstream templates

## Accumulators / Digits / Rise-Fall (Next.js, App Builder templates)
- `.env.production`: your App ID (350K1vjYSPxXbn8jLnfYN), app name, scopes `trade,account_manage`,
  `NEXT_PUBLIC_BASE_PATH=/t/<name>`; referral link left empty. Redirect URI left unset (templates then use
  `window.location.origin`, so the build works on any domain).
- `next.config.js`: `output: 'export'`, `basePath`, `trailingSlash`, `images.unoptimized` (static hosting).
- `packages/core/src/auth/oauth.ts`: Log in / Sign up navigate `window.top` (Deriv's auth page can't be framed).
- Owner-specific `public/app-config.json`, `netlify.toml`, `_headers` removed.

## Bot (deriv-com/trading-bot-template)
- Sub-path hosting: `rsbuild.config.ts` (assetPrefix + BASE_PATH), router `basename`, `getUrlBase()`,
  `initWorkspace()` public path, tour video URLs, relative favicon.
- `isProduction()` always true (upstream picks staging unless the hostname matches brand.config.json).
- Login / sign-up redirects use `window.top`; OAuth-callback fallback URL keeps the base path.
- `utils/version-check.ts`: no longer calls `localStorage.clear()` / deletes cookies — upstream wiped the whole
  origin (it would have logged you out of every other tab).
- `BrandLogo.tsx`: "JAHIM TRADER" wordmark instead of the placeholder.
- `index.html`: Deriv's Google Tag Manager container removed.

## Shell (new)
`index.html`, `shell.js`, `menu.js`, `shell.css` + your original loader, theme and menu styling.
