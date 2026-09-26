import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { MilestonesState } from './useMilestonesState'
import type { IMilestoneRepository } from '@/domain/repository/IMilestoneRepository'
import type {
  CreateMilestoneTypeRequest,
  UpdateMilestoneTypeRequest,
  RecordMemberMilestoneRequest,
} from '@/domain/entities/milestone/Milestone'

/**
 * Simple pass-through repository calls, not the usual per-operation usecase
 * layer -- milestone types and member milestones are plain CRUD with no
 * business logic beyond what the backend already enforces, so the extra
 * indirection wasn't worth the file count for this feature.
 */
export class MilestonesPloc extends Ploc<StoreApi<MilestonesState>> {
  private readonly repo: IMilestoneRepository

  constructor({ store, repo }: { store: StoreApi<MilestonesState>; repo: IMilestoneRepository }) {
    super({ store })
    this.repo = repo
  }

  async fetchTypes(): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.repo.getAllTypes()
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (types) => this.store.setState({ loading: false, types }),
    )
  }

  async createType(data: CreateMilestoneTypeRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.repo.createType(data)
    let success = false
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (type) => {
        success = true
        this.store.setState((state) => ({ submitting: false, types: [...state.types, type] }))
      },
    )
    return success
  }

  async updateType(id: string, data: UpdateMilestoneTypeRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.repo.updateType(id, data)
    let success = false
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (updated) => {
        success = true
        this.store.setState((state) => ({
          submitting: false,
          types: state.types.map((t) => (t.id === id ? updated : t)),
        }))
      },
    )
    return success
  }

  async deleteType(id: string): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.repo.deleteType(id)
    let success = false
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      () => {
        success = true
        this.store.setState((state) => ({
          submitting: false,
          types: state.types.filter((t) => t.id !== id),
        }))
      },
    )
    return success
  }

  async fetchByMember(memberId: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.repo.getByMember(memberId)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (memberMilestones) => this.store.setState({ loading: false, memberMilestones }),
    )
  }

  async record(memberId: string, data: RecordMemberMilestoneRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.repo.record(memberId, data)
    let success = false
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (milestone) => {
        success = true
        this.store.setState((state) => ({
          submitting: false,
          memberMilestones: [milestone, ...state.memberMilestones],
        }))
      },
    )
    return success
  }

  async remove(memberId: string, milestoneId: string): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.repo.remove(memberId, milestoneId)
    let success = false
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      () => {
        success = true
        this.store.setState((state) => ({
          submitting: false,
          memberMilestones: state.memberMilestones.filter((m) => m.id !== milestoneId),
        }))
      },
    )
    return success
  }

  clearError(): void {
    this.store.setState({ error: null })
  }
}
