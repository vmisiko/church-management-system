# City Mega Church CMS Delivery Roadmap

**Product:** City Mega Church Management System  
**Frontend:** https://github.com/vmisiko/church-management-system  
**Backend:** https://github.com/vmisiko/nestapi-cms  
**Planning model:** Agile delivery using GitHub Projects and pull requests

## Product Goal

Build a retention and accountability engine that ensures every person reached by the church is tracked, followed up, nurtured, and integrated into church life.

## Delivery Principles

- Stabilize the development baseline before adding major product features.
- Deliver vertical slices across backend and frontend.
- Prefer measurable workflows over additional static screens.
- Keep frontend and backend work linked to the same issue or epic.
- Require review and validation before moving work to Done.

## Phase and Sprint Plan

| Phase       | Sprint    | Focus                        | Main Deliverables                                                                    | Repository         | Dependency          |
| ----------- | --------- | ---------------------------- | ------------------------------------------------------------------------------------ | ------------------ | ------------------- |
| **Phase 1** | Sprint 1  | Baseline stabilization       | Frontend lint, backend test baseline, environment verification, CI checks            | Frontend + Backend | None                |
| **Phase 1** | Sprint 2  | Quality cleanup              | Resolve existing lint errors, repair stale test mocks, document setup and workflow   | Frontend + Backend | Sprint 1            |
| **Phase 2** | Sprint 3  | Follow-up foundation         | Follow-up task entity, owner, due date, status, notes, database migration            | Backend            | Phase 1             |
| **Phase 2** | Sprint 4  | Follow-up UI                 | Follow-up queue, task creation, filtering, overdue count, completion flow            | Frontend           | Sprint 3            |
| **Phase 2** | Sprint 5  | Contact accountability       | Contact-attempt dialog, contact method, outcome, notes, timestamp, attempt history   | Frontend + Backend | Sprint 4            |
| **Phase 2** | Sprint 6  | Phase 2 closure              | Migration verification, API end-to-end testing, PR reviews, merge both repositories  | Frontend + Backend | Sprints 3–5         |
| **Phase 3** | Sprint 7  | Dashboard data contract      | Define `GET /api/dashboard/stats`, response DTOs, aggregation service, backend tests | Backend            | Phase 2 merged      |
| **Phase 3** | Sprint 8  | Real dashboard KPIs          | Replace hardcoded member, visitor, follow-up, fellowship, and inventory values       | Frontend           | Sprint 7            |
| **Phase 3** | Sprint 9  | Follow-up dashboard insights | Open tasks, overdue tasks, completion rate, unassigned tasks, recent attempts        | Frontend + Backend | Sprint 8            |
| **Phase 3** | Sprint 10 | Dashboard validation         | Loading/error states, permission checks, API integration tests, visual verification  | Frontend + Backend | Sprint 9            |
| **Phase 4** | Sprint 11 | Attendance API integration   | Replace static attendance arrays with sessions and records from the backend          | Frontend           | Phase 3             |
| **Phase 4** | Sprint 12 | Attendance analytics         | Weekly/monthly trends, guest/member comparison, growth and decline calculations      | Frontend + Backend | Sprint 11           |
| **Phase 4** | Sprint 13 | Attendance workflows         | Record attendance form, edit records, date filtering, event filtering                | Frontend           | Sprint 12           |
| **Phase 4** | Sprint 14 | Attendance reporting         | Export attendance reports and connect attendance metrics to dashboard                | Frontend + Backend | Sprint 13           |
| **Phase 5** | Sprint 15 | Follow-up automation model   | Campaign triggers, trigger conditions, scheduled actions, automation status          | Backend            | Phases 2–3          |
| **Phase 5** | Sprint 16 | Visitor automation           | Automatically create follow-up tasks for new visitors                                | Backend            | Sprint 15           |
| **Phase 5** | Sprint 17 | Inactivity automation        | Detect inactive members and create care/check-in tasks                               | Backend            | Sprint 15           |
| **Phase 5** | Sprint 18 | Escalation workflows         | Overdue escalation, supervisor notification, reassignment, escalation history        | Frontend + Backend | Sprints 16–17       |
| **Phase 5** | Sprint 19 | Messaging automation         | Scheduled SMS/email follow-ups using existing messaging infrastructure               | Frontend + Backend | Sprint 18           |
| **Phase 6** | Sprint 20 | Retention metrics            | 30/60/90-day retention, guest conversion, follow-up completion rate                  | Backend            | Phases 2–5          |
| **Phase 6** | Sprint 21 | Retention reporting UI       | Retention dashboard, trend charts, at-risk member queues                             | Frontend           | Sprint 20           |
| **Phase 6** | Sprint 22 | Leadership reporting         | Exportable PDF/CSV reports, date ranges, department/fellowship breakdowns            | Frontend + Backend | Sprint 21           |
| **Phase 6** | Sprint 23 | Production readiness         | Security review, permissions, pagination, validation, performance, deployment checks | Frontend + Backend | All previous phases |
| **Phase 6** | Sprint 24 | Final acceptance             | User acceptance testing, bug fixing, documentation, release preparation              | Frontend + Backend | Sprint 23           |

## Phase Summary

| Phase       | Name                               | Outcome                                                         |
| ----------- | ---------------------------------- | --------------------------------------------------------------- |
| **Phase 1** | Baseline Stabilization             | Reliable development and testing foundation                     |
| **Phase 2** | Retention MVP                      | Staff can assign, track, and complete follow-up work            |
| **Phase 3** | Dashboard Integration              | Leadership sees real operational and follow-up metrics          |
| **Phase 4** | Attendance Analytics               | Attendance data becomes real, searchable, and measurable        |
| **Phase 5** | Automation and Escalation          | Follow-ups are generated and escalated automatically            |
| **Phase 6** | Retention Reporting and Production | The system proves retention impact and becomes production-ready |

## GitHub Project Configuration

### Recommended Statuses

```text
Backlog
Ready
In Progress
In Review
Changes Requested
Blocked
Done
```

### Recommended Fields

```text
Priority: P0, P1, P2, P3
Repository: Frontend, Backend, Both
Phase: 1, 2, 3, 4, 5, 6
Sprint: Sprint 1 - Sprint 24
Type: Feature, Bug, Documentation, Testing, Chore
Blocked By
Assignee
```

### Recommended Views

- **Board:** daily sprint execution
- **Roadmap:** phase order and dependencies
- **Table:** complete backlog with filters
- **Blocked:** work waiting on another issue, PR, or repository

## Cross-Repository Workflow

For work affecting both repositories:

1. Create one parent issue describing the product outcome.
2. Create a backend sub-issue for API and database work.
3. Create a frontend sub-issue for UI and integration work.
4. Add all issues to the same GitHub Project.
5. Use the same issue number in both branches.
6. Implement and merge the backend contract first when the frontend depends on it.
7. Link both pull requests to the parent issue.

Example branch names:

```text
Backend:  feat/123-visitor-follow-up-api
Frontend: feat/123-visitor-follow-up-ui
```

## Branch Workflow

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feat/123-short-description
```

Before committing:

```bash
git status --short --branch
git diff
git diff --check
```

After validation:

```bash
git add <changed-files>
git commit -m "feat(scope): concise description"
git push -u origin <branch-name>
```

## Pull Request Requirements

Every pull request should include:

- Summary of the change
- Product or technical reason
- Files or modules affected
- Related issue or epic
- Backend dependency, if applicable
- Screenshots for UI changes
- Validation commands and results
- Known limitations
- Migration or environment instructions

Use issue-closing references such as:

```text
Closes #123
```

## Definition of Done

A sprint item is complete when:

- Acceptance criteria are written in the GitHub Issue.
- The implementation exists in the correct repository.
- Backend and frontend contracts agree.
- Loading and error states are handled.
- Focused tests pass.
- Lint and build checks pass, or known baseline failures are documented.
- Database migrations are tested where applicable.
- A pull request is opened and reviewed.
- The pull request is merged.
- The GitHub Project item is moved to `Done`.

## Phase 2 Status

Phase 2 implementation includes:

- Follow-up task API
- Follow-up task database migration
- Ownership and due dates
- Open, completed, and cancelled statuses
- Contact-attempt recording
- Frontend follow-up queue
- Task creation and completion
- Overdue task count
- Contact-attempt dialog
- Sidebar navigation

Phase 2 is complete for the frontend. The frontend pull request has been merged into `main`.

The backend pull request and end-to-end contract verification remain required before Phase 2 is considered complete across both repositories.

## Phase 3 Starting Point

Phase 3 is now active for the frontend. Create Phase 3 branches from updated `origin/main`.

The first Phase 3 slice should be:

```text
feat/123-dashboard-follow-up-metrics
```

It should expose and display real values for:

- Open follow-up tasks
- Overdue follow-up tasks
- Completed follow-up tasks
- Follow-up completion rate
- Unassigned follow-up tasks
- Recent contact attempts

The dashboard must consume backend data rather than hardcoded presentation values.
