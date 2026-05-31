/**
 * Dependency wiring for the CMS.
 *
 * Each feature exports a Ploc singleton constructed here with its
 * repository and use-cases already injected. Import the singleton in
 * components so dependency construction stays out of UI code.
 *
 * The Zustand store (use*State) is passed as-is — Zustand's create()
 * return value is both a React hook AND a StoreApi, so it satisfies
 * the Ploc constructor's `store` parameter without any extra wrapper.
 *
 * Add a new entry here for each feature Ploc as they are built out.
 */

// Example (uncomment and adapt as each feature is implemented):
//
// import { MemberRepository } from '@/data/mock/MemberRepository'
// import { GetMembersUseCase } from '@/domain/member/GetMembersUseCase'
// import { FilterMembersUseCase } from '@/domain/member/FilterMembersUseCase'
// import { MembersPloc } from '@/application/member/MembersPloc'
// import useMembersState from '@/application/member/useMembersState'
//
// const memberRepo = new MemberRepository()
//
// export const membersPloc = new MembersPloc({
//   store: useMembersState,
//   getMembersUseCase: new GetMembersUseCase(memberRepo),
//   filterMembersUseCase: new FilterMembersUseCase(memberRepo),
// })
