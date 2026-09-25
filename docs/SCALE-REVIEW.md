# Pagination, validation, and performance review (B9, 2026-09-25)

Scope: both repositories. Covers the four acceptance criteria in `docs/PENDING-WORK.md` B9.

## Method

Load-testing against the real local dev database was ruled out — B6 already hit a near-incident running a seed script against it (see `docs/SECURITY-REVIEW.md` §2), and that database isn't fully migration-tracked (B7). Instead: a disposable `postgres:16` Docker container, migrated from empty with the backend's real migrations (confirms B7 still holds — all 14 migrations, including this pass's new one, run clean on an empty database), then filled with a dedicated `seeds/load-test-seed.ts` script (`npm run seed:load-test -- --count=5000`) generating 5,000 members plus proportional attendance (~65k records across 14 sessions), follow-up tasks (~1,440), and one message campaign delivered to all 5,000 recipients. The compiled backend was run against it directly (`NODE_ENV=production node dist/src/main.js`, so `synchronize` stays off as it does in a real deployment) and timed with `curl`, cross-checked with `EXPLAIN ANALYZE` in `psql`. The container was discarded afterward.

## 1. List endpoints reviewed for pagination

| Endpoint | Scales with | Before | Decision |
|---|---|---|---|
| `GET /members` | congregation size | already paginated (`page`/`limit`, `IsInt`/`Min`/`Max` validated) | no change |
| `GET /retention/at-risk-members` | congregation size | already paginated | no change (see §2 for its query cost) |
| `GET /messaging/:id/deliveries` | campaign audience size (one row per recipient) | unpaginated — 307ms for 5,000 rows in one response | **paginated** (see below) |
| `GET /follow-ups` | guests + inactive members needing outreach | unpaginated — 219ms for 1,438 rows at 5,000 members | **left unpaginated** — see reasoning below |
| `GET /attendance/sessions`, `/sessions/summary` | number of services held, not congregation size | unpaginated | left as-is — grows by tens per year, not thousands |
| `GET /messaging` (campaign list) | number of campaigns sent, not congregation size | unpaginated | left as-is, same reasoning |
| `GET /attendance/sessions/:id/records`, `/members/:memberId/records` | one session's or one member's records, not the whole congregation | unpaginated | left as-is — bounded by a single session's headcount or one member's history |
| `GET /inventory/stock-movements` | inventory activity, not congregation size | unpaginated, but had an **unvalidated** `limit` param | validation fixed (see §4), pagination not needed at this scale |

**Messaging deliveries — paginated.** `GET /messaging/:id/deliveries` now takes `page`/`limit` (default 50, max 200, same `IsInt`/`Min`/`Max` validation as every other paginated list in this codebase) and returns `{ deliveries, total, page, limit }` instead of a bare array. This was a clean case: the delivery-stats cards on the frontend already come from the separate `GET /messaging/:id/deliveries/stats` aggregate endpoint, so paginating the row-level list doesn't affect any total shown elsewhere on the page. Frontend: `MessagingRepository`, `GetDeliveriesUseCase`, `MessagingPloc.fetchDeliveries`, and the messaging page's recipient table were all updated — the "Recipients (N of Total)" header now reads the true total, and a "Load more" button appends subsequent pages.

**Follow-ups — left unpaginated, documented instead of fixed.** The frontend's follow-ups page (`app/follow-ups/page.tsx`) computes its three summary cards (Open, Overdue Today, Completed) by filtering the *entire* fetched task list client-side (`tasks.filter(...)`), not from a server-computed count. Paginating the list endpoint without also moving those counts server-side would make the summary cards wrong (reflecting only the current page). Fixing that properly means adding aggregate-count support to the API and deciding how the page's "all tasks" vs. "current page" data should split — a real, scoped change, not something to fold into a review pass. At the measured scale (1,438 follow-ups for 5,000 members — and that count itself is bounded by how many people currently need outreach, not by total congregation size) the endpoint responds in 219ms, which is acceptable; flagging this as the item to revisit if that number climbs materially past this.

## 2. Load test and slow queries found

5,000 members, ~65k attendance records, 1,438 follow-ups, 5,000 deliveries on one campaign.

**The clearest finding:** `GET /retention/at-risk-members` — **1.53s → 70–80ms** after indexing. `members` had no index on `activity_status`, `status`, or `joined_at`, and `attendance_records` had no index covering `member_id` alone (only a composite unique index on `(session_id, member_id)`, which a member-only lookup can't use). Both the page query and its paired count query fell back to sequential scans; Postgres's cost estimator judged the resulting plan expensive enough to trigger JIT compilation, which alone accounted for roughly 500ms of the pre-index query time on top of the scan itself.

Fix: migration `1781308800000-AddScaleIndexes` adds
- `members(activity_status)`, `members(status)`, `members(joined_at)`, `members(fellowship_id)`
- `attendance_records(member_id, status)`

Verified: ran clean on an empty database (14/14 migrations) and as an incremental 14th migration on the already-seeded load-test database. Re-measured `/retention/at-risk-members` at 32–88ms post-index (from 1.53s), confirmed live through the HTTP API, not just `EXPLAIN ANALYZE`.

**`members(fellowship_id)`** wasn't implicated in the at-risk query specifically, but the same table is filtered by it in `GET /members?fellowshipId=...` and joined on it in the retention department/fellowship breakdowns — added for the same reason (a foreign key column has no automatic index in Postgres).

**What indexing did *not* fix:** `GET /retention/stats`, ~270ms before, ~175–240ms after. Its cohort-retention query joins `members` to `attendance_records` to `attendance_sessions` and touches the *majority* of both tables (nearly all "present" records, most members past each cohort's age threshold) — at that selectivity a sequential scan plus hash join is genuinely the cheaper plan; no ordinary index changes that. The modest improvement that did land came from parallelizing `getMonthlyTrend()` (see §3) and from the index letting the cheaper filtered subqueries (guest conversion, follow-up completion) resolve faster.

## 3. Retention statistics query set — measured, not cached

`GET /retention/stats` runs 9 query-shaped calls per request: 3 cohort windows (d30/d60/d90) + guest conversion + follow-up completion, all via `Promise.all`, plus a 6-point monthly trend. The trend was previously a `for` loop awaiting each month's cohort query one at a time — the only genuinely serial part of the request. Parallelized it (`Promise.all` over the 6 independent month windows in `retention.service.ts`), which is a real, contained fix independent of any caching decision.

**Decision: no caching, for now.** Measured end-to-end at 5,000 members: 175–320ms per request. That's an acceptable load for a dashboard endpoint a user hits by opening a page, not one called in a tight loop, and even a rough linear projection to 20,000+ members (larger than any single congregation this system is built for) stays under a second. Revisit if a future measurement at real production scale shows otherwise — the natural fix then would be a short TTL (30–60s) in-memory cache keyed on the query filters, since the numbers don't need to be real-time-accurate to the second.

## 4. Input validation reviewed

Date-range and filter query DTOs already followed a consistent, correct pattern across the codebase (`MemberFiltersDto`, `RetentionQueryDto`, `FellowshipFiltersDto`): `@IsOptional`, `@IsDateString`/`@IsEnum`/`@IsUUID` as appropriate, and pagination params validated with `@Type(() => Number) @IsInt() @Min(1) @Max(...)`. No SQL-injection-shaped issues found — every raw-SQL query in the retention and member repositories parameterizes user input via TypeORM's query builder or `$1`/`$2` placeholders; the few string-interpolated SQL fragments found (e.g. `INTERVAL '${windowDays} days'`) only ever interpolate fixed code constants, never request input.

**One real gap found and fixed:** `GET /inventory/stock-movements?limit=` took the query param as a raw string and ran it through `parseInt()` with no bounds checking — `?limit=abc` would silently become `NaN` and reach the ORM's `.take()` uncontrolled, and `?limit=-5` would pass through unvalidated. Replaced with `StockMovementsQueryDto` (`@IsInt() @Min(1) @Max(200)`), matching the validation pattern used everywhere else — now a malformed value returns a clean 400 instead of undefined behavior.

## Verification

- Backend: `nest build` clean, full `jest` suite 54/54 suites / 580/580 tests (updated for the new paginated deliveries response shape, one new test added), `npx tsc --noEmit` clean, `eslint` clean.
- Frontend: `tsc --noEmit` clean, `pnpm lint` clean, `vitest run` 6/6 suites / 34/34 tests, `pnpm build` production build passes.
- All 14 migrations (13 pre-existing + `AddScaleIndexes`) verified to run clean on an empty database, matching B7's from-scratch guarantee.
