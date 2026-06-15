import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { ItemRequestsState } from './useItemRequestsState'
import type { GetItemRequestsUseCase } from '@/domain/usecases/inventory/GetItemRequestsUseCase'
import type { CreateItemRequestUseCase } from '@/domain/usecases/inventory/CreateItemRequestUseCase'
import type { UpdateItemRequestStatusUseCase } from '@/domain/usecases/inventory/UpdateItemRequestStatusUseCase'
import type { DeleteItemRequestUseCase } from '@/domain/usecases/inventory/DeleteItemRequestUseCase'
import type { CreateItemRequestInput, ItemRequestStatus } from '@/domain/entities/inventory/ItemRequest'

export class ItemRequestsPloc extends Ploc<StoreApi<ItemRequestsState>> {
  private readonly getRequestsUseCase: GetItemRequestsUseCase
  private readonly createRequestUseCase: CreateItemRequestUseCase
  private readonly updateStatusUseCase: UpdateItemRequestStatusUseCase
  private readonly deleteRequestUseCase: DeleteItemRequestUseCase

  constructor({
    store,
    getRequestsUseCase,
    createRequestUseCase,
    updateStatusUseCase,
    deleteRequestUseCase,
  }: {
    store: StoreApi<ItemRequestsState>
    getRequestsUseCase: GetItemRequestsUseCase
    createRequestUseCase: CreateItemRequestUseCase
    updateStatusUseCase: UpdateItemRequestStatusUseCase
    deleteRequestUseCase: DeleteItemRequestUseCase
  }) {
    super({ store })
    this.getRequestsUseCase = getRequestsUseCase
    this.createRequestUseCase = createRequestUseCase
    this.updateStatusUseCase = updateStatusUseCase
    this.deleteRequestUseCase = deleteRequestUseCase
  }

  async fetchAll(): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getRequestsUseCase.execute()
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (requests) => this.store.setState({ loading: false, requests }),
    )
  }

  async create(input: CreateItemRequestInput): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.createRequestUseCase.execute(input)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      (request) => {
        this.store.setState((state) => ({
          submitting: false,
          requests: [request, ...state.requests],
        }))
        return true
      },
    )
  }

  async updateStatus(id: string, status: ItemRequestStatus): Promise<boolean> {
    const result = await this.updateStatusUseCase.execute(id, status)
    return result.fold(
      (error) => {
        this.store.setState({ error: this.handleError(error) })
        return false
      },
      (updated) => {
        this.store.setState((state) => ({
          requests: state.requests.map((r) => (r.id === id ? updated : r)),
        }))
        return true
      },
    )
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.deleteRequestUseCase.execute(id)
    return result.fold(
      (error) => {
        this.store.setState({ error: this.handleError(error) })
        return false
      },
      () => {
        this.store.setState((state) => ({
          requests: state.requests.filter((r) => r.id !== id),
        }))
        return true
      },
    )
  }
}
