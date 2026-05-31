Adding a new feature (the “clean” path)
This guide shows the recommended way to add a new API-backed feature while respecting the project’s boundaries.

The checklist (vertical slice)
When you add a feature, you typically add/modify:

Domain
Entity types (request/response)
Repository interface method (contract)
A use-case class for the operation
Data
Repository implementation method (HTTP + mapping)
Application
Pinia store fields (state required by UI)
Ploc method (orchestrate use-case + patch state + side effects)
Wire it all in DependencyLocator
Presentation
Vue view/component that binds UI → state and calls Ploc methods
Step-by-step example template

1. Domain: define types (entities)
   Add request/response types in an appropriate feature file under:

src/domain/entity/<feature>/...
Keep these types “business-shaped” (not Axios-shaped).

2. Domain: extend the repository interface
   Add a method to:

src/domain/repository/I<Feature>Repository.ts
Example signature pattern:

method(params): Promise<Either<DataError, ResponseType>> 3) Domain: add a use-case
Create src/domain/usecases/<feature>/<Operation>UseCase.ts.

Typical shape:

constructor takes I<Feature>Repository
execute(params) delegates to repository method 4) Data: implement repository method
Update or create:

src/data/repository/<Feature>Repository.ts
Guidelines:

Do the HTTP call via CustomAxios
Map API response → domain response (or call fromJson)
Convert API error payloads into Either.left(...) consistently 5) Application: update Pinia store
Add state in:

src/application/<Feature>/use<Feature>State.ts
Think in UI terms:

loading flags
data lists / objects
pagination
error strings 6) Application: add/update Ploc methods
Update:

src/application/<Feature>/<Feature>Ploc.ts
Pattern:

set loading flags and clear errors
call use-case
fold:
error → patch error + stop loading + toast if appropriate
success → patch data + stop loading 7) Wire everything in DependencyLocator
Update:

src/core/di/DependencyLocator.ts
Add:

repository construction (data)
use-case construction (domain)
ploc construction (application)
This keeps views from constructing dependencies directly and makes the architecture consistent.

8. Presentation: call the Ploc from Vue
   In the view/component:

import the Pinia store
obtain the Ploc from dependencyLocator
call Ploc methods in onMounted, watch, or event handlers
Try to keep:

HTTP and orchestration out of .vue
business rules out of .vue
Testing strategy (lightweight)
Depending on scope:

Unit test use-cases with stub repositories (fast, isolated)
Unit test Ploc methods by injecting:
a real Pinia store instance (or a small store stub)
stubbed use-cases returning Either.left/right
Use Cypress for end-to-end flows where it matters
Smell checks (you’re probably breaking boundaries if…)
a .vue file imports something from src/data/
a domain file imports axios, vue, pinia, or vue-router
business rules are duplicated across multiple views
