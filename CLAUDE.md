# CLAUDE.md — phoenix-command-app

Phoenix Command is the employee PWA for Phoenix Electric: MSAL (Azure AD)
sign-in, time clock, daily log, files, and AI chat. React 18 + Vite 6,
deployed to Azure Static Web Apps, backed by the Phoenix Python runtime
gateway (`:9120`, HTTPS in production).

## Commands

```bash
npm run dev                # local dev server (needs .env — copy .env.example)
npm test                   # node --test (build-gate unit tests)
npm run typecheck          # tsc --noEmit (strict; must stay clean)
npm run build              # production build — fails fast on bad env config
npm run verify:production  # asserts dist/ contents: CSP origin, API paths, PWA assets
```

## Environment

All configuration is env-only — never commit identifiers or URLs as code
fallbacks. Required for builds (see `.env.example`): `VITE_API_BASE`
(public HTTPS gateway URL), `VITE_AZURE_CLIENT_ID`, `VITE_AZURE_TENANT_ID`.
Enforced at build time by `build/runtime-origin.js` and `build/azure-env.js`.

## Structure

- `src/main.tsx` → `src/App.tsx` → `src/screens/*` — canonical TSX tree;
  state and auth live in App.tsx
- `src/auth/msalConfig.js` + `src/hooks/useAuth.ts` — MSAL; API scope
  defaults to `api://<client-id>/.default`
- `src/api/phoenix-api.js` — runtime calls: `/v1/timeclock`, `/v1/dailylog`
  (Bearer token), `/v3/chat` (tokenless browser bridge — no Phoenix token
  in the browser)
- `public/` — PWA: `sw.js` (fault-tolerant precache), `manifest.json`,
  `staticwebapp.config.json` (security headers; CSP `connect-src` gets the
  runtime origin injected at build)
- `archive/` — superseded pre-migration JSX, kept for reference only

## Rules

- Quality over speed; verify before claiming done: `npm test`,
  `npm run typecheck`, and a production build must all pass before commit.
- Merges are Shane's click in the GitHub UI; deploys require Shane's
  explicit authorization. Pushed commits are gated by bot review — after
  any push, review must re-run against the exact new head.
- Do not weaken the build gates (HTTPS-only public runtime, env-only Azure
  config, PWA asset verification) without an explicit decision from Shane.
