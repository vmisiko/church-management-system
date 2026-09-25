import { describe, it, expect, vi } from 'vitest'
import { createStore } from 'zustand/vanilla'
import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { RetentionStats, AtRiskMembersResponse } from '@/domain/entities/retention/Retention'
import type { GetRetentionStatsUseCase } from '@/domain/usecases/retention/GetRetentionStatsUseCase'
import type { GetAtRiskMembersUseCase } from '@/domain/usecases/retention/GetAtRiskMembersUseCase'
import { RetentionPloc } from '../RetentionPloc'
import type { RetentionState } from '../useRetentionState'

const networkError: DataError = {
  kind: 'NetworkError',
  message: 'Failed to fetch',
  timestamp: new Date(),
  source: 'HttpClient',
}

const mockStats: RetentionStats = {
  cohortRetention: {
    d30: { eligible: 10, retained: 5, rate: 50 },
    d60: { eligible: 10, retained: 4, rate: 40 },
    d90: { eligible: 10, retained: 3, rate: 30 },
  },
  guestConversion: { total: 10, converted: 6, rate: 60, note: '' },
  followUpCompletion: { total: 20, completed: 10, rate: 50 },
  trend: [],
}

const mockAtRisk: AtRiskMembersResponse = {
  members: [
    { id: '1', firstName: 'Jane', lastName: 'Doe', status: 'member', activityStatus: 'inactive', joinedAt: '2026-01-01', reason: 'inactive' },
  ],
  total: 1,
  page: 1,
  limit: 20,
}

function makeStore() {
  return createStore<RetentionState>(() => ({
    stats: null,
    atRiskMembers: [],
    atRiskTotal: 0,
    atRiskPage: 1,
    atRiskLimit: 20,
    loading: false,
    atRiskLoading: false,
    error: null,
  }))
}

function makePloc(store: ReturnType<typeof makeStore>) {
  const getRetentionStatsUseCase = { execute: vi.fn() } as unknown as GetRetentionStatsUseCase
  const getAtRiskMembersUseCase = { execute: vi.fn() } as unknown as GetAtRiskMembersUseCase
  const ploc = new RetentionPloc({ store, getRetentionStatsUseCase, getAtRiskMembersUseCase })
  return { ploc, getRetentionStatsUseCase, getAtRiskMembersUseCase }
}

describe('RetentionPloc.fetchStats', () => {
  it('sets stats and clears loading on success', async () => {
    const store = makeStore()
    const { ploc, getRetentionStatsUseCase } = makePloc(store)
    vi.mocked(getRetentionStatsUseCase.execute).mockResolvedValue(Either.right(mockStats))

    await ploc.fetchStats({ departmentId: 'dept-1' })

    expect(getRetentionStatsUseCase.execute).toHaveBeenCalledWith({ departmentId: 'dept-1' })
    expect(store.getState()).toMatchObject({ loading: false, error: null, stats: mockStats })
  })

  it('sets error and clears loading on failure, without touching stats', async () => {
    const store = makeStore()
    const { ploc, getRetentionStatsUseCase } = makePloc(store)
    vi.mocked(getRetentionStatsUseCase.execute).mockResolvedValue(Either.left(networkError))

    await ploc.fetchStats()

    expect(store.getState()).toMatchObject({ loading: false, error: 'Failed to fetch', stats: null })
  })
})

describe('RetentionPloc.fetchAtRiskMembers', () => {
  it('sets at-risk members, total, and pagination on success', async () => {
    const store = makeStore()
    const { ploc, getAtRiskMembersUseCase } = makePloc(store)
    vi.mocked(getAtRiskMembersUseCase.execute).mockResolvedValue(Either.right(mockAtRisk))

    await ploc.fetchAtRiskMembers(1, 20)

    expect(getAtRiskMembersUseCase.execute).toHaveBeenCalledWith(1, 20)
    expect(store.getState()).toMatchObject({
      atRiskLoading: false,
      atRiskMembers: mockAtRisk.members,
      atRiskTotal: 1,
      atRiskPage: 1,
      atRiskLimit: 20,
    })
  })

  it('sets error and clears atRiskLoading on failure', async () => {
    const store = makeStore()
    const { ploc, getAtRiskMembersUseCase } = makePloc(store)
    vi.mocked(getAtRiskMembersUseCase.execute).mockResolvedValue(Either.left(networkError))

    await ploc.fetchAtRiskMembers()

    expect(store.getState()).toMatchObject({ atRiskLoading: false, error: 'Failed to fetch' })
  })
})
