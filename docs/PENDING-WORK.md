# Pending Work

**Snapshot date:** 2026-09-21
**Baseline:** Phases 1–6 merged to `main` in both repos (frontend PR #8, backend PR #5 were the last). Roadmap sprints 1–22 have merged code. Sprints 23 (production readiness) and 24 (acceptance and release) have **not started**.

This document replaces `docs/CLAUDE-HANDOFF.md`, which describes Phase 3 and is out of date. It lists everything still open, in the order we intend to work through it. Update the checkboxes as items complete.

## Current focus: get the app running

Decision (2026-09-21): work only on what gets the app running for a real demo and deployment. Everything else is **deferred**. Remote branches are never deleted so Victor can trace the work; local merged branches are deleted after merge.

**Status as of 2026-09-22: A2, A1, A3 and B7 are done and merged into `main` in both repos** (5 PRs: FE #9, #10; BE #6, #7, #8 — all merged by the user). `main` in both worktrees carries all of it, servers restarted and smoke-tested clean against the merged code.

**Status as of 2026-09-23: A4 rehearsed end to end**, see `docs/A4-DEMO-REHEARSAL.md`. All P0 items are now done, pending one open PR: `church-management-system#12` (fix for a member-name display bug the rehearsal would have caught if it weren't found first — "Unknown member" showed for tasks outside the frontend's capped 100-member fetch). **Merge PR #12 before the real demo.** The rehearsal also found 3 leftover test-data members in the dev database that need deleting before the real demo (see the rehearsal doc's "Known limitations").

**Do now, in this order:** ~~A2~~ → ~~A1~~ → ~~A3~~ → ~~B7~~ → ~~B8~~ → ~~A4~~. **All P0 items done.** Remaining before the actual demo: merge PR #12, delete the 3 leftover test members, reseed demo data on the day.
**Deferred until the app is running:** B1–B6, B9 (CI, RBAC, test baselines, type errors, security review, performance), all of section C, and section D housekeeping. Nothing there blocks a demo.

## How we work through this

- One item = one branch = one pull request. Use the branch name suggested on each item.
- When an item touches both repositories, merge the **backend PR first**, then the frontend PR.
- An item is done only when it meets the Definition of Done in `docs/DELIVERY-ROADMAP.md`, plus its own acceptance criteria below.
- Validate narrowly after each change (focused tests, lint on touched files) and note the result in the PR.
- Effort labels are rough guesses: **S** under half a day, **M** one to two days, **L** three days or more.

## Suggested order

| Step | ID | Item | Priority | Repo | Effort |
|---|---|---|---|---|---|
| 0 | D3 | Sync local worktrees to `main`, remove merged branches | Housekeeping | Both | S |
| 1 | A2 | Fix 15-minute session expiry and logout retry loop | P0 | Frontend | S |
| 2 | A1 | Replace hardcoded dashboard widgets with live data | P0 | Both | M–L |
| 3 | A3 | Demo seed data script | P0 | Backend | S |
| 4 | A4 | Board demo rehearsal checklist | P0 | — | S |
| 5 | B1 | CI for both repositories | P1 | Both | S–M |
| 6 | B3 | Backend test baseline | P1 | Backend | M |
| 7 | B2 | Role-based access on unguarded controllers | P1 | Backend (+ Frontend) | M |
| 8 | B4 | Frontend type errors, then remove `ignoreBuildErrors` | P1 | Frontend | M |
| 9 | B5 | Frontend tests and full lint baseline | P1 | Frontend | M |
| 10 | B6 | Security review | P1 | Both | M |
| 11 | B7 | Migrations must build the schema from an empty database | P1 | Backend | S–M |
| 12 | B8 | Deployment target and environment documentation | P1 | Both | M |
| 13 | B9 | Pagination, validation, and performance review | P1 | Both | M |
| 14 | C1–C5 | Product quality and PRD gaps | P2 | Both | varies |
| 15 | D1, D2, D4 | Documentation and project-board hygiene | Housekeeping | — | S |

Housekeeping items D1, D2 and D4 can be done at any time.

---

## A. Before the board presentation (P0)

### A1. Replace hardcoded dashboard widgets with live data

**Repo:** Both · **Branch:** `feat/dashboard-live-widgets` (backend first if new fields are needed) · **Effort:** M–L
**Status:** ✅ **Done 2026-09-21. Backend PR `nestapi-cms#6` and frontend PR `church-management-system#10` are open; merge #6 first.** Frontend (branch `feat/dashboard-live-widgets`) rewrote the four widgets, removed `recent-activity`, and added loading/error/empty states; verified in the browser against the seeded data, every number matched. Not exercised visually: the loading, error and empty states. No unit tests for `buildAlerts` (no FE test runner yet, see B5). Original backend notes: Backend PR `vmisiko/nestapi-cms#6` (branch `feat/dashboard-widget-data`) is open: `GET /api/dashboard/stats` now also returns `members.byAgeGroup/byGender/online/international`, `messaging.sentDeliveries/pendingDeliveries/failedDeliveries/recent`, `fellowships.zones`, and `attention` (lowStock, pendingDamage, fellowshipsWithoutLeader, departmentsBelowTarget). 11/11 tests pass, and every section was compared with independent SQL on the seeded database (all matched). **Frontend to do** (branch `feat/dashboard-live-widgets`, created from `main`): rewrite `member-demographics`, `message-stats`, `live-alerts`, `fellowship-zones` to read `useDashboardState`; delete `recent-activity` (decision: the live follow-up attempts widget already covers it); add loading, error and empty states; extend `domain/entities/dashboard/DashboardStats.ts`. Notes for that work: age-group keys are `under_18, 18_25, 26_35, 36_50, above_50, unknown`; gender keys `male, female, unspecified`; zone `meetingDays` are full day names (Friday), the widget shows 3-letter codes; the invented per-zone "target" bar has no data source and should be dropped; the response stays one call, so the widgets should share the existing `DashboardPloc.fetchStats`.

**Problem.** The landing page (`app/page.tsx`) still shows five widgets built from literals in `components/dashboard/`. The numbers contradict the database. The dev database has 4 members while the demographics widget shows 2,341 active. The roadmap promised "real alerts" in Phase 3.

Already live: `kpi-cards.tsx`, `follow-up-activity.tsx`, `attendance-sessions.tsx`.

`GET /api/dashboard/stats` currently returns members (total, active, inactive, by status, by type), fellowship and department totals, last attendance session, messaging counts, inventory counts (low stock, pending damage reports), and follow-up stats. It does **not** return age groups, zones, a recent-message list, or alerts.

| Widget | Today | Data available now | Work needed |
|---|---|---|---|
| `member-demographics.tsx` | Fixed counts (2,341 / 421 / 184) and fixed age groups | Status split from `members.active`, `members.inactive`, `members.byStatus.guest` | Backend: add an age-group aggregate (the `members.age_group` column exists). Frontend: wire both |
| `message-stats.tsx` | Fixed recent messages ("Sun, 08 Jun" etc.); donut reads a local `stats` object (confirm during the work) | `messaging.sent`, `delivered`, `totalDeliveries`, `drafts` | Pending and failed counts, and a recent-messages list, from stats or from the existing messaging endpoints |
| `live-alerts.tsx` | Fixed list of 7 alerts | Low stock, pending damage reports, overdue follow-ups | Backend: alert sources for "no fellowship leader", "below membership target", "item request awaiting approval", or drop those alert types |
| `recent-activity.tsx` | Fixed list of 7 events | None | Decide: build a small activity feed in the backend, reuse the live follow-up attempts list, or remove the widget |
| `fellowship-zones.tsx` | Five invented zones | A `fellowship-zones` controller exists in the backend | Confirm what it returns, then wire it |

**Acceptance criteria**
- [ ] No widget on the dashboard renders hardcoded people, counts, dates, or zone names.
- [ ] Each widget has loading, error, and empty states.
- [ ] Every number on the page matches a direct database query for the same data (spot-check at least five).
- [ ] Backend additions have unit tests; frontend follows the existing Ploc/Zustand pattern.
- [ ] Any widget deliberately removed is listed in the PR description.

### A2. Fix 15-minute session expiry and the logout retry loop

**Repo:** Frontend · **Branch:** `fix/auth-refresh-credentials` · **Effort:** S
**Status:** ✅ **Done 2026-09-21, PR #9 open awaiting merge** (`vmisiko/church-management-system#9`, 1 file, `core/utility/CustomAxios.ts`). Verified in the browser: with an invalid access token the app made one `POST /auth/refresh` (200), retried its 5 failed requests and stayed on the page; with no refresh cookie it ended at `/login` after 18 requests instead of ~900. The literal 20-minute wait was not run; the refresh mechanism that 15-minute expiry depends on was exercised directly. Also found: the app persists the token in two places (`cms-access-token` and the zustand `cms-auth` store), so clearing only one does not simulate expiry.

**Problem.** Sessions end after about 15 minutes (the access token lifetime). The refresh cookie is never sent from the frontend to the API because `config.withCredentials = true` is commented out at `core/utility/CustomAxios.ts:167`. The backend CORS config already sets `credentials: true`. With refresh failing, `/auth/logout` also returns 401 and the app retries it repeatedly, which we measured at about 900 requests.

**Acceptance criteria**
- [ ] `withCredentials` is enabled and a session stays signed in past the access-token lifetime through a silent refresh.
- [ ] When refresh genuinely fails, the app clears local state and goes to `/login` **once**, with no retry storm (a failed logout call must not trigger another refresh or logout).
- [ ] Verified in the browser over at least 20 minutes, and by watching network requests for a bounded request count.
- [ ] Confirm the refresh cookie works across `localhost:3000` and the API port; note any `SameSite` findings.

### A3. Demo seed data script

**Repo:** Backend · **Branch:** `chore/demo-seed-data` · **Effort:** S
**Status:** ✅ **Done 2026-09-21, PR `vmisiko/nestapi-cms#7` open.** `npm run seed:demo` (add `-- --reset` to rebuild). 180 members, 14 fellowships in 5 zones, 8 departments, 14 attendance sessions (~1,630 records), 30 follow-ups with attempts, 6 sent and 2 draft messages (391 deliveries), 15 inventory items, 6 damage reports. Verified: second run refuses, `--reset` rebuilds identical counts, pre-existing rows untouched. It is already loaded in the local dev database. Dates are relative to the day it runs, so re-run with `--reset` before a demo to keep "last 30 days" data fresh.

**Problem.** The dev database has 4 members, so retention charts, at-risk queues, and dashboards are empty or trivial.

**Acceptance criteria**
- [ ] A script (npm script, documented) creates realistic data: about 150–300 members across guest, member, and leader; ages and types; fellowships with leaders; departments; 8–12 weeks of attendance sessions and records; follow-up tasks in every state including overdue and escalated; messages with deliveries; inventory with low-stock and damage reports.
- [ ] Join dates are spread over at least 6 months so the retention trend and 30/60/90-day figures are meaningful.
- [ ] Idempotent or clearly resettable, and refuses to run when `NODE_ENV=production`.
- [ ] Uses obviously fictional names and contact details.

### A4. Board demo rehearsal checklist

**Repo:** — · **Branch:** `docs/a4-rehearsal-checklist` · **Effort:** S
**Status:** ✅ **Done 2026-09-23.** Full write-up in `docs/A4-DEMO-REHEARSAL.md`. Rehearsed on this laptop: sign in → dashboard (live data confirmed) → create follow-up → record contact attempt (verified persisted via API) → retention page → CSV/PDF export (CSV numbers matched the on-screen KPI cards exactly). Found and fixed one real bug along the way (member-name display, PR #12) and found 2 pre-existing gaps not worth blocking the demo on: no attempt-history view for non-escalated tasks, and 3 leftover test-data members that need a manual delete before the real demo.

**Acceptance criteria**
- [x] A written click path: sign in, dashboard, create a follow-up, record a contact attempt, retention page, exports.
- [x] Rehearsed end to end at least once, on the machine or server that will be used.
- [x] Known limitations are listed so nothing surprises the presenter (see `docs/A4-DEMO-REHEARSAL.md`).

---

## B. Production readiness (Roadmap Sprint 23) — P1

### B1. CI for both repositories

**Repo:** Both · **Branch:** `chore/ci-checks` · **Effort:** S–M
**Evidence:** neither repository has a `.github/` directory.

**Acceptance criteria**
- [ ] Frontend: lint and `next build` on every pull request.
- [ ] Backend: lint, build, and unit tests on every pull request.
- [ ] Status checks are required before merge on `main`.
- [ ] Known baseline failures (see B3, B4) are listed in the workflow or README, not hidden.

### B2. Role-based access on unguarded controllers

**Repo:** Backend (+ Frontend where UI must adapt) · **Branch:** `feat/rbac-remaining-controllers` · **Effort:** M
**Evidence:** these controllers use `JwtAuthGuard` but no `RolesGuard`: `dashboard`, `follow-ups`, `retention`, `notifications`, `inventory/stock-movements`. Most other controllers already use `@Roles`.

**Acceptance criteria**
- [ ] A written decision on which roles may view and change follow-ups, view retention and dashboard data, and read stock movements. Retention was deliberately left open to all authenticated staff, so record whether that stands.
- [ ] Guards and `@Roles` applied accordingly, with tests for allowed and denied roles.
- [ ] Frontend hides or disables actions the current role cannot perform.

### B3. Backend test baseline

**Repo:** Backend · **Branch:** `test/backend-baseline` · **Effort:** M
**Evidence:** last measured (before Phase 5–6) at 10 failing suites of 42, mainly stale inventory and messaging fixtures and missing member-repository mocks. **Not re-measured since**; there are now 52 spec files. Unfinished inventory fixture work sits in the local `church-cms-backend` worktree on branch `test/inventory-fixtures` (3 uncommitted spec files; the branch itself is behind `main` by 17 commits).

**Acceptance criteria**
- [ ] Run the full suite on current `main` and record the real pass and fail counts here.
- [ ] Rebase or salvage the `test/inventory-fixtures` work, then fix the remaining failing suites.
- [ ] `npm test` passes in CI (B1).

### B4. Frontend type errors, then remove `ignoreBuildErrors`

**Repo:** Frontend · **Branch:** `chore/frontend-types` · **Effort:** M
**Evidence:** `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `next build` does not check types. `tsc --noEmit` reports 79 errors, 69 of them in `data/api/**`. The dominant one is `Property 'data' does not exist` from `const { data } = await this.axios.get<T>(...)`, a pattern used by every repository that works at runtime. It points to a typing mismatch in `CustomAxios` or `BaseRepository`, so a single central fix should clear most of them.

**Acceptance criteria**
- [ ] `tsc --noEmit` reports zero errors.
- [ ] `ignoreBuildErrors` removed and `next build` still passes.
- [ ] Type check runs in CI (B1).

### B5. Frontend tests and full lint baseline

**Repo:** Frontend · **Branch:** `test/frontend-baseline` · **Effort:** M
**Evidence:** only 3 test files exist (in `core/utility/__tests__/`) and `package.json` has no `test` script. Playwright is a dependency but has no configured tests. Phase 6 added none. Full `pnpm lint` was not re-run in this cycle (only touched files were linted).

**Acceptance criteria**
- [ ] A `test` script and a unit-test runner configured.
- [ ] Tests for the retention and follow-up Ploc and use cases, and for the export functions in `app/retention/page.tsx` (move them into testable modules if needed).
- [ ] One Playwright smoke test for sign-in and the retention page.
- [ ] `pnpm lint` full-repo result recorded, then fixed to zero errors.

### B6. Security review

**Repo:** Both · **Branch:** `chore/security-review` · **Effort:** M

Known facts to start from:
- Helmet, compression, cookie parsing, global validation pipe (whitelist and forbid unknown fields) are in place.
- **No rate limiting anywhere** in the backend source (no throttler found).
- Refresh cookie is `httpOnly` and `sameSite: strict`, with `secure` only when `NODE_ENV === 'production'`.
- CORS allows a single origin from `FRONTEND_URL`.
- The development admin credentials are in `DEVELOPMENT.md` and `.env.example` variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

**Acceptance criteria**
- [ ] Rate limiting on auth endpoints at minimum.
- [ ] Confirm the default admin cannot exist with a known password in production (forced change or required env value).
- [ ] JWT secrets and SMS credentials come only from the environment; nothing secret in the repository or git history (scan).
- [ ] Production cookie flags and CORS origin verified over HTTPS.
- [ ] Dependency audit for both repositories, with findings triaged.
- [ ] Findings and decisions written up in `docs/`.

### B7. Migrations must build the schema from an empty database

**Repo:** Backend · **Branch:** `fix/migrations-from-scratch` · **Effort:** S–M
**Status:** ✅ **Done 2026-09-22, PR `vmisiko/nestapi-cms#8` open.** `app.module.ts` sets TypeORM `synchronize: NODE_ENV !== 'production'`, so the local database was always built by auto-sync; `data-source.ts` uses migrations with `synchronize: false` but nobody had proven that path worked. Testing on a throwaway empty Postgres found it didn't: `UpdateDamageReports1780963400000` failed outright (dropping an enum type still referenced by the column's typed default — fixed by dropping the default first), and three tables had un-migrated drift only ever applied locally by synchronize — `inventory_categories` (missing `leader_id`), `inventory_items` (still had the old `quantity`/`unit`/`location`/`description` shape instead of `code`/`total_qty`/`available_qty`/`condition`), and `member_departments` (still had a surrogate `id`/`role`/`joined_at` instead of the plain composite-key join table the entity's `@JoinTable` produces). Added migration `FixInventorySchemaDrift1781222400000`. Verified: 13 migrations run clean on an empty database with **zero column-level diff** against the real dev schema; seeded admin + demo data into it; started the app with `NODE_ENV=production` (forcing `synchronize: false`) against it; login + 11 endpoints across every touched table returned 200. Found but not fixed (out of scope, tracked under B3): `src/inventory/application/__tests__` has pre-existing compile errors unrelated to this change.

**Acceptance criteria**
- [ ] On a brand-new empty Postgres, `npm run migration:run` creates every table and enum the app needs, and the app starts with `NODE_ENV=production`.
- [ ] Every migration is safe to re-run after a partial failure.
- [ ] Re-running migrations on an existing database is a safe no-op.
- [ ] The procedure is documented and tested in CI if practical.

### B8. Deployment target and environment documentation

**Repo:** Both · **Branch:** `docs/deployment` (FE), `docs/local-demo-env` (BE) · **Effort:** M, scoped down to S once the demo target was decided
**Status:** ✅ **Done for the demo, 2026-09-22.** User decided: the demo runs on this laptop — no hosting platform, no staging. Delivered `docs/LOCAL-DEMO-RUNBOOK.md` (cold-start sequence, full env var reference table for both apps, known local quirks, mid-demo recovery steps), a frontend `.env.example` (it never had one), and fixed the backend `.env.example`'s stale `DATABASE_URL` port (5432→55432) and `PORT` (3001→3005). Also committed `docs/PENDING-WORK.md` itself for the first time (it had only ever existed on local disk) and removed the two untracked, stale, never-committed handoff docs it superseded (`DEVELOPMENT.md`, `docs/CLAUDE-HANDOFF.md`). PRs: FE `church-management-system#11`, BE `nestapi-cms#9`.
**Evidence (original, now historical):** neither repository had a Dockerfile, compose file, or hosting configuration (no `vercel.json`, Render, Fly, or Railway files). The frontend depends on `@vercel/analytics`, which hints that Vercel may have been intended — still true, still undecided, but no longer blocking, since it's not needed for a laptop demo.

**Acceptance criteria**
- [x] A decision on where the frontend, backend, and database will run. — **this laptop**, for the demo.
- [x] Complete environment variable reference for both apps — in `docs/LOCAL-DEMO-RUNBOOK.md` and both `.env.example` files.
- [ ] Health check endpoint, log and backup approach, and a rollback note. — **deferred**, not needed for a laptop demo; revisit for a real deployment.
- [ ] A dry-run deployment to a staging environment. — **N/A for a laptop demo**; revisit if/when a real hosting target is chosen.

### B9. Pagination, validation, and performance review

**Repo:** Both · **Branch:** `chore/scale-review` · **Effort:** M

**Acceptance criteria**
- [ ] List endpoints reviewed for pagination, especially members, follow-ups, attendance records, and messages (the retention at-risk endpoint is already paginated).
- [ ] Load test against the seed data (A3) scaled up to several thousand members; slow queries found and indexed.
- [ ] The retention statistics query set (several queries per request, six-month trend) measured and, if needed, cached.
- [ ] Input validation reviewed for date-range and filter parameters.

---

## C. Product quality and PRD gaps — P2

### C1. Retention trend chart: show gaps, not zeros
**Repo:** Frontend (backend may return `null`) · **Branch:** `fix/retention-trend-gaps` · **Effort:** S
Months with no eligible cohort (for example the current month) are plotted as 0%, which reads as everyone leaving. **Accept when** months with `eligible = 0` render as gaps or a labelled "no cohort yet" state.

### C2. True guest-conversion metric
**Repo:** Backend · **Branch:** `feat/member-status-history` · **Effort:** M
The current metric is an approximation because members have no status-change history (the code documents this). **Accept when** status changes are recorded with timestamps and the metric measures actual guest-to-member transitions in a period.

### C3. Department and fellowship report filters
**Repo:** Both · **Branch:** `test/retention-group-filters` · **Effort:** S
Never exercised because the dev data has no department or fellowship membership. **Accept when** seed data (A3) covers them and the breakdowns in the on-screen report and in CSV and PDF exports are verified against the database.

### C4. Decide how the at-risk queue and trend interact with report filters
**Repo:** Frontend · **Branch:** `fix/retention-filter-semantics` · **Effort:** S
Observed: applying a date range changes the KPI cards and exports but not the at-risk list or the trend chart. **Accept when** the intended behaviour is decided, and either implemented or labelled on screen.

### C5. Gaps from the April 2026 PRD
**Repo:** Both · **Effort:** L each, plan separately

- [ ] **Welfare and care** strategic objective: nothing built.
- [ ] **"Invited by" tracking** on members.
- [ ] Engagement score or last-seen on members, and **spiritual milestone** tracking.
- [ ] **Overseer assignment** for fellowship zones (zones are name-only today).

Each needs its own issue with acceptance criteria before work begins.

---

## D. Documentation and project hygiene

### D1. Refresh the documentation
**Branch:** `docs/refresh-guides` · **Effort:** S
- `DEVELOPMENT.md` and `docs/CLAUDE-HANDOFF.md` are untracked and stale (they say backend port 3002 and "Phase 3").
- `docs/DELIVERY-ROADMAP.md` has outdated "Phase 2 Status" and "Phase 3 Starting Point" sections and a stray trailing space after `Backlog`.

**Accept when** the guides describe the real local setup (database on port 55432; backend `.env` must set `FRONTEND_URL` to the frontend origin, or the browser blocks all API responses; frontend `.env.local` must set `NEXT_PUBLIC_API_URL`), the roadmap shows true phase status, and the old handoff file is removed.

### D2. GitHub Project and issues
**Effort:** S
Neither repository has any issues, and the "Church Management system" project shows only 3 completed PR items, so nothing from Phases 3–6 is tracked. **Accept when** each item in this document becomes an issue (backend and frontend sub-issues where both are touched), added to the project with Priority, Repository, Phase, and Sprint fields, and later PRs use `Closes #n`.

### D3. Sync local worktrees and clean branches
**Effort:** S · **Status:** local part **done 2026-09-21**; remote cleanup and the decisions below are open.

Done:
- [x] `church-cms-frontend` and `church-cms-backend-follow-up` switched to `main` and fast-forwarded (`1bd4def` and `3746a7a`, the PR merge commits). Content verified identical to the old phase-6 branches, so running servers were unaffected.
- [x] Deleted every fully merged local branch in both repos (7 frontend, 5 backend). The one force delete (`feat/phase-3-dashboard-integration`) was checked first: its extra commit `d075340` is already in `main`.

Still open:
- [ ] ~~Delete the merged remote branches on GitHub~~ **Decided: do NOT delete.** Victor has not reviewed the work and wants to trace it through the branches. Merged remote branches (all verified fully merged into `main`), kept for that reason. Frontend: `feat/123-visitor-follow-up-ui`, `feat/phase-3-dashboard-integration`, `feat/phase-4-attendance-dashboard-widgets`, `feat/phase-5-automation-escalation`, `feat/phase-6-retention-reporting`, `fix/dashboard-error-state-and-duplicate-fetch`, `fix/frontend-people-table-lint`, `fix/inventory-unused-category-handler`. Backend: `feat/123-visitor-follow-up-api`, `feat/789-dashboard-followup-stats`, `feat/phase-4-attendance-summary`, `feat/phase-5-automation-model`, `feat/phase-6-retention-reporting`. All verified as fully merged into `main`.
- [ ] Backend remote branch `fix/damage-reports-migration-drop-default` (1 commit, 2026-08-05) is **not merged**. Review it: merge it, fold it into B7 (migrations from scratch), or discard it. Do not delete it blindly.
- [ ] `church-cms-backend-follow-up` is where the backend is actually run from despite its name. Decide whether to keep that layout or consolidate into `church-cms-backend`.
- [ ] `church-cms-frontend-follow-up` (branch `feat/123-visitor-follow-up-ui`) is clean and fully merged but 20 commits behind `main`. Remove the worktree, or reuse it, and then delete that branch.
- [ ] `church-cms-backend` (branch `test/inventory-fixtures`) is 17 commits behind `main` and has **3 uncommitted inventory spec files**. Keep and finish under B3, or discard explicitly. Not touched.

### D4. Roadmap edits
**Effort:** S
Fold the sprint outcomes from Phases 3–6 into `docs/DELIVERY-ROADMAP.md`, including the parts that were only partly delivered (dashboard alerts, A1).

---

## Open questions

1. **Where will the board demo run**, on a laptop or on a deployed server? This decides how much of B8 is needed first.
2. **Who should see what?** Which roles may view follow-ups and retention reports (B2)?
3. **What is the board date**, so we can cut scope on B6 to B9 sensibly?
4. **Dashboard activity feed (A1):** build it, reuse follow-up attempts, or remove the widget?

## What has been verified and what has not

**Verified in this cycle (2026-09-21):** phase 6 merged in both repos; the retention page, its trend chart, at-risk table, follow-up prefill link, and date-filtered and unfiltered CSV and PDF exports work in a browser against the local stack; `next build` passes; the code-level findings above (hardcoded widgets, missing guards, no CI, `withCredentials`, `tsc` error counts).

**Not verified:** current backend test results, full-repo frontend lint, department and fellowship filters, live SMS delivery, and the people, inventory, and messaging modules in the browser this cycle.

**Verified in this cycle (2026-09-23, A4 rehearsal):** full cold start from nothing (Docker → backend → frontend); sign-in; live dashboard data; creating a follow-up task; recording a contact attempt (confirmed persisted via direct API check); retention KPIs, trend chart, and at-risk table; CSV export values matched the on-screen KPI cards exactly; PDF export. See `docs/A4-DEMO-REHEARSAL.md` for the full write-up and known limitations.
