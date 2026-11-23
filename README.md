# JAHIM TRADER — real Deriv templates as tabs

Tabs: **Menu · Accumulators · Bot · Digits · Rise/Fall**
Each trading tab is the actual Deriv template (SmartCharts, Blockly bot builder, positions, etc.),
hosted under `/t/<name>/` and shown in an iframe by the shell (`index.html`, `shell.js`).

## Go-live (2 minutes)
1. Push this folder as-is to your GitHub Pages repo (keep `.nojekyll` and `CNAME`).
2. On https://developers.deriv.com/dashboard/ → your app → edit → **Redirect URLs** → add exactly:
   `https://jahim.crabdance.com`   (no trailing slash — the templates send the bare origin)
   Scopes: Trade + Account management.
3. Open the site → any trading tab → **Log in**. One login serves all four tabs.

The Menu tab shows the exact App ID / Redirect URL for whatever domain you are on.

## How login works
Deriv's login page cannot be shown inside an iframe, so the templates' Log in / Sign up navigate the
*top* window. Deriv returns to the site root (`/?code=…&state=…`); `shell.js` hands that callback to the
tab that started the login, and the template finishes the PKCE exchange itself.
`shell.js` also mirrors the session between the three Next.js templates (localStorage) and the Bot
(sessionStorage, ms timestamps) so you log in once; logging out anywhere logs out everywhere.

## What was changed in the templates (see PATCHES.md)
Nothing functional — only hosting/integration changes. Rebuild with `_sources/build-all.sh` if you change them.

## Not included
- The legacy "API Token" (Personal Access Token) button: the real templates only support OAuth login.
- app-config.json: optional per-template layout file; its 404 in the network tab is expected.
