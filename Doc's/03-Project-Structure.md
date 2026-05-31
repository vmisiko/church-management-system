# Project structure (What goes where)

This repo uses a Clean Architecture-inspired layout inside `src/`.

At a high level:

```
src/
  application/   # PloCs + Pinia state (orchestration + UI-facing state)
  core/          # cross-cutting utilities (DI, HTTP, Either, errors, analytics, formatting)
  data/          # repository implementations + mapping from API responses
  domain/        # entities + repository interfaces + use-cases (framework-agnostic core)
  presentation/  # Vue components, views, layouts, router, assets
```

## `src/domain/` (the “center”)

You’ll commonly see:

- **Entities**: `src/domain/entity/**`
  - Example: `src/domain/entity/withdrawals/Withdraw.ts`
  - These are the shapes the application cares about (and often include `fromJson(...)` helpers).
- **Repository interfaces**: `src/domain/repository/I*.ts`
  - Example: `src/domain/repository/IWithdrawRepository.ts`
  - Defines contracts used by use-cases, independent of HTTP.
- **Use-cases**: `src/domain/usecases/**`
  - Example: `src/domain/usecases/withdrawals/GetWithdrawSchedulesUseCase.ts`
  - Typically a thin class: `execute(params)` delegates to a repository interface.

Rule of thumb:
- If it reads like “business capability” (“initiate withdrawal”, “get balances”), it belongs in a **use-case**.

## `src/data/` (external interactions)

This is where external integration happens (HTTP, mapping, etc.):

- Example: `src/data/repository/WithdrawRepository.ts`
  - Calls endpoints with `CustomAxios`
  - Returns `Either<DataError, ResponseType>`

Rule of thumb:
- If it imports HTTP clients or talks to `/api/...`, it belongs in **data**.

## `src/application/` (orchestration + state)

This layer contains two key parts:

- **Pinia stores** (feature state): `use*State.ts`
  - Example: `src/application/Withdrawals/useWithdrawalsState.ts`
  - These are UI-facing states: loading flags, fetched lists, error strings, pagination, etc.

- **PloC classes**: `*Ploc.ts`
  - Example: `src/application/Withdrawals/WithdrawalsPloc.ts`
  - Orchestrates use-cases and patches store state (`store.$patch(...)`).
  - Handles `Either.fold(...)` and produces UI-friendly outcomes (toasts, navigation).

Rule of thumb:
- If it’s “glue code” between UI and domain, it belongs in **application**.

## `src/presentation/` (Vue UI)

- `src/presentation/views/` — pages / screens
- `src/presentation/components/` — reusable components
- `src/presentation/layouts/` — page layouts
- `src/presentation/router/` — routes
- `src/presentation/assets/` — CSS/images/etc.

Components generally:

- read from Pinia state
- call methods on `*Ploc` classes (usually obtained from the dependency locator)

## `src/core/` (shared plumbing)

Important files:

- **Dependency injection / service location**: `src/core/di/DependencyLocator.ts`
  - Constructs repositories and use-cases and injects them into Plocs.
  - Also contains a deliberate workaround to avoid circular dependency between auth and HTTP:
    - `authPlocRef` is lazily stored so `CustomAxios` can ask for access tokens.
- **HTTP client**: `src/core/utility/CustomAxios.ts`
  - Sets headers, attaches tokens, retries on timeouts, converts HTTP failures into `DataError` shapes.
- **Functional error handling**: `src/core/domain/Either.ts` + `src/core/domain/DataError.ts`

## Naming conventions you’ll see

- **Feature module folders**: `Auth`, `Withdrawals`, `Transaction`, `Report`, etc.
- **Classes**:
  - `XxxPloc` — presentation/application orchestration
  - `XxxUseCase` — a single operation
  - `XxxRepository` — concrete implementation (data layer)
  - `IXxxRepository` — interface/contract (domain layer)
- **State**:
  - `useXxxState` — Pinia store factory
  - `XxxPlocStoreType` — exported store type for Ploc base typing

Next: see [`04-Request-Lifecycle.md`](./04-Request-Lifecycle.md) for the end-to-end call flow used across features.

