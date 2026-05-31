# Onboarding (New Engineers)

This project is a Vue 3 + TypeScript + Vite application that follows **Clean Architecture** and a **BLoC-inspired “PloC” pattern** to keep UI components thin and business logic portable.

## Quick start

```bash
npm install
npm run dev
```

Useful scripts (see `package.json`):

- `npm run type-check`
- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e:dev`

## Mental model (how to navigate the code)

When you work on any feature, you’ll generally touch **one vertical slice** across layers:

- **Presentation** (`src/presentation/`): Vue SFCs, layouts, router, UI components
- **Application** (`src/application/`): “PloC” classes + Pinia stores (state) that orchestrate use-cases
- **Domain** (`src/domain/`): entities (types), repository contracts, and use-cases
- **Data** (`src/data/`): repository implementations (HTTP calls, mapping)
- **Core** (`src/core/`): cross-cutting utilities (HTTP client, Either, errors, DI, analytics)

If you only remember one flow, remember this:

> `View.vue` calls a method on a `*Ploc` → the `Ploc` runs a `UseCase` → the `UseCase` depends on a repository **interface** → the Data layer repository implementation does the HTTP call via `CustomAxios` and returns an `Either`.

## Where things live (practical pointers)

- **Dependency wiring**: `src/core/di/DependencyLocator.ts`
  - This is where repositories and use-cases get constructed and injected into `*Ploc` classes.
- **HTTP client + auth hooks**: `src/core/utility/CustomAxios.ts`
  - Automatically attaches tokens and performs standardized error shaping.
- **Functional error handling**: `src/core/domain/Either.ts` + `src/core/domain/DataError.ts`
  - Most use-cases return `Either<DataError, SuccessType>`, then callers `fold(...)` to handle both outcomes.
- **A good “full example” feature to study**: Withdrawals
  - UI: `src/presentation/views/Withdrawals/`
  - Application: `src/application/Withdrawals/`
  - Domain: `src/domain/entity/withdrawals/` + `src/domain/usecases/withdrawals/`
  - Data: `src/data/repository/WithdrawRepository.ts`

## Common onboarding “gotchas”

- **`Ploc` classes use Vue composables**:
  - `src/core/ploc.ts` calls `useRouter()` and `useToast()`. This works because `Ploc` instances are created/used during the app runtime, but it’s still a coupling to Vue that we manage intentionally.
- **Naming**:
  - The code uses `Ploc` (not `Bloc`) and `dependencyLocator.provideWidthdrawalPloc()` (note the spelling) for Withdrawals.

## Next steps

- Read [`03-Project-Structure.md`](./03-Project-Structure.md) to learn the folder conventions.
- Read [`05-BLoC-and-PloC.md`](./05-BLoC-and-PloC.md) if you want the deeper reasoning behind the pattern and how it compares to Flutter BLoC.

