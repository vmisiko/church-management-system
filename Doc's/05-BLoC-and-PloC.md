# BLoC vs PloC in this project

This repo uses a BLoC-inspired pattern, but you’ll mostly see it named **`Ploc`**.

- **BLoC** = Business Logic Component (popularized in Flutter)
- **PloC (here)** = a pragmatic adaptation for Vue that keeps components thin and keeps orchestration logic testable and reusable.

## The goal (same as Flutter BLoC)

Keep **UI declarative** and move:

- async orchestration (loading flags, retry logic)
- use-case coordination
- navigation/side-effects (toasts, redirects)
- error normalization

…out of Vue components and into a dedicated “logic component.”

## How Flutter BLoC works (reference point)

In Flutter, BLoC/Cubit typically:

- exposes a **stream of states**
- receives **events** (Bloc) or method calls (Cubit)
- emits new immutable states

References:

- `https://bloclibrary.dev/bloc-concepts`
- `https://bloclibrary.dev/why-bloc`
- `https://pub.dev/packages/flutter_bloc`

## How our Vue PloC works (key differences)

In this repo:

- **State is stored in Pinia**, not emitted via streams.
- **Ploc is a class** that:
  - holds a reference to a Pinia store (typed)
  - calls domain use-cases
  - patches state via `store.$patch(...)`
  - handles errors via `Either.fold(...)`
  - triggers side effects (toast, router) when needed

The base class is:

- `src/core/ploc.ts` (`export class Ploc<T>`)

It provides:

- typed `store`
- `toast` (via `vue-toastification`)
- `router` (via `useRouter()`)
- `handleErrors(...)` to normalize `DataError` into a string

## A real example (WithdrawalsPloc)

Withdrawals is a good slice because it shows the full pattern:

- PloC: `src/application/Withdrawals/WithdrawalsPloc.ts`
- State: `src/application/Withdrawals/useWithdrawalsState.ts`
- Data repo: `src/data/repository/WithdrawRepository.ts`
- Domain use-cases: `src/domain/usecases/withdrawals/*`

Typical method shape:

- patch store into loading state
- call a use-case
- `fold` error/success
- patch store with results
- optionally show toast / navigate

## Why this pattern fits Vue (advantages *here*)

- **Thin components**: Vue SFCs focus on rendering + form binding, not orchestration.
- **Consistency across modules**: Auth, Transactions, Withdrawals, Reports, etc. follow a similar lifecycle.
- **Reusability**: Ploc methods are callable from multiple views/components without copying logic.
- **Testability**: Ploc + use-cases can be tested with stubbed repositories/stores.
- **Migration-friendly**: the domain layer and much of the application layer is less coupled to Vue templates.

## Tradeoffs / sharp edges (be aware)

- **Vue coupling still exists**:
  - `Ploc` base currently uses `useRouter()` and `useToast()`, so Plocs are not 100% framework-free.
  - We accept this because it keeps UI side-effects centralized, but it’s a conscious tradeoff.
- **More abstraction**:
  - New features require more “plumbing” (store + ploc + usecase + repo).
  - The payoff is long-term consistency.
- **Two “state layers” to understand**:
  - Pinia holds the reactive state.
  - Ploc is the orchestrator that mutates that state.

## Where dependency injection fits

To avoid “newing up” use-cases inside views, we centralize wiring in:

- `src/core/di/DependencyLocator.ts`

It constructs:

- repositories
- use-cases
- plocs

So the UI can do:

- `dependencyLocator.provideWidthdrawalPloc()`

## If you come from Flutter…

You can map concepts roughly like this:

- Flutter `Cubit<State>` → Vue `Ploc` + Pinia store
- Flutter `BlocBuilder` → Vue template reacting to Pinia store changes
- Flutter `BlocListener` → Vue watchers / Ploc-triggered router/toast side-effects

It’s not a 1:1 copy, but the *separation principle* is the same: **UI is a projection of state; business logic lives elsewhere.**

