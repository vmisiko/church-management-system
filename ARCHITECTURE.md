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
- `data/` may only import from `domain/` and `core/`.
- `application/` may import from `domain/`, `data/`, and `core/`.
- `presentation/` components import only from `application/` and `components/ui/`.
- `app/` pages wire everything together — they are the composition root.

---

## Vue → Next.js concept mapping

| Vue / PloC concept | Next.js equivalent in this repo |
|---|---|
| Vue SFC (view) | React component (`.tsx`) |
| `*Ploc.ts` class | `*Ploc.ts` class — **same pattern, same name** |
| Pinia store (`useXxxState`) | Zustand store (`use*State.ts`) |
| `store.$patch(...)` | `this.store.setState(...)` (inside the Ploc) |
| `DependencyLocator` | `core/di/DependencyLocator.ts` — same role |
| `Either<DataError, T>` | Same — `@/core/domain/Either` |
| `DataError` | Same — `@/core/domain/DataError` |
| `fold(leftFn, rightFn)` | Same |
| `*UseCase.ts` | Same — `domain/*/usecases/` |
| `I*Repository.ts` | Same — TypeScript interface in `domain/*/` |
| `*Repository.ts` | Same — concrete class in `data/` |
| Vue Router (`useRouter`) | `useRouter` from `next/navigation` |
| `useToast()` | `toast` from `sonner` (already installed) |
| `onMounted` data fetch | Called on the Ploc instance from a `useEffect` or Server Component |

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
├── core/                         # Cross-cutting plumbing
│   ├── application/
│   │   └── ploc.ts               # Abstract Ploc<S> base class
│   ├── domain/
│   │   ├── Either.ts             # Either<L, R> + fold()
│   │   ├── DataError.ts          # Typed error union
│   │   └── usecases/
│   │       └── BaseUseCase.ts
│   └── di/
│       └── DependencyLocator.ts  # Ploc singletons wired with their dependencies
│
├── domain/                       # Framework-agnostic — entities, contracts, use-cases
│   ├── member/
│   │   ├── Member.ts
│   │   ├── IMemberRepository.ts
│   │   ├── GetMembersUseCase.ts
│   │   └── FilterMembersUseCase.ts
│   ├── fellowship/
│   │   ├── Fellowship.ts
│   │   ├── IFellowshipRepository.ts
│   │   ├── GetFellowshipsUseCase.ts
│   │   └── GetFellowshipBySlugUseCase.ts
│   ├── people-filters/
│   │   ├── PeopleFilter.ts
│   │   └── FilterRules.ts
│   └── shared/
│       └── FellowshipRules.ts
│
├── data/                         # Repository implementations
│   ├── mock/
│   │   ├── MemberRepository.ts
│   │   └── FellowshipRepository.ts
│   └── api/                      # (future — swap mock for real HTTP here)
│       ├── MemberRepository.ts
│       └── FellowshipRepository.ts
│
├── application/                  # Zustand state stores + Ploc classes
│   ├── auth/
│   │   ├── useAuthState.ts       # Zustand store (state shape + optional persistence)
│   │   └── AuthPloc.ts           # Ploc class — orchestrates auth use-cases
│   ├── member/
│   │   ├── useMembersState.ts
│   │   └── MembersPloc.ts
│   └── fellowship/
│       ├── useFellowshipsState.ts
│       └── FellowshipsPloc.ts
│
├── presentation/                 # React components — render only, no business logic
│   ├── components/
│   │   ├── dashboard/
│   │   ├── people/
│   │   ├── fellowships/
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

**Entities** (`Member.ts`, etc.): the shapes the business cares about.

```ts
// domain/member/Member.ts
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

**Repository interfaces** (`I*Repository.ts`): contracts the data layer must fulfil. Use-cases depend on these, not on concrete implementations.

```ts
// domain/member/IMemberRepository.ts
import type { Member } from "./Member"
import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"

export interface IMemberRepository {
  getAll(): Promise<Either<DataError, Member[]>>
  getByFellowship(fellowshipName: string): Promise<Either<DataError, Member[]>>
}
```

**Use-cases** (`*UseCase.ts`): one focused operation each.

```ts
// domain/member/GetMembersUseCase.ts
import type { IMemberRepository } from "./IMemberRepository"
import type { PeopleFilterState } from "@/domain/people-filters/PeopleFilter"

export class GetMembersUseCase {
  constructor(private readonly repo: IMemberRepository) {}
  execute(filters: PeopleFilterState) {
    return this.repo.getAll()
  }
}
```

**Rules:** no file in `domain/` imports from `data/`, `application/`, `presentation/`, React, or Next.js.

---

### `data/` — external interactions

Concrete repository implementations. Mock today; swap for `api/` implementations when the NestJS backend is ready — no other layer changes.

```ts
// data/mock/MemberRepository.ts
import type { IMemberRepository } from "@/domain/member/IMemberRepository"
import { Either } from "@/core/domain/Either"

export class MemberRepository implements IMemberRepository {
  async getAll() {
    return Either.right(mockMembers)
  }
  async getByFellowship(fellowshipName: string) {
    return Either.right(mockMembers.filter((m) => m.fellowship === fellowshipName))
  }
}
```

**Rules:** imports only from `domain/` and `core/`. `fromJson` mappers live here, not in `domain/`.

---

### `application/` — state stores + Ploc classes

This is the heart of the pattern. Each feature has two files:

- **`use*State.ts`** — Zustand store that defines the state shape. May use `persist` for localStorage. No logic here — just the state container.
- **`*Ploc.ts`** — class extending `Ploc<StoreApi<State>>`. Receives use-cases in its constructor. Exposes named methods (`fetchMembers`, `login`, `logout`, etc.) that orchestrate use-cases, call `fold`, and update the store. This is the direct Next.js equivalent of a Flutter BLoC or Vue `*Ploc` class.

#### Reference implementation: `application/auth/`

**`useAuthState.ts`** — state only:

```ts
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  loginLoading: boolean
  loginError: string | null
  // ... other loading/error flags
}

const useAuthState = create<AuthState>()(
  persist(
    (): AuthState => ({
      accessToken: null,
      refreshToken: null,
      loginLoading: false,
      loginError: null,
    }),
    {
      name: "cms-auth",
      partialize: (state) => ({ accessToken: state.accessToken, refreshToken: state.refreshToken }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useAuthState
```

**`AuthPloc.ts`** — orchestration class:

```ts
import type { StoreApi } from "zustand"
import { Ploc } from "@/core/application/ploc"
import type { AuthState } from "./useAuthState"
import type { LoginUseCase } from "@/domain/usecases/auth/LoginUseCase"

export type AuthPlocStoreType = StoreApi<AuthState>

export class AuthPloc extends Ploc<AuthPlocStoreType> {
  constructor({
    store,
    loginUseCase,
  }: {
    store: AuthPlocStoreType
    loginUseCase: LoginUseCase
  }) {
    super({ store })
    this.loginUseCase = loginUseCase
  }

  private readonly loginUseCase: LoginUseCase

  async login(params: LoginRequest) {
    this.store.setState({ loginLoading: true, loginError: null })

    const result = await this.loginUseCase.execute(params)

    return result.fold(
      (error) => {
        this.store.setState({ loginLoading: false, loginError: this.handleError(error) })
        return Either.left(this.handleError(error))
      },
      (tokens) => {
        this.store.setState({ loginLoading: false, accessToken: tokens.access_token })
        return Either.right(tokens)
      },
    )
  }
}
```

**`core/di/DependencyLocator.ts`** — wire once, import everywhere:

```ts
import { MemberRepository } from "@/data/mock/MemberRepository"
import { GetMembersUseCase } from "@/domain/member/GetMembersUseCase"
import { MembersPloc } from "@/application/member/MembersPloc"
import useMembersState from "@/application/member/useMembersState"

const memberRepo = new MemberRepository()

export const membersPloc = new MembersPloc({
  store: useMembersState,   // Zustand's create() return is also a StoreApi — pass it directly
  getMembersUseCase: new GetMembersUseCase(memberRepo),
})
```

**In components** — read state from the hook, trigger actions on the Ploc:

```tsx
// presentation/components/people/PeopleTable.tsx
"use client"
import useMembersState from "@/application/member/useMembersState"
import { membersPloc } from "@/core/di/DependencyLocator"

export function PeoplePage() {
  const { members, loading, error } = useMembersState()

  useEffect(() => {
    membersPloc.fetchMembers(defaultFilters)
  }, [])

  // render members — nothing else
}
```

**Rules:**
- `use*State.ts` imports only from `domain/` and `zustand`. No use-cases, no repositories.
- `*Ploc.ts` extends `Ploc<StoreApi<State>>` from `@/core/application/ploc`. Receives use-cases via constructor — never instantiates them internally.
- All state mutations go through `this.store.setState(...)` inside the Ploc.
- Side-effects (`toast`, `router.push`) are triggered inside the Ploc, not in components.
- The Ploc singleton is created once in `DependencyLocator.ts` — never with `new XxxPloc()` inside a component.

---

### `presentation/` — React components

Thin. Render and delegate.

Components:
- read reactive state via `use*State()` hooks
- trigger actions by calling methods on the Ploc singleton
- do not import from `data/` or `domain/` directly
- do not call use-cases
- do not compute filtered lists, counts, or formatted dates (use-case / Ploc responsibility)

```tsx
"use client"
import useFellowshipsState from "@/application/fellowship/useFellowshipsState"
import { fellowshipsPloc } from "@/core/di/DependencyLocator"

export function FellowshipsList() {
  const { fellowships, loading } = useFellowshipsState()

  return loading ? <Spinner /> : fellowships.map((f) => <FellowshipCard key={f.id} fellowship={f} />)
}
```

---

### `app/` — Next.js pages (composition root)

Pages are thin orchestrators: resolve route params and render presentation components. Server Components may reach directly into `data/` for the initial server-side data load.

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
    (fellowship) => <FellowshipDetailsContent fellowship={fellowship} />,
  )
}
```

**Rules:** no `useState`, no filter logic, no data transformations in pages.

---

## `core/` — cross-cutting plumbing

### `Ploc<S>` — `@/core/application/ploc`

Abstract base class all Ploc classes extend. Holds the store reference and provides `handleError`.

```ts
import type { StoreApi } from "zustand"
import type { DataError } from "@/core/domain/DataError"

export abstract class Ploc<S extends StoreApi<object>> {
  protected readonly store: S
  constructor({ store }: { store: S }) { this.store = store }
  protected handleError(error: DataError): string { return error.message }
}
```

### `Either<L, R>` — `@/core/domain/Either`

| Method | Purpose |
|---|---|
| `Either.right(value)` | Success path |
| `Either.left(error)` | Failure path |
| `.fold(leftFn, rightFn)` | Handle both outcomes |
| `.map(fn)` | Transform right value |
| `.getOrElse(default)` | Unwrap with fallback |

### `DataError` — `@/core/domain/DataError`

Discriminated union — pick the narrowest kind:

| Kind | Use when |
|---|---|
| `NetworkError` | HTTP request failed or timed out |
| `ValidationError` | Input failed a domain rule |
| `BusinessRuleError` | Operation violates a business constraint |
| `AuthenticationError` | User is not logged in |
| `AuthorizationError` | User lacks permission |

---

## Request lifecycle (golden path)

"User logs in" end to end:

```
app/login/page.tsx
  └─ <LoginForm /> (presentation, "use client")
       ├─ useAuthState()            ← reactive state (Zustand)
       └─ authPloc.login(creds)     ← action (application Ploc singleton)
            └─ LoginUseCase.execute(creds) (domain)
                 └─ IAuthRepository.login() (domain interface)
                      └─ AuthRepository.login() (data/api)
                           └─ POST /auth/login → TokenResponse
            └─ fold:
                 error → this.store.setState({ loginError }) + toast.error(...)
                 success → this.store.setState({ accessToken, ... }) + router.push('/dashboard')
```

### Sequence

1. `LoginForm` renders, subscribes to `useAuthState()`.
2. User submits → component calls `authPloc.login(creds)`.
3. Ploc sets `loginLoading: true`, calls `loginUseCase.execute(creds)`.
4. Use-case calls `repo.login(creds)`.
5. Repository returns `Either.right(tokens)`.
6. Ploc `fold`s: calls `this.store.setState({ accessToken, loginLoading: false })` and `router.push('/dashboard')`.
7. Zustand notifies `LoginForm`. Component re-renders with updated state.

---

## Adding a feature (checklist)

One vertical slice per feature:

### 1. Domain — entity

```ts
// domain/department/Department.ts
export interface Department { id: string; name: string; leader: string; memberCount: number }
```

### 2. Domain — repository interface

```ts
// domain/department/IDepartmentRepository.ts
export interface IDepartmentRepository {
  getAll(): Promise<Either<DataError, Department[]>>
}
```

### 3. Domain — use-case(s)

```ts
// domain/department/GetDepartmentsUseCase.ts
export class GetDepartmentsUseCase {
  constructor(private repo: IDepartmentRepository) {}
  execute() { return this.repo.getAll() }
}
```

### 4. Data — repository implementation

```ts
// data/mock/DepartmentRepository.ts
export class DepartmentRepository implements IDepartmentRepository {
  async getAll() { return Either.right(mockDepartments) }
}
```

### 5. Application — state store + Ploc class

```ts
// application/department/useDepartmentsState.ts
import { create } from "zustand"
import type { Department } from "@/domain/department/Department"

export interface DepartmentsState {
  departments: Department[]
  loading: boolean
  error: string | null
}

const useDepartmentsState = create<DepartmentsState>()(() => ({
  departments: [],
  loading: false,
  error: null,
}))

export default useDepartmentsState
```

```ts
// application/department/DepartmentsPloc.ts
import type { StoreApi } from "zustand"
import { Ploc } from "@/core/application/ploc"
import type { DepartmentsState } from "./useDepartmentsState"
import type { GetDepartmentsUseCase } from "@/domain/department/GetDepartmentsUseCase"

export class DepartmentsPloc extends Ploc<StoreApi<DepartmentsState>> {
  constructor({
    store,
    getDepartmentsUseCase,
  }: {
    store: StoreApi<DepartmentsState>
    getDepartmentsUseCase: GetDepartmentsUseCase
  }) {
    super({ store })
    this.getDepartmentsUseCase = getDepartmentsUseCase
  }

  private readonly getDepartmentsUseCase: GetDepartmentsUseCase

  async fetchDepartments() {
    this.store.setState({ loading: true, error: null })
    const result = await this.getDepartmentsUseCase.execute()
    result.fold(
      (err) => this.store.setState({ loading: false, error: this.handleError(err) }),
      (departments) => this.store.setState({ loading: false, departments }),
    )
  }
}
```

### 6. Wire in DependencyLocator

```ts
// core/di/DependencyLocator.ts
import { DepartmentRepository } from "@/data/mock/DepartmentRepository"
import { GetDepartmentsUseCase } from "@/domain/department/GetDepartmentsUseCase"
import { DepartmentsPloc } from "@/application/department/DepartmentsPloc"
import useDepartmentsState from "@/application/department/useDepartmentsState"

export const departmentsPloc = new DepartmentsPloc({
  store: useDepartmentsState,
  getDepartmentsUseCase: new GetDepartmentsUseCase(new DepartmentRepository()),
})
```

### 7. Presentation — component

```tsx
// presentation/components/departments/DepartmentsTable.tsx
"use client"
import { useEffect } from "react"
import useDepartmentsState from "@/application/department/useDepartmentsState"
import { departmentsPloc } from "@/core/di/DependencyLocator"

export function DepartmentsTable() {
  const { departments, loading } = useDepartmentsState()

  useEffect(() => {
    departmentsPloc.fetchDepartments()
  }, [])

  // render departments
}
```

### 8. App — page

```tsx
// app/departments/page.tsx
import { DepartmentsTable } from "@/presentation/components/departments/DepartmentsTable"
export default function DepartmentsPage() {
  return <AppShell><DepartmentsTable /></AppShell>
}
```

---

## "Am I doing it right?" checks

A correct change:
- Keeps `.tsx` components **thin** — no filtering, counting, or date logic
- Business logic lives in a **UseCase**, not in a Ploc method or component
- State mutations happen exclusively via `this.store.setState(...)` inside the Ploc
- The Ploc is imported from `DependencyLocator` — never instantiated inside a component
- Errors travel through `Either<DataError, T>` and are handled in the Ploc with `fold`

**Boundary violations:**

| Smell | Rule broken |
|---|---|
| A `.tsx` component imports from `data/mock/` | Presentation must not reach into data |
| A domain file imports `react`, `next/navigation`, or `zustand` | Domain must be framework-agnostic |
| A component calls `new XxxPloc(...)` | Ploc is a singleton from DependencyLocator |
| A component calls `useXxxState.setState(...)` directly | State mutations belong in the Ploc |
| A component calls a use-case directly | Use-cases are the Ploc's job |
| Two Ploc classes duplicate the same filter function | Extract to a use-case in `domain/` |
| Business logic lives in a Zustand store | Stores hold state only |
| `Either` is bypassed with bare `try/catch` in a repository | Data layer must use `Either` consistently |

---

## Migration path (current state → target)

| Current file | Target location | What to split out |
|---|---|---|
| `lib/members.ts` | `domain/member/Member.ts` + `data/mock/MemberRepository.ts` | Separate entity from data source |
| `lib/fellowships.ts` | `domain/fellowship/Fellowship.ts` + `domain/shared/FellowshipRules.ts` + `data/mock/FellowshipRepository.ts` | Three concerns in one file |
| `lib/people-filters.ts` | `domain/people-filters/PeopleFilter.ts` + `domain/people-filters/FilterRules.ts` | Already clean, just move |
| `components/people/people-table.tsx` | Extract filter logic → `FilterMembersUseCase.ts`; wire through `MembersPloc` | Component owns business logic today |
| `components/fellowships/fellowship-details-content.tsx` | Extract member search → `FellowshipsPloc.fetchMembersByFellowship` | Component calls `getMembersByFellowship` directly today |

Move one feature at a time. Each migration is independently testable and safe.
