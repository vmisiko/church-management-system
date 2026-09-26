import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { CareState } from './useCareState'
import type { ICareRepository } from '@/domain/repository/ICareRepository'
import type { CreateCareRecordRequest, UpdateCareRecordRequest } from '@/domain/entities/care/CareRecord'

/**
 * Simple pass-through repository calls, matching MilestonesPloc's same
 * simplification -- skips the per-operation usecase layer for a genuinely
 * simple CRUD feature with no business logic beyond what the backend
 * already enforces.
 */
export class CarePloc extends Ploc<StoreApi<CareState>> {
  private readonly repo: ICareRepository

  constructor({ store, repo }: { store: StoreApi<CareState>; repo: ICareRepository }) {
    super({ store })
    this.repo = repo
  }

  async fetchByMember(memberId: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.repo.getByMember(memberId)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (records) => this.store.setState({ loading: false, records }),
    )
  }

  async create(memberId: string, data: CreateCareRecordRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.repo.create(memberId, data)
    let success = false
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (record) => {
        success = true
        this.store.setState((state) => ({ submitting: false, records: [record, ...state.records] }))
      },
    )
    return success
  }

  async update(memberId: string, careRecordId: string, data: UpdateCareRecordRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.repo.update(memberId, careRecordId, data)
    let success = false
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (updated) => {
        success = true
        this.store.setState((state) => ({
          submitting: false,
          records: state.records.map((r) => (r.id === updated.id ? updated : r)),
        }))
      },
    )
    return success
  }

  clearError(): void {
    this.store.setState({ error: null })
  }
}
