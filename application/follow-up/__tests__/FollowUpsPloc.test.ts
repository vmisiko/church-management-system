import { describe, it, expect, vi } from 'vitest'
import { createStore } from 'zustand/vanilla'
import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { FollowUpTask, FollowUpAttempt, FollowUpEscalation } from '@/domain/entities/follow-up/FollowUp'
import type { GetFollowUpsUseCase } from '@/domain/usecases/follow-up/GetFollowUpsUseCase'
import type { CreateFollowUpUseCase } from '@/domain/usecases/follow-up/CreateFollowUpUseCase'
import type { UpdateFollowUpUseCase } from '@/domain/usecases/follow-up/UpdateFollowUpUseCase'
import type { RecordFollowUpAttemptUseCase } from '@/domain/usecases/follow-up/RecordFollowUpAttemptUseCase'
import type { GetFollowUpEscalationsUseCase } from '@/domain/usecases/follow-up/GetFollowUpEscalationsUseCase'
import { FollowUpsPloc } from '../FollowUpsPloc'
import type { FollowUpsState } from '../useFollowUpsState'

const networkError: DataError = {
  kind: 'NetworkError',
  message: 'Failed to fetch',
  timestamp: new Date(),
  source: 'HttpClient',
}

const makeTask = (overrides: Partial<FollowUpTask> = {}): FollowUpTask => ({
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
  ...overrides,
})

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
  reason: 'Overdue',
  escalatedAt: '2026-09-05T00:00:00Z',
}

function makeStore(initial: Partial<FollowUpsState> = {}) {
  return createStore<FollowUpsState>(() => ({
    tasks: [],
    selectedTask: null,
    attempts: [],
    escalations: [],
    loading: false,
    submitting: false,
    error: null,
    ...initial,
  }))
}

function makePloc(store: ReturnType<typeof makeStore>) {
  const deps = {
    store,
    getFollowUpsUseCase: { execute: vi.fn() } as unknown as GetFollowUpsUseCase,
    createFollowUpUseCase: { execute: vi.fn() } as unknown as CreateFollowUpUseCase,
    updateFollowUpUseCase: { execute: vi.fn() } as unknown as UpdateFollowUpUseCase,
    recordFollowUpAttemptUseCase: { execute: vi.fn() } as unknown as RecordFollowUpAttemptUseCase,
    getFollowUpEscalationsUseCase: { execute: vi.fn() } as unknown as GetFollowUpEscalationsUseCase,
  }
  return { ploc: new FollowUpsPloc(deps), deps }
}

describe('FollowUpsPloc.fetchAll', () => {
  it('sets tasks and clears loading on success', async () => {
    const store = makeStore()
    const { ploc, deps } = makePloc(store)
    vi.mocked(deps.getFollowUpsUseCase.execute).mockResolvedValue(Either.right([makeTask()]))

    await ploc.fetchAll('open')

    expect(deps.getFollowUpsUseCase.execute).toHaveBeenCalledWith('open')
    expect(store.getState()).toMatchObject({ loading: false, error: null, tasks: [makeTask()] })
  })

  it('sets error and clears loading on failure', async () => {
    const store = makeStore()
    const { ploc, deps } = makePloc(store)
    vi.mocked(deps.getFollowUpsUseCase.execute).mockResolvedValue(Either.left(networkError))

    await ploc.fetchAll()

    expect(store.getState()).toMatchObject({ loading: false, error: 'Failed to fetch' })
  })
})

describe('FollowUpsPloc.create', () => {
  it('prepends the new task and returns true on success', async () => {
    const existing = makeTask({ id: 'task-0' })
    const store = makeStore({ tasks: [existing] })
    const { ploc, deps } = makePloc(store)
    const created = makeTask({ id: 'task-new' })
    vi.mocked(deps.createFollowUpUseCase.execute).mockResolvedValue(Either.right(created))

    const ok = await ploc.create({ memberId: 'member-1', title: 'X', dueDate: '2026-10-01' })

    expect(ok).toBe(true)
    expect(store.getState().tasks).toEqual([created, existing])
    expect(store.getState().submitting).toBe(false)
  })

  it('sets error and returns false on failure, leaving tasks untouched', async () => {
    const existing = makeTask({ id: 'task-0' })
    const store = makeStore({ tasks: [existing] })
    const { ploc, deps } = makePloc(store)
    vi.mocked(deps.createFollowUpUseCase.execute).mockResolvedValue(Either.left(networkError))

    const ok = await ploc.create({ memberId: 'member-1', title: 'X', dueDate: '2026-10-01' })

    expect(ok).toBe(false)
    expect(store.getState().tasks).toEqual([existing])
    expect(store.getState().error).toBe('Failed to fetch')
  })
})

describe('FollowUpsPloc.update', () => {
  it('replaces the matching task in the list and syncs selectedTask when it matches', async () => {
    const original = makeTask({ id: 'task-1', status: 'open' })
    const other = makeTask({ id: 'task-2', status: 'open' })
    const store = makeStore({ tasks: [original, other], selectedTask: original })
    const { ploc, deps } = makePloc(store)
    const updated = makeTask({ id: 'task-1', status: 'completed' })
    vi.mocked(deps.updateFollowUpUseCase.execute).mockResolvedValue(Either.right(updated))

    const ok = await ploc.update('task-1', { status: 'completed' })

    expect(ok).toBe(true)
    expect(store.getState().tasks).toEqual([updated, other])
    expect(store.getState().selectedTask).toEqual(updated)
  })

  it('does not touch selectedTask when it points at a different task', async () => {
    const target = makeTask({ id: 'task-1' })
    const selected = makeTask({ id: 'task-2' })
    const store = makeStore({ tasks: [target, selected], selectedTask: selected })
    const { ploc, deps } = makePloc(store)
    const updated = makeTask({ id: 'task-1', status: 'completed' })
    vi.mocked(deps.updateFollowUpUseCase.execute).mockResolvedValue(Either.right(updated))

    await ploc.update('task-1', { status: 'completed' })

    expect(store.getState().selectedTask).toEqual(selected)
  })
})

describe('FollowUpsPloc.recordAttempt', () => {
  it('updates the task, sets selectedTask, and prepends the new attempt', async () => {
    const original = makeTask({ id: 'task-1' })
    const store = makeStore({ tasks: [original], attempts: [] })
    const { ploc, deps } = makePloc(store)
    const updatedTask = makeTask({ id: 'task-1', notes: 'called' })
    vi.mocked(deps.recordFollowUpAttemptUseCase.execute).mockResolvedValue(
      Either.right({ task: updatedTask, attempt: mockAttempt }),
    )

    const ok = await ploc.recordAttempt('task-1', { contactMethod: 'call', outcome: 'connected' })

    expect(ok).toBe(true)
    expect(store.getState().tasks).toEqual([updatedTask])
    expect(store.getState().selectedTask).toEqual(updatedTask)
    expect(store.getState().attempts).toEqual([mockAttempt])
  })
})

describe('FollowUpsPloc.fetchEscalations', () => {
  it('sets escalations on success', async () => {
    const store = makeStore()
    const { ploc, deps } = makePloc(store)
    vi.mocked(deps.getFollowUpEscalationsUseCase.execute).mockResolvedValue(Either.right([mockEscalation]))

    await ploc.fetchEscalations('task-1')

    expect(store.getState().escalations).toEqual([mockEscalation])
  })
})
