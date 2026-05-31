"use client"

/**
 * Dependency wiring for the CMS.
 *
 * Each feature exports a `use*Ploc()` hook that:
 *   1. Obtains the Next.js router (for redirects on auth errors, etc.)
 *   2. Creates the HTTP client via useMemo, bound to that router
 *   3. Lazily initialises and caches the Ploc singleton via useMemo
 *
 * Components call `const ploc = useMembersPloc()` — they never construct
 * repositories or use-cases themselves.
 *
 * The Zustand store (use*State) is passed directly as the `store` argument
 * because Zustand's create() return value is both a React hook AND a StoreApi.
 *
 * Add a new entry here for each feature as it is built out.
 */

import { useMemo } from "react"
import { useRouter } from "next/navigation"

// ---------------------------------------------------------------------------
// Example — uncomment and adapt as each feature is implemented:
// ---------------------------------------------------------------------------
//
// import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
// import { MemberRepository } from "@/data/mock/MemberRepository"
// import { GetMembersUseCase } from "@/domain/member/GetMembersUseCase"
// import { FilterMembersUseCase } from "@/domain/member/FilterMembersUseCase"
// import { MembersPloc } from "@/application/member/MembersPloc"
// import useMembersState from "@/application/member/useMembersState"
//
// let membersPlocSingleton: MembersPloc | null = null
//
// export function useMembersPloc(): MembersPloc {
//   const router = useRouter()
//   // When the repo needs an HTTP client, pass it here:
//   // const http = useMemo(() => ensureHttpClient(router), [router])
//
//   return useMemo(() => {
//     if (membersPlocSingleton) {
//       return membersPlocSingleton
//     }
//     const repo = new MemberRepository()
//     membersPlocSingleton = new MembersPloc({
//       store: useMembersState,
//       getMembersUseCase: new GetMembersUseCase(repo),
//       filterMembersUseCase: new FilterMembersUseCase(repo),
//     })
//     return membersPlocSingleton
//   }, [router])
// }
