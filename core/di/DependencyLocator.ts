/**
 * Dependency wiring for the CMS.
 *
 * Each `use*Ploc` hook constructs the repository and use-cases it needs,
 * then returns the configured controller. Import from here in components
 * so dependency construction stays out of UI code.
 *
 * Add a new entry here for each feature controller as they are built out.
 */

// Example (uncomment and adapt as each feature is implemented):
//
// import { MemberRepository } from '@/data/mock/MemberRepository'
// import { GetMembersUseCase } from '@/domain/member/GetMembersUseCase'
// import { useMembersStore } from '@/application/member/useMembersStore'
//
// export function provideMembersController() {
//   const repo = new MemberRepository()
//   const getMembersUseCase = new GetMembersUseCase(repo)
//   return { store: useMembersStore, getMembersUseCase }
// }
