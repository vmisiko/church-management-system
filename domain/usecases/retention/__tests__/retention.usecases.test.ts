import { describe, it, expect, vi } from 'vitest'
import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { IRetentionRepository } from '@/domain/repository/IRetentionRepository'
import type { RetentionStats, AtRiskMembersResponse } from '@/domain/entities/retention/Retention'
import { GetRetentionStatsUseCase } from '../GetRetentionStatsUseCase'
import { GetAtRiskMembersUseCase } from '../GetAtRiskMembersUseCase'

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

function makeRepo(): IRetentionRepository {
  return {
    getStats: vi.fn(),
    getAtRiskMembers: vi.fn(),
  }
}

describe('GetRetentionStatsUseCase', () => {
  it('delegates to repo.getStats with the given query', async () => {
    const repo = makeRepo()
    vi.mocked(repo.getStats).mockResolvedValue(Either.right(mockStats))

    const result = await new GetRetentionStatsUseCase(repo).execute({ departmentId: 'dept-1' })

    expect(repo.getStats).toHaveBeenCalledWith({ departmentId: 'dept-1' })
    expect(result.isRight()).toBe(true)
    expect(result.getOrThrow()).toEqual(mockStats)
  })

  it('propagates a repository error unchanged', async () => {
    const repo = makeRepo()
    vi.mocked(repo.getStats).mockResolvedValue(Either.left(networkError))

    const result = await new GetRetentionStatsUseCase(repo).execute()

    expect(result.isLeft()).toBe(true)
    expect(result.getLeft()).toEqual(networkError)
  })
})

describe('GetAtRiskMembersUseCase', () => {
  it('delegates to repo.getAtRiskMembers with page and limit', async () => {
    const repo = makeRepo()
    vi.mocked(repo.getAtRiskMembers).mockResolvedValue(Either.right(mockAtRisk))

    const result = await new GetAtRiskMembersUseCase(repo).execute(2, 10)

    expect(repo.getAtRiskMembers).toHaveBeenCalledWith(2, 10)
    expect(result.getOrThrow()).toEqual(mockAtRisk)
  })

  it('propagates a repository error unchanged', async () => {
    const repo = makeRepo()
    vi.mocked(repo.getAtRiskMembers).mockResolvedValue(Either.left(networkError))

    const result = await new GetAtRiskMembersUseCase(repo).execute()

    expect(result.isLeft()).toBe(true)
  })
})
