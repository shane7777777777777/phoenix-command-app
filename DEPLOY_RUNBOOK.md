# DEPLOY_RUNBOOK.md — Phoenix Command launch

**Status date:** 2026-08-09 · **Working branch:** `feat/launch-hardening-20260809` (PR #9, draft) · **Base:** `main` @ 36e2059

This is the ground-truth handoff for anyone (human or agent) driving the
launch. `main` does NOT contain the hardening stack until Shane merges PR #9.

---

## Decisions (made by Shane, 2026-08-09)

| Decision | Value |
|---|---|
| Production gateway (`VITE_API_BASE`) | `https://ash.phoenixelectric.life` |
| App production hostname | `https://command.phoenixelectric.life` |
| Reviewer/bot-wrangler | Firedancer (FD) — Claude builds/pushes, FD gates, Shane merges/deploys |

Why Ash: all three boxes (ash / echo / firedancer .phoenixelectric.life) run
the identical Phoenix Gateway OS runtime with the full app contract
(`POST /v3/chat`, `/v1/timeclock`, `/v1/dailylog`, `/healthz` — verified via
openapi.json on 2026-08-09), but **only Ash has browser CORS middleware
enabled**. Echo and Firedancer return 405 on preflight — browsers cannot call
them until CORS is enabled box-side.

## Verified state (against head e491687)

- `npm test` 8/8 · `npm run typecheck` clean (strict) · `npm run build` +
  `npm run verify:production` green with the real gateway URL
- Build fails fast (by design) when `VITE_API_BASE` / `VITE_AZURE_CLIENT_ID`
  / `VITE_AZURE_TENANT_ID` are unset — env-only config, no fallbacks in code
- Built CSP `connect-src` is exactly: `'self'`, `https://login.microsoftonline.com`,
  `https://graph.microsoft.com`, `https://ash.phoenixelectric.life`
- PWA icons ship; service-worker precache is per-asset fault-tolerant

## Remaining steps, in order

1. **FD:** re-request bot review on PR #9 head `e491687`; declare merge-ready
   or file findings. (Standing rule: bots must pass the exact current head.)
2. **Shane:** Azure Portal → App registrations → Phoenix Mail Courier →
   Authentication → add `https://command.phoenixelectric.life` as a **SPA
   redirect URI**. (App uses `window.location.origin`; unregistered hostname
   = sign-in fails for every employee.) Can be done anytime.
3. **Ash box (gateway-os side, NOT this repo):** add
   `https://command.phoenixelectric.life` to the runtime CORS allowlist.
   As of 2026-08-09 Ash rejects all app origins (preflight 400) — sign-in
   would work but every API call would fail. This is the only cross-repo
   dependency.
4. **Shane:** merge PR #9 (his UI click, after FD clears it).
5. **Provision Azure Static Web App**, with build env vars:
   `VITE_API_BASE=https://ash.phoenixelectric.life`, plus
   `VITE_AZURE_CLIENT_ID` / `VITE_AZURE_TENANT_ID` = the Phoenix Mail Courier
   registration values (Shane has them; intentionally not written in-repo).
   No CI workflow exists yet — building a GitHub Actions → SWA workflow is an
   open offer / next task.
6. **DNS (only after step 5):** in the SWA resource add custom domain
   `command.phoenixelectric.life`; Azure supplies the exact CNAME target and
   validation record; then create the DNS records. Do not create DNS earlier —
   the CNAME target does not exist until the SWA does.
7. Deploy = Shane's explicit authorization (fresh `~/.phoenix/AUTHORIZED_DEPLOY`).

## Re-verify locally (any machine)

```bash
npm ci && npm test && npm run typecheck
VITE_API_BASE=https://ash.phoenixelectric.life \
VITE_AZURE_CLIENT_ID=<mail-courier-client-guid> \
VITE_AZURE_TENANT_ID=<tenant-guid> \
npm run build && npm run verify:production
```

## Open items beyond this branch

- FD holds local evidence branches for PRs #8 / #7 / #1, unpushed pending
  Shane's "GO push command-app heads".
- GitHub Actions deploy workflow (turns step 5's env into repo secrets).
- Designer art may replace the generated icons in `public/` anytime — no code
  changes needed.
