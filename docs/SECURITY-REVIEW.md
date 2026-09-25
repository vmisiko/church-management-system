# Security review (B6, 2026-09-25)

Scope: both repositories (`nestapi-cms` backend, `church-management-system` frontend). Covers the six acceptance criteria in `docs/PENDING-WORK.md` B6.

## 1. Rate limiting on auth endpoints

Added `@nestjs/throttler`, wired globally via `APP_GUARD` in `src/app.module.ts`:

- **Global default:** 100 requests / 60s per IP, applied to every route. Generous enough not to interfere with normal app usage (dashboard polling, list pagination, etc.) while still capping abuse.
- **`POST /auth/login`:** tightened to 5 / 60s — the primary brute-force target.
- **`PATCH /auth/me/password`:** tightened to 5 / 60s — an attacker holding a stolen access token could otherwise brute-force the current-password check.
- **`POST /auth/refresh`, `POST /auth/logout`:** left at the global default. Both require an already-valid signed JWT (refresh or access token), so they aren't brute-forceable the way a password check is, and tightening `refresh` risked breaking legitimate multi-tab session refresh.

**Verified at runtime:** 7 consecutive bad-credential `POST /auth/login` attempts returned 400 (validation) for attempts 1–5, then 429 (Too Many Requests) for attempts 6–7. Confirmed a single unauthenticated hit to an unrelated endpoint (`GET /api/dashboard/stats`) still correctly returns 401, not 429 — the global limit doesn't interfere with normal single-request testing.

## 2. Default admin credentials in production

`seeds/seed-admin.ts` previously fell back to `admin@citymega.org` / `Admin@123456` (published in `DEVELOPMENT.md` and `docs/LOCAL-DEMO-RUNBOOK.md`) whenever `ADMIN_EMAIL`/`ADMIN_PASSWORD` were unset, with no distinction between local dev and production.

**Fix:** `resolveCredentials()` now branches on `NODE_ENV`. In production, `ADMIN_EMAIL` and `ADMIN_PASSWORD` must both be set or the seed script throws immediately — before touching the database (`AppDataSource.initialize()`/`runMigrations()` run after the check, not before), so a misconfigured production run fails fast with no side effects. Outside production, the known local-dev defaults remain, since they're intentional and documented for the laptop-demo workflow (B8).

**Verified:** logic tested in isolation (a standalone copy of `resolveCredentials()`, not the real script, to avoid touching the shared dev database — see the note below) — confirms it throws when `NODE_ENV=production` and the env vars are unset.

**Near-incident during testing:** an earlier attempt ran the real `seed-admin.ts` with `NODE_ENV=production` directly against the shared local dev Postgres (the same DB `DATABASE_URL` always points at, regardless of `NODE_ENV`). This triggered `AppDataSource.runMigrations()`, which failed partway through (`FixInventorySchemaDrift1781222400000`, `column "quantity" does not exist`) because that database was originally built via TypeORM `synchronize` and isn't fully migration-tracked — a known, previously-documented gap (see B7). No damage resulted (TypeORM wraps each migration in its own transaction — confirmed via `psql`: schema, row counts, and the `migrations` table were unchanged), but it's the reason this criterion was verified against isolated logic rather than the real script.

## 3. Secrets only from the environment

- `JWT_SECRET` / `JWT_REFRESH_SECRET`: already used `ConfigService.getOrThrow()` everywhere they're read (`jwt.strategy.ts`, `jwt-refresh.strategy.ts`, `auth.service.ts`) — fails fast at boot if unset, no hardcoded fallback. No change needed.
- SMS (Uwazii) credentials (`UWAZII_ACCESS_TOKEN` / `UWAZII_USERNAME` / `UWAZII_PASSWORD`): read via `ConfigService.get()` with no default value for any credential field (only non-secret config like `UWAZII_BASE_URL` and `UWAZII_SENDER_ID` have fallback defaults). No change needed.
- **Repository scan:** no `.env` file (only `.env.example`) is tracked in either repo, and neither appears in `.env` form anywhere in git history (`git log --all --diff-filter=A --name-only`). A pattern grep for `secret`/`password`/`api_key`-shaped literals across tracked source in both repos turned up nothing beyond `process.env.*` references and the documented local-dev admin defaults noted in §2.

## 4. Production cookie flags and CORS

- Refresh-token cookie (`auth.controller.ts`): `httpOnly: true`, `sameSite: 'strict'`, `secure: process.env.NODE_ENV === 'production'`. Correct for HTTPS-only transmission in production while still working over plain HTTP in local dev.
- CORS (`main.ts`): single-origin, `origin: process.env.FRONTEND_URL ?? 'http://localhost:3000'`.

**Finding (not fixed):** the `FRONTEND_URL` fallback is fail-*safe*, not fail-*fast* — if unset in a production deployment, CORS silently allows `localhost:3000` instead of the real origin, which isn't itself exploitable (an attacker can't originate requests from `localhost:3000` against a remote server) but is a misconfiguration footgun that would manifest as "the deployed frontend can't reach the API" rather than a loud startup error. Recommend switching to `config.getOrThrow('FRONTEND_URL')` before any real (non-laptop) deployment — left as-is for now since B8 confirmed the current target is a laptop demo, where the fallback is actually the convenience it looks like.

## 5. Dependency audit

**Backend (`npm audit`):** 24 → 0 vulnerabilities. Fixed via `npm audit fix`, removing two unused dev dependencies found along the way (`@swc/cli`, `@swc/core` — confirmed unused: the build uses plain `tsc` via `nest build`, no `"builder": "swc"` in `nest-cli.json`; tests use `ts-jest`, not `@swc/jest`), and upgrading `csv-parse` `^6.2.1` → `^7.0.2` (fixes a prototype-pollution advisory, GHSA-8cw4-87c7-c6xx, relevant here because `member.repository.ts` uses `columns: true` when parsing bulk-import CSVs). Verified API-compatible across the major bump — clean `nest build` and full `jest` suite (54/54 suites, 579/579 tests) both pass unchanged.

**Frontend (`pnpm audit`):** 63 → 0 vulnerabilities. `pnpm audit --fix`'s auto-generated `pnpm-workspace.yaml` overrides (34 overlapping semver-range entries) left one nested resolution stuck below the patched version (`brace-expansion` under `@eslint/eslintrc > minimatch@3.1.5`, 3 high-severity DoS advisories). Replaced with 11 simple, unconditional `package: '>=min-version'` overrides, then `pnpm install --force` — resolved cleanly. Net effect: `next` 16.2.0→16.3.6, `axios` 1.16.1→1.20.0, `postcss` 8.5.6→8.5.28 (dev dependency), plus several transitive bumps (`lodash`, `form-data`, `js-yaml`, `sharp`, `nanoid`, `browserslist`, `baseline-browser-mapping`). Verified: `tsc --noEmit` clean, `pnpm lint` clean, production build (`pnpm build`) passes, full test suite (`vitest run`) 6/6 suites, 34/34 tests passing.

## 6. Findings documented but not fixed in this pass

- **CORS `FRONTEND_URL` fallback** (§4) — recommend `getOrThrow` before a real deployment.
- **Access token duplicated in `localStorage`** on the frontend: once in `core/tokenStorage.ts`, again inside the Zustand-persisted store (`application/auth/useAuthState.ts`). Both copies are readable by any script running on the page (XSS-exposed) — a standard tradeoff for a bearer-token SPA without a backend-for-frontend layer, not something introduced by this review. Flagged as a known architectural limitation; fixing it properly (in-memory-only token storage, or a BFF pattern that keeps the access token server-side) is a larger redesign than this review's scope, and out of proportion for a laptop-demo deployment target (B8).

## What this review did not cover

No penetration testing, no fuzzing, no SAST/DAST tooling run — this was a manual review against the six acceptance criteria in B6, plus `npm audit`/`pnpm audit` for known-CVE dependency scanning. B9 (pagination, validation, and performance review) is the next backlog item and covers input validation at scale, which this review did not attempt.
