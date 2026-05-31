# Clean Architecture (Why we use it here)

This project is designed to be **hard to break by framework change**.

Vue 3 is our current delivery mechanism — not our “architecture.” Clean Architecture keeps the **center of gravity** in stable code (domain rules + use-cases), while Vue, HTTP, storage, analytics, and UI libraries remain replaceable edges.

## The core rule: dependencies point inward

Clean Architecture is often summarized by Uncle Bob’s “dependency rule”:

- Code in **inner layers** must not depend on code in **outer layers**
- Outer layers may depend on inner layers

In this repo, that means:

- `src/domain/` should not import from `src/data/` or `src/presentation/`
- `src/data/` can import domain contracts and entities
- `src/application/` can orchestrate domain use-cases and update state
- `src/presentation/` should mostly render and delegate to a `*Ploc`

Reference: `https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html`

## Layers in this codebase (how it maps)

- **Domain (`src/domain/`)**
  - **Entities**: the types the business cares about
  - **Repository interfaces**: “ports” / boundaries (`I*Repository.ts`)
  - **Use-cases**: focused operations (`*UseCase.ts`) that depend only on repository interfaces

- **Data (`src/data/`)**
  - Concrete repository implementations (`*Repository.ts`)
  - HTTP calls and mapping (`fromJson`, DTO mapping, etc.)

- **Application (`src/application/`)**
  - `*Ploc.ts` classes: orchestrate use-cases and patch Pinia stores
  - `use*State.ts`: Pinia stores that represent UI-facing state for a feature/module

- **Presentation (`src/presentation/`)**
  - Vue views/layouts/components
  - Calls into the application layer (Plocs) and consumes Pinia state

- **Core (`src/core/`)**
  - Cross-cutting utilities: `CustomAxios`, `Either`, `DataError`, DI locator, analytics, formatting utilities

## Why it’s worth it (benefits)

- **Replaceability**: change transport (Axios, Fetch), routing, UI libs, or even framework with less pain.
- **Testability**: use-cases and Ploc logic are easier to test than component-driven side effects.
- **Consistency**: every feature uses the same flow, so new work is predictable.
- **Safer refactors**: boundaries constrain where changes can ripple.

## The real tradeoffs (be honest)

Clean Architecture isn’t free:

- **More files / boilerplate**: every feature has interfaces + use-cases + repositories + state + Ploc.
- **Indirection**: tracing “where does this API call happen?” requires following the vertical slice.
- **Discipline required**: if teams casually bypass boundaries (e.g., calling HTTP directly from a component), the benefits collapse.
- **Not always necessary**: for very small or short-lived apps, this structure can be overkill.

In this repo, we accept the cost because the dashboard is a long-lived product with multiple modules (Auth, Transactions, Withdrawals, Reports, Support, etc.) and changing requirements.

## “How do I know I’m doing it right?”

A good change typically:

- Keeps Vue components **thin**
- Introduces or modifies a **UseCase** instead of embedding business logic in the UI
- Touches **one vertical slice** across layers, without crossing boundaries incorrectly
- Returns errors through `Either<DataError, T>` and handles them via `fold(...)`

Next: see [`04-Request-Lifecycle.md`](./04-Request-Lifecycle.md) for the step-by-step request flow used across features.

