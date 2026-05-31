# Vue Merchant Dashboard — Architecture & Onboarding Docs

In today’s fast‑paced world of JavaScript/TypeScript frameworks, keeping up can feel like a never‑ending migration treadmill. Code you wrote for Vue 2 “not too long ago” becomes technical debt in Vue 3; React shifts to server components; the ecosystem moves, and suddenly your application’s _shape_ is dictated by whatever the framework du jour expects.

This repository intentionally pushes back on that gravity.

We use **Clean Architecture** principles (separation of concerns + dependency inversion) and a **BLoC-style “PloC” pattern** (presentation logic extracted from UI) so the “business of the app” remains stable even as tooling, routing, state libraries, or UI conventions evolve. The result is a codebase that is **easier to reason about, safer to refactor, and cheaper to migrate**.

If you’re new here, these docs are meant to help you ramp up fast without having to reverse-engineer the folder structure.

## Where to start

- **New engineer onboarding**
  - [`01-Onboarding.md`](./01-Onboarding.md)
- **Clean Architecture in _this_ repo (why, tradeoffs, rules)**
  - [`02-Clean-Architecture.md`](./02-Clean-Architecture.md)
- **Project structure (folders, responsibilities, naming)**
  - [`03-Project-Structure.md`](./03-Project-Structure.md)
- **End-to-end request lifecycle (View → Ploc → UseCase → Repo → HTTP)**
  - [`04-Request-Lifecycle.md`](./04-Request-Lifecycle.md)
- **BLoC / PloC pattern deep dive + cross-framework references (Flutter, etc.)**
  - [`05-BLoC-and-PloC.md`](./05-BLoC-and-PloC.md)
- **How to add a new feature the “clean way”**
  - [`06-Adding-a-Feature.md`](./06-Adding-a-Feature.md)

## External references (recommended reading)

- **Checkout original article by Victor Misiko (baseline concept)**: `https://medium.com/@victormisiko.vm/implementing-clean-architecture-in-a-vue-js-application-fd23b33ef488`
- **Clean Architecture (Uncle Bob)**: `https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html`
- **BLoC library docs (Flutter)**:
  - `https://bloclibrary.dev/bloc-concepts`
  - `https://bloclibrary.dev/why-bloc`
  - `https://pub.dev/packages/flutter_bloc`
