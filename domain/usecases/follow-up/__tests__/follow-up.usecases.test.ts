import { describe, it, expect, vi } from 'vitest'
import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { IFollowUpRepository } from '@/domain/repository/IFollowUpRepository'
import type { FollowUpTask, FollowUpAttempt, FollowUpEscalation } from '@/domain/entities/follow-up/FollowUp'
import { GetFollowUpsUseCase } from '../GetFollowUpsUseCase'
import { CreateFollowUpUseCase } from '../CreateFollowUpUseCase'
import { UpdateFollowUpUseCase } from '../UpdateFollowUpUseCase'
import { RecordFollowUpAttemptUseCase } from '../RecordFollowUpAttemptUseCase'
import { GetFollowUpEscalationsUseCase } from '../GetFollowUpEscalationsUseCase'

const networkError: DataError = {
  kind: 'NetworkError',
  message: 'Failed to fetch',
  timestamp: new Date(),
  source: 'HttpClient',
}

const mockTask: FollowUpTask = {
  id: 'task-1',
  memberId: 'member-1',
  member: { id: 'member-1', firstName: 'Jane', lastName: 'Doe' },
  ownerId: null,
  title: 'Welcome & connect',
  notes: null,
  dueDate: '2026-10-01',
  status: 'open',
  source: 'manual',
  escalationLevel: 0,
  escalatedAt: null,
  escalatedToId: null,
  completedAt: null,
  createdAt: '2026-09-01T00:00:00Z',
  updatedAt: '2026-09-01T00:00:00Z',
}

const mockAttempt: FollowUpAttempt = {
  id: 'attempt-1',
  taskId: 'task-1',
  contactMethod: 'call',
  outcome: 'connected',
  notes: null,
  contactedAt: '2026-09-02T00:00:00Z',
  createdById: 'user-1',
  createdAt: '2026-09-02T00:00:00Z',
}

const mockEscalation: FollowUpEscalation = {
  id: 'esc-1',
  taskId: 'task-1',
  fromOwnerId: null,
  toOwnerId: 'user-1',
  reason: 'Overdue by more than 2 day(s)',
  escalatedAt: '2026-09-05T00:00:00Z',
}

function makeRepo(): IFollowUpRepository {
  return {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    recordAttempt: vi.fn(),
    getEscalations: vi.fn(),
  }
}

describe('GetFollowUpsUseCase', () => {
  it('delegates to repo.getAll with the given status', async () => {
    const repo = makeRepo()
    vi.mocked(repo.getAll).mockResolvedValue(Either.right([mockTask]))

    const result = await new GetFollowUpsUseCase(repo).execute('open')

    expect(repo.getAll).toHaveBeenCalledWith('open')
    expect(result.getOrThrow()).toEqual([mockTask])
  })

  it('propagates a repository error unchanged', async () => {
    const repo = makeRepo()
    vi.mocked(repo.getAll).mockResolvedValue(Either.left(networkError))

    const result = await new GetFollowUpsUseCase(repo).execute()

    expect(result.isLeft()).toBe(true)
  })
})

describe('CreateFollowUpUseCase', () => {
  it('delegates to repo.create with the given input', async () => {
    const repo = makeRepo()
    vi.mocked(repo.create).mockResolvedValue(Either.right(mockTask))
    const input = { memberId: 'member-1', title: 'Welcome & connect', dueDate: '2026-10-01' }

    const result = await new CreateFollowUpUseCase(repo).execute(input)

    expect(repo.create).toHaveBeenCalledWith(input)
    expect(result.getOrThrow()).toEqual(mockTask)
  })
})

describe('UpdateFollowUpUseCase', () => {
  it('delegates to repo.update with id and input', async () => {
    const repo = makeRepo()
    const updated = { ...mockTask, status: 'completed' as const }
    vi.mocked(repo.update).mockResolvedValue(Either.right(updated))

    const result = await new UpdateFollowUpUseCase(repo).execute('task-1', { status: 'completed' })

    expect(repo.update).toHaveBeenCalledWith('task-1', { status: 'completed' })
    expect(result.getOrThrow().status).toBe('completed')
  })
})

describe('RecordFollowUpAttemptUseCase', () => {
  it('delegates to repo.recordAttempt with id and input', async () => {
    const repo = makeRepo()
    vi.mocked(repo.recordAttempt).mockResolvedValue(Either.right({ task: mockTask, attempt: mockAttempt }))
    const input = { contactMethod: 'call' as const, outcome: 'connected' as const }

    const result = await new RecordFollowUpAttemptUseCase(repo).execute('task-1', input)

    expect(repo.recordAttempt).toHaveBeenCalledWith('task-1', input)
    expect(result.getOrThrow()).toEqual({ task: mockTask, attempt: mockAttempt })
  })
})

describe('GetFollowUpEscalationsUseCase', () => {
  it('delegates to repo.getEscalations with id', async () => {
    const repo = makeRepo()
    vi.mocked(repo.getEscalations).mockResolvedValue(Either.right([mockEscalation]))

    const result = await new GetFollowUpEscalationsUseCase(repo).execute('task-1')

    expect(repo.getEscalations).toHaveBeenCalledWith('task-1')
    expect(result.getOrThrow()).toEqual([mockEscalation])
  })
})
