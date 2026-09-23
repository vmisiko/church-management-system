# Board Demo Rehearsal Checklist

Backlog item A4 in `docs/PENDING-WORK.md`. Rehearsed end to end on this laptop on 2026-09-23, following the cold-start procedure in `docs/LOCAL-DEMO-RUNBOOK.md`.

## Pre-demo setup

1. Start Docker Desktop, wait for `docker ps` to respond. The `church-cms-db` container comes up automatically (`restart: always`).
2. `cd church-cms-backend-follow-up && npm run start:dev` — wait for `Nest application successfully started` and `http://localhost:3005/api/docs` returning 200 (usually 1–4 minutes).
3. `cd church-cms-frontend && corepack pnpm dev` — ready in a few seconds.
4. Reseed so activity dates look current: `cd church-cms-backend-follow-up && npm run seed:demo -- --reset`.
5. **Clean up leftover test data first** — see "Known limitations" below before doing this in front of the board.
6. Sign in once at `http://localhost:3000/login` (`admin@citymega.org` / `Admin@123456`) ahead of time so the session is already warm.

## Click path

1. **Sign in** — `/login`, confirm no error, lands on the dashboard.
2. **Dashboard** (`/`) — confirm every widget shows live numbers, not the old hardcoded ones (member count, attendance, first-time visitors, fellowships, inventory alerts, open/overdue follow-ups, follow-up completion %, follow-up activity feed).
3. **Create a follow-up** — Follow-ups → New Follow-up → pick a person, title, due date, notes → Create task. Confirm it appears at the top of the open queue and the "Open tasks" count increments.
4. **Record a contact attempt** — on that new task, Record attempt → fill method/outcome/notes → Save. Confirm the dialog closes cleanly (there's no on-screen confirmation banner or attempt-count badge — see limitations).
5. **Retention page** (`/retention`) — confirm KPI cards (30-day retention, guest conversion, follow-up completion, at-risk count), trend chart, Leadership Report filters, and the at-risk members table all render.
6. **Exports** — Export CSV and Export PDF from the Leadership Report section. Confirm both download and the CSV's numbers match the on-screen KPI cards exactly.

## Result (2026-09-23 run)

All six steps passed. Specifics:
- Dashboard: 167/184 active members, 101 Sunday attendance, 28 first-time visitors, 13 fellowships, 21 open / 12 overdue follow-ups, 48% completion — all live, no hardcoded values.
- Created "A4 rehearsal test task" for a real member; open-task count went 21 → 22.
- Recorded a call/connected attempt; verified via the API that it persisted with the right notes and timestamp.
- Retention KPIs: 32.4% 30-day retention, 90.5% guest conversion, 46.3% follow-up completion, 17 at-risk members.
- CSV export matched the on-screen KPIs exactly (`30-day retention,148,48,32.4` etc.); PDF exported without error.
- No console errors at any step.

## Known limitations (tell the presenter, don't let them be a surprise)

- **Leftover test data in the dev database.** Three members — "Attendance TestMember," "Automation TestVisitor," "E2E Visitor" — are real rows left over from earlier API/E2E verification, not part of the demo seed (the seed script only touches its own `@demo.example`-marked rows, so it doesn't clean these up). They show up in the dashboard and follow-up queue. **Delete these three members before the actual demo** — do this deliberately, not as part of an automated reseed, since it's a real delete against dev data.
- **Retention trend chart dips to 0% for the current partial month** (tracked as C1 in the backlog) — the current month has no eligible cohort yet, and it plots as 0% instead of a gap. If asked, explain this rather than let it read as "everyone just left."
- **No way to see past contact attempts from the follow-up queue UI** unless the task has been escalated (the "History" button only appears when `escalationLevel > 0`). Attempts are recorded and persisted correctly (verified via direct API check) but there's no way to review them for a normal task from the screen. Worth a follow-up backlog item if the board asks to see attempt history live.
- **Demo data dates are relative to the day it's generated.** Re-run `npm run seed:demo -- --reset` the morning of the real demo, or the "last 30 days" activity will look stale.
- **Backend cold start takes 1–4 minutes.** Start it first and poll `/api/docs` rather than assuming a hang.
- **Docker Desktop needs a manual launch** before the database container is reachable — it does not start with Windows on this machine.
