import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { InventoryItemsState } from './useInventoryItemsState'
import type { GetItemsUseCase } from '@/domain/usecases/inventory/GetItemsUseCase'
import type { GetItemByIdUseCase } from '@/domain/usecases/inventory/GetItemByIdUseCase'
import type { CreateItemUseCase } from '@/domain/usecases/inventory/CreateItemUseCase'
import type { UpdateItemUseCase } from '@/domain/usecases/inventory/UpdateItemUseCase'
import type { DeleteItemUseCase } from '@/domain/usecases/inventory/DeleteItemUseCase'
import type { AdjustStockUseCase } from '@/domain/usecases/inventory/AdjustStockUseCase'
import type {
  CreateItemRequest,
  UpdateItemRequest,
  AdjustStockRequest,
} from '@/domain/entities/inventory/InventoryItem'

export class InventoryItemsPloc extends Ploc<StoreApi<InventoryItemsState>> {
  private readonly getItemsUseCase: GetItemsUseCase
  private readonly getItemByIdUseCase: GetItemByIdUseCase
  private readonly createItemUseCase: CreateItemUseCase
  private readonly updateItemUseCase: UpdateItemUseCase
  private readonly deleteItemUseCase: DeleteItemUseCase
  private readonly adjustStockUseCase: AdjustStockUseCase

  constructor({
    store,
    getItemsUseCase,
    getItemByIdUseCase,
    createItemUseCase,
    updateItemUseCase,
    deleteItemUseCase,
    adjustStockUseCase,
  }: {
    store: StoreApi<InventoryItemsState>
    getItemsUseCase: GetItemsUseCase
    getItemByIdUseCase: GetItemByIdUseCase
    createItemUseCase: CreateItemUseCase
    updateItemUseCase: UpdateItemUseCase
    deleteItemUseCase: DeleteItemUseCase
    adjustStockUseCase: AdjustStockUseCase
  }) {
    super({ store })
    this.getItemsUseCase = getItemsUseCase
    this.getItemByIdUseCase = getItemByIdUseCase
    this.createItemUseCase = createItemUseCase
    this.updateItemUseCase = updateItemUseCase
    this.deleteItemUseCase = deleteItemUseCase
    this.adjustStockUseCase = adjustStockUseCase
  }

  async fetchAll(): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getItemsUseCase.execute()
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (items) => this.store.setState({ loading: false, items }),
    )
  }

  async fetchById(id: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getItemByIdUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (item) => this.store.setState({ loading: false, selectedItem: item }),
    )
  }

  async create(params: CreateItemRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.createItemUseCase.execute(params)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      (item) => {
        this.store.setState((state) => ({
          submitting: false,
          items: [...state.items, item],
        }))
        return true
      },
    )
  }

  async update(id: string, params: UpdateItemRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.updateItemUseCase.execute(id, params)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      (updated) => {
        this.store.setState((state) => ({
          submitting: false,
          items: state.items.map((i) => (i.id === updated.id ? updated : i)),
          selectedItem: state.selectedItem?.id === updated.id ? updated : state.selectedItem,
        }))
        return true
      },
    )
  }

  async delete(id: string): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.deleteItemUseCase.execute(id)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      () => {
        this.store.setState((state) => ({
          submitting: false,
          items: state.items.filter((i) => i.id !== id),
          selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
        }))
        return true
      },
    )
  }

  async adjustStock(id: string, params: AdjustStockRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.adjustStockUseCase.execute(id, params)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      (updated) => {
        this.store.setState((state) => ({
          submitting: false,
          items: state.items.map((i) => (i.id === updated.id ? updated : i)),
          selectedItem: state.selectedItem?.id === updated.id ? updated : state.selectedItem,
        }))
        return true
      },
    )
  }

  clearError(): void {
    this.store.setState({ error: null })
  }

  selectItem(id: string | null): void {
    const item = id ? (this.store.getState().items.find((i) => i.id === id) ?? null) : null
    this.store.setState({ selectedItem: item })
  }
}
