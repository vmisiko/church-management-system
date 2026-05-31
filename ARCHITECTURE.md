# Clean Architecture — Next.js Church Management System

> Adapted from the Vue/PloC architecture pattern by Victor Misiko.
> Original reference: https://medium.com/@victormisiko.vm/implementing-clean-architecture-in-a-vue-js-application-fd23b33ef488

---

## Why this architecture

Next.js is our **delivery mechanism** — not our architecture. The same principle that drove the Vue version applies here:

> Keep the center of gravity in stable, framework-agnostic code. Let Next.js, Tailwind, shadcn, and every other library remain a replaceable edge.

The church's business rules (what makes a member active, how a fellowship is structured, how filters are applied) should survive a framework migration intact.

---

## The core rule: dependencies point inward

```
Presentation  →  Application  →  Domain
Data                         →  Domain
app/ (pages)  →  Presentation, Application
```

- `domain/` must not import from any other layer, React, or Next.js.
- `data/` may only import from `domain/`.
- `application/` may import from `domain/` and `data/`.
- `presentation/` may only import from `application/` (controller hooks) and `components/ui/`.
- `app/` pages wire everything together — they are the composition root.

---

## Vue → Next.js concept mapping

| Vue / PloC concept | Next.js equivalent in this repo |
|---|---|
| Vue SFC (view) | React component (`.tsx`) |
| `*Ploc.ts` class | `use*Controller.ts` custom hook |
| Pinia store (`useXxxState`) | Zustand store (`use*Store.ts`) |
| `store.$patch(...)` | `useXxxStore.setState(...)` |
| `DependencyLocator` | Direct imports in controller hooks (no container needed) |
| `CustomAxios` | `apiFetch` wrapper in `core/` (future) |
| `Either<DataError, T>` | Same — `core/Either.ts` |
| `DataError` | Same — `core/DataError.ts` |
| `fold(leftFn, rightFn)` | Same |
| `*UseCase.ts` | Same — `domain/*/usecases/` |
| `I*Repository.ts` | Same — TypeScript interface in `domain/*/` |
| `*Repository.ts` | Same — concrete class in `data/` |
| Vue Router (`useRouter`) | `useRouter` from `next/navigation` |
| `useToast()` | `toast` from `sonner` (already installed) |
| `onMounted` data fetch | `useEffect` in controller hook, or Server Component direct call |

---

## Target project structure

```
Next-church-Management-System/
├── app/                          # Next.js App Router — thin page shells only
│   ├── layout.tsx
│   ├── page.tsx                  # Dashboard
│   ├── people/page.tsx
│   ├── fellowships/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── attendance/page.tsx
│   ├── messaging/page.tsx
│   └── inventory/
│       ├── page.tsx
│       ├── categories/page.tsx
│       ├── stock/page.tsx
│       └── damage-reports/page.tsx
│
├── core/                         # Cross-cutting plumbing (already exists)
│   ├── domain/
│   │   ├── Either.ts             # Either<L, R> + fold()  →  import from '@/core/domain/Either'
│   │   ├── DataError.ts          # Typed error union      →  import from '@/core/domain/DataError'
│   │   └── usecases/
│   │       └── BaseUseCase.ts
│   ├── di/
│   │   └── DependencyLocator.ts  # Ploc/controller factory hooks
│   └── utility/
│       ├── CustomAxios.ts        # HTTP client (future use)
│       └── makeServerAxios.ts
│
├── domain/                       # Framework-agnostic — entities, contracts, use-cases
│   ├── member/
│   │   ├── Member.ts                     # Entity interface
│   │   ├── IMemberRepository.ts          # Port / contract
│   │   ├── GetMembersUseCase.ts
│   │   └── FilterMembersUseCase.ts
│   ├── fellowship/
│   │   ├── Fellowship.ts
│   │   ├── IFellowshipRepository.ts
│   │   ├── GetFellowshipsUseCase.ts
│   │   └── GetFellowshipBySlugUseCase.ts
│   ├── people-filters/
│   │   ├── PeopleFilter.ts               # PeopleFilterState type + option constants
│   │   └── FilterRules.ts                # countActiveFilters, hasActiveFilters
│   └── shared/
│       └── FellowshipRules.ts            # fellowshipSlug, meetingTimeToFormValue, etc.
│
├── data/                         # Repository implementations (data sources)
│   ├── mock/
│   │   ├── MemberRepository.ts           # implements IMemberRepository
│   │   └── FellowshipRepository.ts       # implements IFellowshipRepository
│   └── api/                              # (future — swap mock for real HTTP here)
│       ├── MemberRepository.ts
│       └── FellowshipRepository.ts
│
├── application/                  # Zustand stores + controller hooks
│   ├── member/
│   │   ├── useMembersStore.ts            # Zustand store (state shape)
│   │   ├── useMembersController.ts       # orchestration: use-cases, fold, toast
│   │   ├── useMemberFormStore.ts
│   │   └── useMemberFormController.ts    # add/edit member form state
│   └── fellowship/
│       ├── useFellowshipsStore.ts
│       ├── useFellowshipsController.ts   # list + zone/status filter
│       ├── useFellowshipDetailStore.ts
│       └── useFellowshipDetailController.ts  # single fellowship + member search
│
├── presentation/                 # React components — render only, no business logic
│   ├── components/
│   │   ├── dashboard/            # KPI cards, charts, widgets
│   │   ├── people/               # PeopleTable, PeopleFilters, AddMemberDialog
│   │   ├── fellowships/          # FellowshipCard, FellowshipDetailsContent, etc.
│   │   ├── inventory/
│   │   └── shared/               # AppShell, ThemeProvider
│   └── ui/                       # shadcn/ui primitives — never edit manually
│
└── ARCHITECTURE.md
```

---

## Layer responsibilities

### `domain/` — the center

Pure TypeScript. No React, no Next.js, no framework imports.

**Entities** (`Member.ts`, `Fellowship.ts`): the shapes the business cares about.

```ts
// src/domain/member/Member.ts
export interface Member {
  id: string
  name: string
  initials: string
  phone: string
  email: string
  status: "Guest" | "Member" | "Leader"
  fellowship: string
  department?: string
  memberType: "adult" | "child"
  activityStatus: "active" | "inactive"
  joinedAt: string
}
```

**Repository interfaces** (`I*Repository.ts`): contracts that the data layer must fulfil. Use-cases depend on these interfaces, not on concrete implementations.

```ts
// src/domain/member/IMemberRepository.ts
import type { Member } from "./Member"
import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"

export interface IMemberRepository {
  getAll(): Promise<Either<DataError, Member[]>>
  getByFellowship(fellowshipName: string): Promise<Either<DataError, Member[]>>
}
```

**Use-cases** (`*UseCase.ts`): a single focused operation. The constructor accepts a repository interface; `execute()` does the work.

```ts
// src/domain/member/GetMembersUseCase.ts
import type { IMemberRepository } from "./IMemberRepository"
import type { PeopleFilterState } from "@/domain/people-filters/PeopleFilter"

export class GetMembersUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute(filters: PeopleFilterState) {
    return this.repo.getAll()
  }
}
```

**Rules:** no file in `domain/` imports from `data/`, `application/`, `presentation/`, React, or Next.js. If a linter complains, the rule is correct.

---

### `data/` — external interactions

Concrete repository implementations. HTTP calls and mapping live here. Today this is mock data; when the NestJS backend is ready, swap the implementation without touching any other layer.

```ts
// src/data/mock/MemberRepository.ts
import type { IMemberRepository } from "@/domain/member/IMemberRepository"
import type { Member } from "@/domain/member/Member"
import { Either } from "@/core/domain/Either"

const mockMembers: Member[] = [ /* ... */ ]

export class MemberRepository implements IMemberRepository {
  async getAll() {
    return Either.right(mockMembers)
  }

  async getByFellowship(fellowshipName: string) {
    return Either.right(
      mockMembers.filter((m) => m.fellowship === fellowshipName)
    )
  }
}
```

**Rules:**
- Imports only from `domain/` and `core/`.
- When `api/` implementations arrive, they call `apiFetch` (not the component, not the hook).
- Maps API response shapes → domain entity shapes here (`fromJson` helpers live here, not in domain).

---

### `application/` — Zustand stores + controller hooks (the PloC equivalent)

This layer has two parts that mirror the Pinia store + Ploc split from the Vue version:

- **`use*Store.ts`** — Zustand store: defines the state shape and exposes `setState`. This is the reactive state container, equivalent to a Pinia store.
- **`use*Controller.ts`** — controller hook: orchestrates use-cases, calls `fold`, triggers `toast`/router. Equivalent to a `*Ploc` class.

Components read from the store and call handlers from the controller — they never touch use-cases or repositories directly.

**Store** (`use*Store.ts`):

```ts
// src/application/member/useMembersStore.ts
import { create } from "zustand"
import type { Member } from "@/domain/member/Member"
import type { PeopleFilterState } from "@/domain/people-filters/PeopleFilter"
import { defaultPeopleFilters } from "@/domain/people-filters/PeopleFilter"

interface MembersState {
  members: Member[]
  loading: boolean
  error: string | null
  filters: PeopleFilterState
  currentPage: number
}

export const useMembersStore = create<MembersState>()(() => ({
  members: [],
  loading: false,
  error: null,
  filters: defaultPeopleFilters,
  currentPage: 1,
}))
```

**Controller hook** (`use*Controller.ts`):

```ts
// src/application/member/useMembersController.ts
"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import { MemberRepository } from "@/data/mock/MemberRepository"
import { GetMembersUseCase } from "@/domain/member/GetMembersUseCase"
import { useMembersStore } from "./useMembersStore"
import type { PeopleFilterState } from "@/domain/people-filters/PeopleFilter"

const repo = new MemberRepository()
const getMembersUseCase = new GetMembersUseCase(repo)

export function useMembersController() {
  const state = useMembersStore()

  const fetchMembers = useCallback(async (filters: PeopleFilterState) => {
    useMembersStore.setState({ loading: true, error: null })

    const result = await getMembersUseCase.execute(filters)

    result.fold(
      (error) => {
        useMembersStore.setState({ loading: false, error: error.message })
        toast.error(error.message)
      },
      (members) => {
        useMembersStore.setState({ loading: false, members })
      }
    )
  }, [])

  const setFilters = useCallback((filters: PeopleFilterState) => {
    useMembersStore.setState({ filters, currentPage: 1 })
    fetchMembers(filters)
  }, [fetchMembers])

  return { state, setFilters, fetchMembers }
}
```

**Rules:**
- `use*Store.ts` imports only from `domain/`. No use-cases, no repositories, no React hooks.
- `use*Controller.ts` imports from `domain/`, `data/`, `core/`, and its own store. Never from `presentation/` or `app/`.
- `useMembersStore.setState(...)` is called on the store singleton — valid outside React components, which makes async operations in the controller clean.
- All filtering, searching, pagination, and derived state computed here — never in components.
- Side-effects (`toast`, `router.push`) happen here, not in components.

---

### `presentation/` — React components

Thin. Render and delegate.

Components receive state and handlers from a controller hook. They do not:
- import from `data/` or `domain/`
- compute filtered lists or counts
- fire `toast` directly (the controller does that)

```tsx
// src/presentation/components/people/PeopleTable.tsx
"use client"
import { useMembersController } from "@/application/member/useMembersController"

export function PeoplePage() {
  const { state, setFilters } = useMembersController()
  // render state.members — nothing else
}
```

**Rules:**
- Components import from `application/` (controller hooks) and `components/ui/` only.
- UI-only derived values (badge colors, initials, display formatting) are fine in components.
- Anything involving records, counts, or dates must live in a use-case or controller hook.

---

### `app/` — Next.js pages (composition root)

Pages are thin orchestrators. They resolve route params and pass data to presentation components.

Server Components may call `data/` repositories directly for initial server-side data fetching. Client Components delegate to controller hooks.

```tsx
// app/fellowships/[slug]/page.tsx  (Server Component)
import { FellowshipRepository } from "@/data/mock/FellowshipRepository"
import { GetFellowshipBySlugUseCase } from "@/domain/fellowship/GetFellowshipBySlugUseCase"
import { FellowshipDetailsContent } from "@/presentation/components/fellowships/FellowshipDetailsContent"
import { notFound } from "next/navigation"

const repo = new FellowshipRepository()
const getBySlugUseCase = new GetFellowshipBySlugUseCase(repo)

export default async function FellowshipDetailPage({ params }: { params: { slug: string } }) {
  const result = await getBySlugUseCase.execute(params.slug)

  return result.fold(
    () => notFound(),
    (fellowship) => <FellowshipDetailsContent fellowship={fellowship} />
  )
}
```

**Rules:**
- No business logic, no markup beyond layout wrappers.
- Server Components can reach into `data/` for initial load; client interactions go through controller hooks.
- Pages do not contain `useState`, filter logic, or data transformations.

---

## `core/` — cross-cutting plumbing

Both files already exist. Import them exactly as shown below.

### `Either<L, R>` — `@/core/domain/Either`

The standard way to express the two outcomes of any operation. Eliminates ad-hoc `try/catch` across layers.

Key methods:
- `Either.right(value)` — success path
- `Either.left(error)` — failure path
- `.fold(leftFn, rightFn)` — handle both outcomes
- `.map(fn)` — transform the right value
- `.getOrElse(default)` — unwrap with a fallback

```ts
import { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"

// In a repository:
async getAll(): Promise<Either<DataError, Member[]>> {
  try {
    return Either.right(mockMembers)
  } catch (e) {
    return Either.left({ kind: "NetworkError", message: "Failed to load members", timestamp: new Date(), source: "MemberRepository" })
  }
}

// In a controller hook:
const result = await getMembersUseCase.execute(filters)
result.fold(
  (error) => { useMembersStore.setState({ error: error.message, loading: false }); toast.error(error.message) },
  (members) => { useMembersStore.setState({ members, loading: false }) }
)
```

### `DataError` — `@/core/domain/DataError`

A discriminated union of typed error shapes. Pick the narrowest kind that fits:

| Kind | Use when |
|---|---|
| `NetworkError` | HTTP request failed or timed out |
| `ValidationError` | Input failed a domain rule |
| `BusinessRuleError` | Operation violates a business constraint |
| `AuthenticationError` | User is not logged in |
| `AuthorizationError` | User lacks permission |

```ts
import type { DataError } from "@/core/domain/DataError"

// Construct a typed error inline — no class instantiation needed:
const err: DataError = {
  kind: "NetworkError",
  message: "Failed to load members",
  timestamp: new Date(),
  source: "MemberRepository",
}
return Either.left(err)
```

---

## Request lifecycle (golden path)

Using "view members with filters" as the example:

```
app/people/page.tsx
  └─ <PeoplePage /> (presentation, "use client")
       ├─ useMembersStore()          ← reactive state (Zustand)
       └─ useMembersController()     ← handlers (application)
            ├─ FilterMembersUseCase.execute(filters) (domain)
            │    └─ IMemberRepository.getAll() (domain interface)
            │         └─ MemberRepository.getAll() (data/mock)
            │              └─ mockMembers[] → Either.right(filtered)
            └─ fold:
                 error → useMembersStore.setState({ error }) + toast.error(...)
                 success → useMembersStore.setState({ members })
```

### Sequence

1. `PeoplePage` renders and calls `useMembersController()`.
2. Controller hook calls `fetchMembers(defaultFilters)` on mount.
3. Sets `loading: true`, calls `getMembersUseCase.execute(filters)`.
4. Use-case calls `repo.getAll()`.
5. Repository returns `Either.right(members)`.
6. Use-case returns `Either` to the controller.
7. Controller `fold`s: calls `useMembersStore.setState({ members, loading: false })`.
8. Zustand notifies all subscribed components. `PeoplePage` re-renders with the new member list.

For filter changes: user interacts → component calls `setFilters(newFilters)` → controller re-runs `fetchMembers` → state updates → component re-renders.

---

## Adding a feature (checklist)

When you add a new CMS feature (e.g. Departments, Attendance records), touch **one vertical slice**:

### 1. Domain — entity type
```ts
// src/domain/<feature>/<Feature>.ts
export interface Department { id: string; name: string; leader: string; memberCount: number }
```

### 2. Domain — repository interface
```ts
// src/domain/<feature>/I<Feature>Repository.ts
export interface IDepartmentRepository {
  getAll(): Promise<Either<DataError, Department[]>>
  getById(id: string): Promise<Either<DataError, Department>>
}
```

### 3. Domain — use-case(s)
```ts
// src/domain/<feature>/Get<Feature>sUseCase.ts
export class GetDepartmentsUseCase {
  constructor(private repo: IDepartmentRepository) {}
  execute() { return this.repo.getAll() }
}
```

### 4. Data — repository implementation
```ts
// src/data/mock/<Feature>Repository.ts
export class DepartmentRepository implements IDepartmentRepository {
  async getAll() { return Either.right(mockDepartments) }
  async getById(id: string) { /* ... */ }
}
```

### 5. Application — Zustand store + controller hook

```ts
// src/application/<feature>/use<Feature>Store.ts
import { create } from "zustand"
import type { Department } from "@/domain/department/Department"

interface DepartmentsState {
  departments: Department[]
  loading: boolean
  error: string | null
}

export const useDepartmentsStore = create<DepartmentsState>()(() => ({
  departments: [],
  loading: false,
  error: null,
}))
```

```ts
// src/application/<feature>/use<Feature>Controller.ts
import { useCallback } from "react"
import { toast } from "sonner"
import { DepartmentRepository } from "@/data/mock/DepartmentRepository"
import { GetDepartmentsUseCase } from "@/domain/department/GetDepartmentsUseCase"
import { useDepartmentsStore } from "./useDepartmentsStore"

const repo = new DepartmentRepository()
const getDepartmentsUseCase = new GetDepartmentsUseCase(repo)

export function useDepartmentsController() {
  const state = useDepartmentsStore()

  const fetchDepartments = useCallback(async () => {
    useDepartmentsStore.setState({ loading: true, error: null })
    const result = await getDepartmentsUseCase.execute()
    result.fold(
      (err) => { useDepartmentsStore.setState({ loading: false, error: err.message }); toast.error(err.message) },
      (departments) => { useDepartmentsStore.setState({ loading: false, departments }) }
    )
  }, [])

  return { state, fetchDepartments }
}
```

### 6. Presentation — component(s)
```tsx
// src/presentation/components/<feature>/<Feature>Table.tsx
export function DepartmentsTable() {
  const { state } = useDepartmentsController()
  // render state.departments only
}
```

### 7. App — page
```tsx
// app/<feature>/page.tsx
import { DepartmentsTable } from "@/presentation/components/departments/DepartmentsTable"
export default function DepartmentsPage() {
  return <AppShell><DepartmentsTable /></AppShell>
}
```

---

## "Am I doing it right?" checks

A correct change:
- Keeps `.tsx` components **thin** — no filtering, counting, or date logic
- Introduces or modifies a **UseCase** instead of embedding logic in a hook or component
- Touches **one vertical slice** — entity → interface → use-case → repository → controller → component
- Returns errors through `Either<DataError, T>` and handles them in the controller with `fold`

**Boundary violations (you're probably breaking the rules if…):**

| Smell | Rule broken |
|---|---|
| A `.tsx` component imports from `data/mock/` | Presentation must not reach into data |
| A domain file imports `react`, `next/navigation`, or `sonner` | Domain must be framework-agnostic |
| A component calls `mockMembers.filter(...)` directly | Filter logic belongs in a use-case |
| Two controller hooks duplicate the same filter function | Extract to a use-case in `domain/` |
| A page (`app/*.tsx`) contains `useState`/Zustand and business logic | Pages are orchestrators only |
| Business logic or use-case calls are added directly to a Zustand store | Stores hold state only — orchestration belongs in the controller hook |
| `Either` is bypassed with a bare `try/catch` in a repository | Data layer must use `Either` consistently |

---

## Migration path (current state → target)

The current `lib/` files mix all four layers. Priority order for migrating:

| Current file | Target location | What to split out |
|---|---|---|
| `lib/members.ts` | types → `domain/member/Member.ts`; data → `data/mock/MemberRepository.ts` | Separate entity from data source |
| `lib/fellowships.ts` | types → `domain/fellowship/Fellowship.ts`; rules → `domain/shared/FellowshipRules.ts`; data → `data/mock/FellowshipRepository.ts` | Three concerns in one file |
| `lib/people-filters.ts` | types/options → `domain/people-filters/PeopleFilter.ts`; rules → `domain/people-filters/FilterRules.ts` | Already clean, just move |
| `components/people/people-table.tsx` | Extract filter logic → `FilterMembersUseCase.ts`; wire through `useMembersController` | Component owns business logic today |
| `components/fellowships/fellowship-details-content.tsx` | Extract member search → `useFellowshipDetailController` | Component calls `getMembersByFellowship` directly today |

Move one feature at a time. Each migration is independently testable and safe.
