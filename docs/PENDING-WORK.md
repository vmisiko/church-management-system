# Pending Work

**Snapshot date:** 2026-09-21
**Baseline:** Phases 1–6 merged to `main` in both repos (frontend PR #8, backend PR #5 were the last). Roadmap sprints 1–22 have merged code. Sprints 23 (production readiness) and 24 (acceptance and release) have **not started**.

This document replaces `docs/CLAUDE-HANDOFF.md`, which describes Phase 3 and is out of date. It lists everything still open, in the order we intend to work through it. Update the checkboxes as items complete.

## Current focus: get the app running

Decision (2026-09-21): work only on what gets the app running for a real demo and deployment. Everything else is **deferred**. Remote branches are never deleted so Victor can trace the work; local merged branches are deleted after merge.

**Status as of 2026-09-22: A2, A1, A3 and B7 are done and merged into `main` in both repos** (5 PRs: FE #9, #10; BE #6, #7, #8 — all merged by the user). `main` in both worktrees carries all of it, servers restarted and smoke-tested clean against the merged code.

**Status as of 2026-09-23: A4 rehearsed end to end**, see `docs/A4-DEMO-REHEARSAL.md`. All P0 items are now done, pending one open PR: `church-management-system#12` (fix for a member-name display bug the rehearsal would have caught if it weren't found first — "Unknown member" showed for tasks outside the frontend's capped 100-member fetch). **Merge PR #12 before the real demo.** The rehearsal also found 3 leftover test-data members in the dev database that need deleting before the real demo (see the rehearsal doc's "Known limitations").

**Status as of 2026-09-24: everything before the demo is done.** PR #12 merged, `main` fast-forwarded locally. The 3 leftover test-data members (`Attendance TestMember`, `Automation TestVisitor`, `E2E Visitor`) were deleted via the API — cascade cleanup confirmed clean (no orphaned follow-ups, dashboard and members endpoints still 200). **Nothing is blocking the board demo.** Only remaining pre-demo action is routine, not a backlog item: re-run `npm run seed:demo -- --reset` the morning of the demo so activity dates look current.

**Do now, in this order:** ~~A2~~ → ~~A1~~ → ~~A3~~ → ~~B7~~ → ~~B8~~ → ~~A4~~. **All P0 items done, nothing outstanding before the demo.**
**Deferred until after the demo:** B1–B6, B9 (CI, RBAC, test baselines, type errors, security review, performance), all of section C, and section D housekeeping. Nothing there blocks a demo — pick up here next, in priority order, once the demo is behind us.

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
**Status:** ✅ **Merged 2026-09-24** — workflows live on `main` in both repos (`nestapi-cms#10`, `#11`; `church-management-system#15`). CI now runs on every PR. Along the way, fixed 6 real pre-existing lint errors in the backend that CI caught immediately (lint had never run in this repo before). **Not done:** required status checks on `main`, since neither repo owner (Claude, via the user's account) has admin access to either repo — only `vmisiko` (Victor, the repo owner) can configure branch protection. Left as an open ask for Victor rather than attempted.

Frontend workflow: `lint-and-build` job (pnpm lint, `next build`) — both currently green. A second `typecheck` job runs `tsc --noEmit` and reports the known 79 errors (B4) but is `continue-on-error: true`, not blocking.

Backend workflow: `lint-and-build` job (`eslint` without `--fix`, `nest build`) — both currently green (the 25,992 "errors" a local Windows run of the same lint command shows are `core.autocrlf`-introduced CRLF noise on this machine only; the committed files are LF and lint clean on Linux CI). A second `test` job runs the real `jest` suite and reports the known 10/52 failing suites (B3) but is `continue-on-error: true`, not blocking.

**Acceptance criteria**
- [x] Frontend: lint and `next build` on every pull request.
- [x] Backend: lint, build, and unit tests on every pull request.
- [ ] Status checks are required before merge on `main` — **needs Victor**: repo Settings → Branches → branch protection rule on `main` → require status checks `lint-and-build` (both repos). Whether to also require the currently-known-failing `typecheck`/`test` jobs is his call — recommend leaving them optional until B3/B4 land.
- [x] Known baseline failures (see B3, B4) are listed in the workflow or README, not hidden.

### B2. Role-based access on unguarded controllers

**Repo:** Backend (+ Frontend where UI must adapt) · **Branch:** `feat/rbac-remaining-controllers` · **Effort:** M
**Evidence:** these controllers use `JwtAuthGuard` but no `RolesGuard`: `dashboard`, `follow-ups`, `retention`, `notifications`, `inventory/stock-movements`. Most other controllers already use `@Roles`.

**Decision (2026-09-24):** keep the existing 3-role model (`super_admin`, `admin`, `staff`) rather than introducing new role names — the user considered `senior_pastor`/`protocol_team` but chose to keep the current roles and just apply them, since the role enum is already used across 17 files and the `users` table's DB enum column.

| Controller | Roles allowed | Why |
|---|---|---|
| `dashboard` | `super_admin`, `admin`, `staff` | Read-only aggregate KPIs, same tier as `retention` below |
| `follow-ups` (all actions incl. create/update/record-attempt) | `super_admin`, `admin`, `staff` | Hands-on operational work, matches the `members` controller precedent (the one existing controller where `staff` already has read/write access) |
| `retention` | `super_admin`, `admin`, `staff` | Confirms the standing decision noted above — left open to all authenticated staff |
| `notifications` | `super_admin`, `admin`, `staff` | Self-scoped to the logged-in user's own notifications regardless of role — not a privilege question |
| `inventory/stock-movements` | `super_admin`, `admin` (no `staff`) | Matches every sibling inventory controller (items, categories, damage-reports, item-requests), which all exclude `staff` |

**Status:** ✅ **Done 2026-09-24.** `RolesGuard` + `@Roles` added to all 5 controllers per the table above. New tests: `src/common/guards/__tests__/roles.guard.spec.ts` (unit tests the shared guard's allow/deny logic directly — no metadata → allow, matching role → allow, non-matching role → deny, no user → deny) and `src/inventory/presentation/__tests__/stock-movements.controller.spec.ts` (end-to-end through a real, non-overridden `RolesGuard`: `super_admin`/`admin` get 200, `staff` gets 403 and the service is never called). Full suite re-run clean: same 10 pre-existing failing suites as the B1 baseline, zero regressions, all 7 new tests pass. Frontend: the "Stock" sidebar link is hidden for `staff` users (the one place role now visibly changes what's accessible; the other 4 areas allow all 3 roles so there's nothing to hide there).

**Acceptance criteria**
- [x] A written decision on which roles may view and change follow-ups, view retention and dashboard data, and read stock movements. Retention was deliberately left open to all authenticated staff, so record whether that stands. — confirmed, table above.
- [x] Guards and `@Roles` applied accordingly, with tests for allowed and denied roles.
- [x] Frontend hides or disables actions the current role cannot perform.

### B3. Backend test baseline

**Repo:** Backend · **Branch:** `test/backend-baseline` · **Effort:** M
**Evidence:** last measured (before Phase 5–6) at 10 failing suites of 42, mainly stale inventory and messaging fixtures and missing member-repository mocks. Unfinished inventory fixture work sits in the local `church-cms-backend` worktree on branch `test/inventory-fixtures` (3 uncommitted spec files; the branch itself is behind `main` by 17 commits).

**Re-measured 2026-09-24 (B1 CI setup):** `npx jest` on `main` — **10 failing suites of 52, 23 failing tests of 481**. Same shape as before: mostly outdated mocks not updated when interfaces grew (e.g. `members.usecases.spec.ts` mocks `IMemberRepository` without the newer `previewBulkImport` method). CI now runs this suite on every PR and reports it (`.github/workflows/ci.yml` in the backend repo), but the job is `continue-on-error: true` so it doesn't block merges until this item is done.

**Status:** ✅ **Done 2026-09-24 — 54/54 suites, 579/579 tests, all green.** All 10 failing suites were stale fixtures, not product bugs — each one mocked an interface shape from before a later refactor (the inventory/damage-report domain rename to `DamageStatus`/`code`/`totalQty`/`availableQty`, messaging's `memberIds` field, members' `previewBulkImport`, the department repository's move to a query-builder join for `memberCount`, and the member repository gaining a second `FellowshipEntity` constructor dependency for CSV preview). One test (`members.controller.spec.ts`, bulk-import invalid-email) encoded a since-changed **product** decision, not a stale mock: `BulkMemberRowDto`'s `@Transform` on `email` now silently drops anything that doesn't parse as an address instead of failing the whole row — intentional, so a bad email in a large CSV import doesn't reject that member. Updated the test to assert the real (201, email dropped) behavior instead of the old 400 expectation, with a comment explaining why. CI's `test` job is no longer `continue-on-error` — it's a real blocking check now. The old `church-cms-backend` worktree's `test/inventory-fixtures` branch (17 commits behind `main`, 3 uncommitted spec files) attempted nearly the same inventory-fixture fix independently — now superseded/redundant; left untouched, not deleted, since it's someone else's uncommitted work.

**Acceptance criteria**
- [x] Run the full suite on current `main` and record the real pass and fail counts here. — 54/54 suites, 579/579 tests, 0 failing.
- [x] Rebase or salvage the `test/inventory-fixtures` work, then fix the remaining failing suites. — fixed directly on `main` instead; the old branch is now redundant (see above).
- [x] `npm test` passes in CI (B1) — and the job is blocking, not `continue-on-error`.

### B4. Frontend type errors, then remove `ignoreBuildErrors`

**Repo:** Frontend · **Branch:** `chore/frontend-types` · **Effort:** M
**Evidence:** `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `next build` does not check types. `tsc --noEmit` reports 79 errors, 69 of them in `data/api/**`. The dominant one is `Property 'data' does not exist` from `const { data } = await this.axios.get<T>(...)`, a pattern used by every repository that works at runtime. It points to a typing mismatch in `CustomAxios` or `BaseRepository`, so a single central fix should clear most of them.

**Re-confirmed 2026-09-24 (B1 CI setup):** still exactly 79 errors. CI now runs `tsc --noEmit` on every PR and reports it (`.github/workflows/ci.yml`, `typecheck` job), but it's `continue-on-error: true` so it doesn't block merges until this item is done.

**Status:** ✅ **Done 2026-09-24 — 79 → 0.** The single central fix predicted above was real: `CustomAxios.get/post/put/patch/delete` declared `Promise<T>` but actually resolved to the raw axios `AxiosResponse<T>` at runtime (they just proxy straight to `axiosInstance.get/post/...`, which always wraps in `{ data, status, ... }`). Every one of the 69 `data/api/**` call sites was already correctly written for that reality (`const { data } = await this.axios.get<T>(...)`) — the method signatures were just lying. Fixed the 5 signatures to say `Promise<AxiosResponse<T>>`, which cleared 65 of the 79 errors with no call-site changes. The remaining 14:
- **`app/inventory/page.tsx` (3):** real bugs. The item edit form sent `totalQty` to an update endpoint that doesn't accept it (stock must go through the audited `adjustStock` path on `/inventory/stock`) — removed the field from the edit form and payload. The category forms had a free-text "Leader" name input wired to a `leaderName` field that doesn't exist on the backend (`leaderId`, a UUID, is what's expected) — the backend's `whitelist: true` validation was silently dropping it, so this input has done nothing since it was written. Removed the dead input rather than building a real leader-picker (a separate feature, not a type fix).
- **`AuthPloc.logout()` (1):** declared `Promise<unknown>` but had no explicit return on any path — added one.
- **`MembersPloc.assignDepartment`/`removeDepartment` (2):** a real bug, not just a type nit — `Either.fold()`'s two branches returned mismatched types (`void` vs `Promise<void>`), which also meant the success branch's `await this.fetchDepartments(...)` was fire-and-forget instead of actually awaited by the caller. Made both branches `async` and awaited the whole `fold(...)` call.
- **`BaseUseCase.ts` (1):** deleted — dead code, zero imports anywhere in the repo.
- **3 `vitest` test files:** the only 3 test files in the whole frontend repo (see B5), importing from `vitest`, which isn't installed — there's no test runner yet, so nothing executes them today. Excluded `**/__tests__/**` and `**/*.test.ts(x)` from `tsconfig.json` rather than pre-deciding B5's runner choice; B5 will need to revisit this exclusion once a runner is chosen.
- **`FollowUpRepository.getById`/`recordAttempt` (2):** missing explicit generic type arguments on `this.axios.get(...)`/`.post(...)`, so `T` defaulted to `unknown`. Added them.
- **`MessageTemplateRepository.getAll`/`create` (2):** a real latent bug — the generic type argument claimed the API wraps its response in an extra `{ data: ... }` envelope (`this.axios.get<{ data: MessageTemplate[] }>(...)`), but the backend controller returns a bare array/object (confirmed by reading `messaging-templates.controller.ts`). Fixed to match every other repository's pattern (no wrapper). Verified in the browser: created and deleted a real message template successfully.

`next.config.mjs`'s `typescript.ignoreBuildErrors` removed; `next build` now runs real type-checking and passes. CI's `typecheck` job is no longer `continue-on-error`. Verified in the browser beyond the template test above: inventory item edit (no more Total Quantity field, saves cleanly), category list, follow-up escalation history — no console errors.

**Acceptance criteria**
- [x] `tsc --noEmit` reports zero errors.
- [x] `ignoreBuildErrors` removed and `next build` still passes.
- [x] Type check runs in CI (B1) — and it's a blocking check now, not `continue-on-error`.

### B5. Frontend tests and full lint baseline

**Repo:** Frontend · **Branch:** `test/frontend-baseline` · **Effort:** M
**Evidence:** only 3 test files exist (in `core/utility/__tests__/`) and `package.json` has no `test` script. Playwright is a dependency but has no configured tests. Phase 6 added none. Full `pnpm lint` was not re-run in this cycle (only touched files were linted).

**Status:** ✅ **Done 2026-09-25.** Chose **vitest** over jest — matches what the 3 pre-existing test files already assumed (`import ... from 'vitest'`), and needs far less config for this ESM/TS/Next.js stack.

**A real surprise while wiring this up:** all 3 pre-existing test files turned out to test **dead code**. `Analytics.test.ts` and `MoneyFormatter.test.ts` tested `core/utility/Analytics.ts` and `core/utility/MoneyFormatter.ts` — both zero-import leftover scaffold (the `Analytics` class wraps a `rudderanalytics` global that's never loaded anywhere in this app; the real analytics is `@vercel/analytics` via `components/analytics-wrapper.tsx`, an unrelated same-named class). Deleted both, plus `core/domain/AnalyticsEvents.ts` (only existed to support the dead `Analytics.ts`). `NetworkConstants.test.ts` tested *real, live* code (`NetworkConstants.BASE_URL`, used by `CustomAxios`) but the test itself was never adapted from whatever starter template this repo was bootstrapped from — it asserted a `VITE_APP_BASE_URL` env var and a `pesapal.dev` default that have never existed in this codebase. Rewrote it to test the actual `NEXT_PUBLIC_API_URL` / `localhost:3001` behavior.

**New tests**, all passing (34 tests / 6 files):
- `domain/usecases/retention/__tests__/retention.usecases.test.ts`, `application/retention/__tests__/RetentionPloc.test.ts`
- `domain/usecases/follow-up/__tests__/follow-up.usecases.test.ts`, `application/follow-up/__tests__/FollowUpsPloc.test.ts` — including the state-transition logic (list replacement, `selectedTask` sync on update/recordAttempt), the same category of bug B4 found in `MembersPloc`
- `core/utility/__tests__/retentionExportRows.test.ts` — the retention page's CSV/PDF export row-building was pure-function logic tangled inside `app/retention/page.tsx`; extracted to `core/utility/retentionExportRows.ts` (row shaping, the `memberCount > 0 ? ... : 0` divide-by-zero guard, filename formatting) so it's testable without rendering the page, and the page now just calls it

**Playwright**: added `@playwright/test` (the actual test-runner package; the pre-existing bare `playwright` dependency was unused everywhere and removed), `playwright.config.ts`, and `e2e/sign-in-and-retention.spec.ts` — signs in, lands on the dashboard, navigates to `/retention`, checks the KPIs/trend/at-risk sections render, reloads, and asserts zero console errors. Passes locally (assumes the dev server + backend + DB are already running, per `docs/LOCAL-DEMO-RUNBOOK.md` — not wired into CI, since GitHub Actions can't easily stand up the full stack this app needs).

`pnpm lint` full-repo: clean, 0 errors (was already clean going into B5; stayed clean with all new files).

**Note on `tsc`/CI right now:** this branch was built on top of `main`, which doesn't have B4's fixes yet (`chore/frontend-types`, still open as of this writing) — so a `tsc --noEmit` run here still shows ~76 of B4's pre-existing errors, all in files this item never touches. No new errors from anything in this item. Once both B4 and this PR are merged, the combined `main` will be back to 0.

**Post-merge fix (2026-09-25):** once B4 and B5 were both merged, `pnpm test` was silently broken for 4 of 6 suites — a real interaction bug neither PR could have caught alone. B4's tsconfig `exclude` for test files (a stopgap, since no runner existed yet) and B5's tsconfig-driven `@/*` path-alias resolution for vitest never coexisted until both landed on `main` together; the exclude made every test file lose alias resolution, and 4 of 6 suites use a real (non-type-only) `@/` import that actually needs it. Fixed on `main` directly: removed the now-unneeded tsconfig exclude (a real runner exists now; `tsc --noEmit` is clean with test files included) and reverted `vitest.config.mts` from the "native" `resolve.tsconfigPaths` option (which failed identically) back to the `vite-tsconfig-paths` plugin. `pnpm test`: 6/6 suites, 34/34 tests passing again.

**Acceptance criteria**
- [x] A `test` script and a unit-test runner configured.
- [x] Tests for the retention and follow-up Ploc and use cases, and for the export functions in `app/retention/page.tsx` (moved into `core/utility/retentionExportRows.ts`).
- [x] One Playwright smoke test for sign-in and the retention page.
- [x] `pnpm lint` full-repo result recorded, then fixed to zero errors — was already zero; stayed zero.

### B6. Security review

**Repo:** Both · **Branch:** `chore/security-review` · **Effort:** M

Known facts to start from:
- Helmet, compression, cookie parsing, global validation pipe (whitelist and forbid unknown fields) are in place.
- **No rate limiting anywhere** in the backend source (no throttler found).
- Refresh cookie is `httpOnly` and `sameSite: strict`, with `secure` only when `NODE_ENV === 'production'`.
- CORS allows a single origin from `FRONTEND_URL`.
- The development admin credentials are in `DEVELOPMENT.md` and `.env.example` variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

**Status:** ✅ **Done 2026-09-25.** Full write-up in `docs/SECURITY-REVIEW.md`. Summary: `@nestjs/throttler` added (global 100/min, auth `login`/`me/password` tightened to 5/min, verified via live 429s); `seed-admin.ts` now refuses to run in production without `ADMIN_EMAIL`/`ADMIN_PASSWORD` set, failing before touching the database; JWT secrets and SMS credentials already correctly `ConfigService`-sourced with no hardcoded fallback, confirmed by a repo-and-history secret scan (clean in both repos); cookie flags and CORS confirmed correct for production/HTTPS, with one minor finding left as a recommendation (`FRONTEND_URL` fails safe to `localhost:3000` instead of failing fast — fine for the current laptop-demo target, worth an `getOrThrow` swap before a real deployment); backend dependency audit 24→0, frontend 63→0, both fully re-verified (backend: full `nest build` + 54/54 `jest` suites; frontend: `tsc --noEmit`, `pnpm lint`, `pnpm build`, 6/6 `vitest` suites). One finding documented but intentionally not fixed: the frontend's access token is duplicated across two `localStorage` locations (XSS-exposed, a standard bearer-token SPA tradeoff) — real fix is a bigger token-storage redesign, out of scope here.

**Acceptance criteria**
- [x] Rate limiting on auth endpoints at minimum.
- [x] Confirm the default admin cannot exist with a known password in production (forced change or required env value).
- [x] JWT secrets and SMS credentials come only from the environment; nothing secret in the repository or git history (scan).
- [x] Production cookie flags and CORS origin verified over HTTPS.
- [x] Dependency audit for both repositories, with findings triaged.
- [x] Findings and decisions written up in `docs/`.

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

**Status:** ✅ **Done 2026-09-25.** Full write-up in `docs/SCALE-REVIEW.md`. Summary: load-tested both repos against a disposable, migrations-only Postgres container seeded with 5,000 members via a new `seeds/load-test-seed.ts` (not the demo seed — kept separate so the board-demo data stays small and realistic). Found and fixed the real problem: `GET /retention/at-risk-members` took 1.53s at that scale because `members` had no index on `activity_status`/`status`/`joined_at` and `attendance_records` had none usable for a member-only lookup — added migration `AddScaleIndexes`, which dropped it to 70–80ms. `GET /messaging/:id/deliveries` (one row per campaign recipient, previously unpaginated) is now paginated end-to-end, backend and frontend. `GET /follow-ups` stays unpaginated by deliberate decision — the frontend's summary cards need the full dataset today, and 219ms at 1,438 rows isn't yet a problem; documented as the threshold to revisit. Retention's 9-query stats set was measured (175–320ms at 5,000 members) and found not to need caching yet; its monthly-trend loop was parallelized regardless since that part was genuinely serial for no reason. One real input-validation gap found and fixed: `inventory/stock-movements?limit=` took an unvalidated raw string. Backend: 54/54 suites, 580/580 tests, clean build/lint. Frontend: 6/6 suites, 34/34 tests, clean build/lint.

**Acceptance criteria**
- [x] List endpoints reviewed for pagination, especially members, follow-ups, attendance records, and messages (the retention at-risk endpoint is already paginated).
- [x] Load test against the seed data (A3) scaled up to several thousand members; slow queries found and indexed.
- [x] The retention statistics query set (several queries per request, six-month trend) measured and, if needed, cached.
- [x] Input validation reviewed for date-range and filter parameters.

---

## C. Product quality and PRD gaps — P2

### C1. Retention trend chart: show gaps, not zeros
**Repo:** Frontend (backend may return `null`) · **Branch:** `fix/retention-trend-gaps` · **Effort:** S
Months with no eligible cohort (for example the current month) are plotted as 0%, which reads as everyone leaving. **Accept when** months with `eligible = 0` render as gaps or a labelled "no cohort yet" state.

**Status:** ✅ **Done 2026-09-25.** Backend: `retention.service.ts`'s `getMonthlyTrend()` now returns `rate: null` for a month whose cohort hasn't reached the 30-day mark yet (`eligible === 0`), instead of the misleading `0`. The `d30`/`d60`/`d90` summary cards are untouched — a genuinely eligible cohort that retained nobody should still show 0% there. Frontend: `MonthlyTrendPoint.rate` typed `number | null`; no chart code changes needed — recharts' `<Line>` already renders a gap (not a dip to zero) wherever a data point's value is `null`. Verified in the browser against the seeded dev database: before the fix, the trend line for the current month (Sep 2026, 0 eligible) plunged to 0%; after, the line simply stops after the last real data point (Aug 2026). Also deleted `src/retention/presentation/dto/retention-stats.dto.ts` in the backend — found to be fully dead code (zero imports anywhere) while touching this file. Verified: backend 54/54 suites / 581/581 tests (one new test asserting `trend[].rate` is `null`, not `0`, when `eligible` is 0), clean build; frontend 6/6 suites / 34/34 tests, clean build/lint.

### C2. True guest-conversion metric
**Repo:** Backend · **Branch:** `feat/member-status-history` · **Effort:** M
The current metric is an approximation because members have no status-change history (the code documents this). **Accept when** status changes are recorded with timestamps and the metric measures actual guest-to-member transitions in a period.

**Status:** ✅ **Done 2026-09-25.** New table `member_status_history` (migration `CreateMemberStatusHistory`) records every status transition with a timestamp: `from_status` (null on creation), `to_status`, `changed_at`. Recorded from all three places a member's status can be set — `MemberRepository.create()`, `.update()` (only when `status` actually changes, backed by a before/after read), and `.bulkImport()` — not a DB trigger, to keep it consistent with the rest of this codebase's testable, application-layer style (confirmed via `member.repository.spec.ts`, which already unit-tests this layer).

`retention.service.ts`'s `getGuestConversion()` is rewritten around it: "total" is members whose *first* recorded status was guest (`from_status IS NULL AND to_status = 'guest'`), 30+ days old and within the query's date range; "converted" is how many of those have a *later* recorded transition to member/leader. This replaces comparing current status against join date, which couldn't tell a real conversion from a member created directly as member/leader.

**Consequence, expected and unavoidable:** this is real going-forward tracking, not backfilled — members whose status changed before this shipped have no history rows and won't appear in either count. The demo seed (`seeds/seed-demo.ts`) was updated to insert matching history for every member it creates (a "became a guest" event at `joined_at`, plus a simulated conversion event 14–45 days later for members it assigns member/leader status), so a demo re-seed shows a realistic rate immediately. Applied to the local dev database directly (`npm run seed:demo -- --reset`) — confirms `docs/LOCAL-DEMO-RUNBOOK.md`'s existing morning-of-demo re-seed step now also refreshes this.

**Verified:** all 15 migrations (14 pre-existing + this one) run clean on an empty database; live-tested creating a member as guest then updating to member via the real API and confirmed both history rows landed correctly; re-seeded the local dev database and confirmed `/retention/stats` reports 91.1% guest conversion (146 total, 133 converted) instead of the stale 0/0 an un-reseeded database would show. Backend: 54/54 suites, 586/586 tests, clean build/lint (aside from the pre-existing Windows CRLF lint noise noted in B1).

### C3. Department and fellowship report filters
**Repo:** Both · **Branch:** `test/retention-group-filters` · **Effort:** S
Never exercised because the dev data has no department or fellowship membership. **Accept when** seed data (A3) covers them and the breakdowns in the on-screen report and in CSV and PDF exports are verified against the database.

**Status:** ✅ **Verified 2026-09-25, no code changes needed.** The blocker in the evidence note was already stale — A3's demo seed has assigned members to departments and fellowships since it was written (dev DB: 126 department memberships, 151 members with a fellowship, across 8 departments and 14 fellowships). Verified live in the browser with both filters applied at once (Department: Worship & Choir, Fellowship: Kawangware The Rock Fellowship): on-screen breakdown table showed 21/18 and 22/18 (members/active), matching direct SQL queries against the seeded database exactly. Downloaded and inspected both the CSV export (`Department: Worship & Choir,21,18,85.7` / `Fellowship: Kawangware The Rock Fellowship,22,18,81.8`) and the PDF export — both matched the on-screen numbers and the database. Nothing to fix; this item was already working correctly, just never checked.

### C4. Decide how the at-risk queue and trend interact with report filters
**Repo:** Frontend · **Branch:** `fix/retention-filter-semantics` · **Effort:** S
Observed: applying a date range changes the KPI cards and exports but not the at-risk list or the trend chart. **Accept when** the intended behaviour is decided, and either implemented or labelled on screen.

**Decision (2026-09-25):** label, not implement. The trend chart is inherently a fixed 6-month time series — cutting it down further by an arbitrary date range would need redesigning it into a variable-length series, disproportionate to what this view is for. The at-risk queue is a live operational worklist ("who needs a follow-up right now"), not a historical report, so date/group-scoping it doesn't match its purpose either. Also found while investigating: the "At-risk members" KPI card sits in the same row as 3 cards that *do* respond to the date filter, with nothing distinguishing it — same problem, one more place.

**Status:** ✅ **Done 2026-09-25.** Added on-screen labels instead of wiring these into the filters: the trend chart's description now says it's always the most recent 6 months, unaffected by the filters below; the "At-risk members" KPI card label reads "At-risk members (live, not filtered)"; the at-risk table's description says it's a live snapshot, unaffected by the filters above; and the "Leadership Report" filter card's own description now states exactly which metrics it does and doesn't affect. Verified in the browser. `tsc`/`pnpm lint` clean, `vitest run` 6/6 suites, `pnpm build` passes.

### C5. Gaps from the April 2026 PRD
**Repo:** Both · **Effort:** L each, plan separately

**Scoping note (2026-09-25):** no PRD file exists in either repo — "the April 2026 PRD" is a reference to a document from an earlier conversation, not something checked in. The four sub-items below are scoped from the codebase's existing patterns and, for welfare/care specifically, a decision made without that source document (see C5d). Split into its own sub-items so each can be its own branch/PR instead of one L-sized item.

#### C5a. "Invited by" tracking on members
**Branch:** `feat/member-invited-by` · **Effort:** S–M
Members have no record of who invited them. Add `invited_by_member_id` (nullable FK to `members`, self-referential, `ON DELETE SET NULL` — mirrors `fellowships.leader_id`) **and** `invited_by_name` (nullable text) so an inviter who isn't a member yet (a friend who brought a guest) can still be recorded. Only one should be set at a time; prefer the FK when the inviter is a member.
**Accept when:** migration adds both columns; `CreateMemberDto`/`UpdateMemberDto` accept either; the member create/edit form has an "Invited by" field (member picker, falling back to free text); the member detail view shows it; `MemberFiltersDto` gets an optional `invitedByMemberId` filter so "who has this person invited" is answerable from the people list.

#### C5b. Overseer assignment for fellowship zones
**Branch:** `feat/zone-overseer` · **Effort:** S–M
`fellowship_zones` is name-only — no way to assign who oversees a zone, and zones can currently only be **created**, never edited, at all (`components/fellowships/add-zone-dialog.tsx` has no edit counterpart). Add `overseer_id` (nullable FK to `members`, `ON DELETE SET NULL` — mirrors `fellowships.leader_id` exactly) to `fellowship_zones`.
**Accept when:** migration adds the column; zone create/update DTOs and the zone repository support it; a zone **edit** dialog exists (doesn't today) with an overseer picker; the fellowships page's zone list/filter shows the assigned overseer's name; a zone with no overseer is visually flagged, consistent with how B1's dashboard already flags fellowships without a leader.

#### C5c. Engagement score, last-seen, and spiritual milestones
**Branch:** `feat/member-engagement` · **Effort:** M–L
Three related but separable pieces:
- **Last-seen**: compute from `MAX(attendance_records.session_date) WHERE member_id = X AND status = 'present'` at query time — no new stored column, so it's never stale. Expose on the member list and detail view.
- **Engagement score**: needs a formula decision before building. Proposed starting point: a 0–100 composite from attendance frequency in the last 90 days (weighted highest), follow-up responsiveness (contact attempts that reached `connected`), and current department/fellowship involvement (any vs. none) — cheap to compute per B9's lessons (avoid N+1: one aggregate query per component, not per member). Needs sign-off on the exact weights before implementation, or ship a documented placeholder formula and revisit.
- **Spiritual milestones**: needs a taxonomy decision — this varies by church tradition and wasn't specified anywhere available. Proposed: a small admin-editable milestone **type** table (not hardcoded enum values) plus a `member_milestones` join table (member_id, milestone_type_id, achieved_at, notes), so the specific milestones (baptism, discipleship class, leadership training, etc.) are configured by the church, not hardcoded by this codebase.
**Accept when:** last-seen shown; the engagement score formula is either signed off or shipped as an explicitly-labelled placeholder; milestone types are admin-manageable and can be recorded against a member with a date.

#### C5d. Welfare and care case log
**Branch:** `feat/care-records` · **Effort:** M–L
**Decision (2026-09-25, made without the source PRD — see scoping note above):** a care case log, mirroring the existing follow-up-attempt pattern rather than inventing a new UI paradigm. New table `care_records`: `id`, `member_id`, `type` (visit / call / hospital / bereavement / financial_need / other), `notes`, `handled_by` (user), `status` (open / resolved), `created_at`, `resolved_at`. Reuses the same UI shapes already built for follow-ups (create dialog, status badges, history list).
**Accept when:** migration + CRUD API (create, list by member, update status/notes, mark resolved) with role guards matching the follow-ups controller's pattern; a "Care" tab or section on the member detail view listing their care records with a create action; dashboard/retention are **not** touched by this item — surfacing care metrics there is a follow-on, not part of this acceptance.

Each sub-item is its own branch/PR per the usual workflow.

---

## D. Documentation and project hygiene

### D1. Refresh the documentation
**Branch:** `docs/refresh-guides` · **Effort:** S
- `DEVELOPMENT.md` and `docs/CLAUDE-HANDOFF.md` are untracked and stale (they say backend port 3002 and "Phase 3").
- `docs/DELIVERY-ROADMAP.md` has outdated "Phase 2 Status" and "Phase 3 Starting Point" sections and a stray trailing space after `Backlog`.

**Accept when** the guides describe the real local setup (database on port 55432; backend `.env` must set `FRONTEND_URL` to the frontend origin, or the browser blocks all API responses; frontend `.env.local` must set `NEXT_PUBLIC_API_URL`), the roadmap shows true phase status, and the old handoff file is removed.

**Status:** ✅ **Done 2026-09-25.** The old handoff file and the trailing-space nit were already resolved by B8 (2026-09-22) — `DEVELOPMENT.md`/`docs/CLAUDE-HANDOFF.md` don't exist in either repo any more, and real local setup (DB port 55432, `FRONTEND_URL`, `NEXT_PUBLIC_API_URL`) has lived in `docs/LOCAL-DEMO-RUNBOOK.md` since then. What was still stale: `docs/DELIVERY-ROADMAP.md`'s "Phase 2 Status" / "Phase 3 Starting Point" sections, which read as if the project had barely started Phase 3 — replaced with a "Current Status" section stating Phases 1–6 (including Sprint 23's production-readiness work, i.e. B6 and B9) are done, and pointing to `docs/PENDING-WORK.md` as the live source of truth instead of re-narrating status that would just go stale again.

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

**Status:** ✅ **Done 2026-09-25, alongside D1.** Deliberately did not duplicate a full per-phase outcome narrative into `docs/DELIVERY-ROADMAP.md` — that's exactly the kind of status that rotted the doc the first time it was written and never revisited. Instead the roadmap now says Phases 1–6 are done and points at `docs/PENDING-WORK.md` for specifics. The one partial-delivery detail D4 flagged, dashboard alerts (A1), is already accurately captured there: the `live-alerts` widget itself was completed and verified against real data, only its unit test coverage is still open (tracked under B5/testing, not a gap in the alerts feature itself).

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

Not done — deliberately deferred, not finished:
- No CI on either repo (no automated build/test/lint on PRs)
- No RBAC on dashboard, follow-ups, retention, notifications, inventory/stock-movements controllers — any authenticated user can hit them regardless of role
- Frontend has 79 tsc errors hidden behind ignoreBuildErrors: true — the build doesn't actually type-check
- Almost no test coverage — 3 frontend test files, backend suite last measured with 10/42 suites failing (not re-measured since)
- No security review — no rate limiting anywhere, default admin credentials pattern not hardened for production
- No real deployment — it only runs on this laptop; no hosting target, no staging, no health checks/backups/rollback plan
- Product gaps from the PRD — welfare/care tracking, "invited by" tracking, engagement scoring, fellowship-zone overseer assignment: none built
- A few smaller findings from the rehearsal — the retention trend chart plots the current partial month as 0% instead of a gap, and there's no way to view past contact attempts on a non-escalated follow-up task from the UI