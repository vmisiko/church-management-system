# Local Demo Runbook

**Decision (2026-09-22):** the board demo runs on this laptop. No hosting platform, no staging environment, no deployment. This document is Sprint 23 item B8 in `docs/PENDING-WORK.md`, scoped to that decision — a real production deployment (a hosting target, a dry run to staging, a rollback plan) is separate future work, not needed for the demo, and not started.

This is the single source of truth for bringing the stack up on this machine. `DEVELOPMENT.md` and `docs/CLAUDE-HANDOFF.md` predate this and are stale (they cite a different backend port and an old phase) — this file supersedes them for local setup.

## What runs where

| Piece | Where | Port |
|---|---|---|
| Frontend (Next.js) | `G:\church\church-cms-frontend`, worktree on `main` | 3000 |
| Backend (NestJS) | `G:\church\church-cms-backend-follow-up`, worktree on `main` | 3005 |
| Database (Postgres 16) | Docker container `church-cms-db` | 55432 (not the Postgres default 5432) |

`church-cms-backend` (no `-follow-up` suffix) is a different, older worktree — don't run the demo from there, it has no `.env` and is behind `main`.

## Cold start, from nothing

1. **Docker Desktop.** Launch it if it isn't running, and wait for the daemon (`docker ps` returns cleanly). `church-cms-db` is set to `restart: always` and comes up with Docker automatically; no other container should start (see "Other Docker containers on this machine" below).
2. **Backend:**
   ```bash
   cd G:/church/church-cms-backend-follow-up
   npm run start:dev
   ```
   Cold compile takes **around 4 minutes**. Wait for `Nest application successfully started` and `http://localhost:3005/api/docs` returning 200 before assuming it's failed.
3. **Frontend:**
   ```bash
   cd G:/church/church-cms-frontend
   corepack pnpm dev
   ```
   Ready in a few seconds once dependencies are installed.
4. **Sign in** at `http://localhost:3000/login` — `admin@citymega.org` / `Admin@123456`.

## Before the actual demo

Reseed so the data looks current — the demo dataset's "last 30 days" activity is relative to the day it's generated:

```bash
cd G:/church/church-cms-backend-follow-up
npm run seed:demo -- --reset
```

This only touches rows it created (emails at `@demo.example`, `demo-seed` markers, `DEMO-*` item codes); your own real data is untouched. See the script's own comment header for details.

## Environment files

Both apps ship a `.env.example` now (backend already had one; the frontend didn't — added alongside this runbook). Copy and fill in for a new checkout:

**Backend** (`church-cms-backend-follow-up/.env`):

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | `postgresql://postgres:cms_local_dev@localhost:55432/cms_db` locally |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | yes | any non-empty string locally |
| `JWT_EXPIRES_IN` | yes | `.env.example` says `15m`; this machine's `.env` is set to `8h` for less friction during dev/demo work — the 15-minute default is fine once PR #9's refresh fix is what's being demoed, since sessions now silently renew |
| `JWT_REFRESH_EXPIRES_IN` | yes | `7d` |
| `FRONTEND_URL` | yes | **must be `http://localhost:3000` exactly**, or the browser silently blocks every API response (CORS) with no obvious error in the Network tab beyond a failed preflight |
| `PORT` | yes | `3005` on this machine |
| `NODE_ENV` | yes | leave unset or `development` locally — `production` turns off `synchronize` and Swagger, and needs the database built by migrations alone (see B7) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | yes | seed-admin credentials |
| `UWAZII_*` (6 vars) | only for real SMS | the demo seed inserts message/delivery rows directly, no SMS is actually sent, so these can stay as placeholders for the demo |
| `INACTIVITY_DAYS_THRESHOLD`, `ESCALATION_OVERDUE_DAYS` | no | optional, code defaults to 30 and 2 if unset |

**Frontend** (`church-cms-frontend/.env.local`):

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | yes | `http://localhost:3005`. Missing this file is the single most common cause of "nothing loads" — the code default is `:3001`, which is not the backend on this machine. |

## Known local quirks

- **Memory.** `C:\Users\user\.wslconfig` caps WSL at 2 GB so the backend and frontend have room to compile. If Docker/WSL needs more (e.g. to run the `cozaik-*` Kubernetes cluster), that cap has to go up and WSL restarted (`wsl --shutdown`), which will briefly take the database down too.
- **Other Docker containers on this machine.** Several unrelated containers (`cozaik-*`, `e-sre-sandbox-*`) live on this machine and are set to `restart: no` so they stay stopped after a reboot or `wsl --shutdown` — don't `docker start` them before a demo, they'll compete for the same memory.
- **Sessions.** PR #9 (merged) fixed the session-refresh bug, so a signed-in session now silently renews instead of dying after 15 minutes. Sign in once before the demo and it should hold.
- **Backend cold-start time.** ~4 minutes is normal, not a hang. Poll `http://localhost:3005/api/docs` rather than assuming failure.

## If something breaks mid-demo

- **Blank/error dashboard, API calls failing:** check `.env.local` exists on the frontend and `FRONTEND_URL` in the backend `.env` is exactly `http://localhost:3000`. A backend restart is needed after changing `.env` (it's read once at startup).
- **"Nothing needs attention" / everything looks empty:** the demo data may have expired relative to today, or been reset. Re-run `npm run seed:demo -- --reset`.
- **Logged out unexpectedly:** sign in again; not currently expected to recur after PR #9, but if it does, that's worth flagging as a regression, not treating as normal.
- **Whole machine sluggish:** check free RAM; close browser tabs first — they use far more memory on this machine than the dev servers do.

## Explicitly out of scope here

A real deployment (hosting platform, `NODE_ENV=production` against a fresh managed database via the migrations proven in B7, health checks, logging, backups, rollback, a staging dry run) is **not** part of getting the demo running and has not been started. Revisit after the demo, as its own item.
