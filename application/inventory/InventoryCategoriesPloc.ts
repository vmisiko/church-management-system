import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { InventoryCategoriesState } from './useInventoryCategoriesState'
import type { GetCategoriesUseCase } from '@/domain/usecases/inventory/GetCategoriesUseCase'
import type { GetCategoryByIdUseCase } from '@/domain/usecases/inventory/GetCategoryByIdUseCase'
import type { CreateCategoryUseCase } from '@/domain/usecases/inventory/CreateCategoryUseCase'
import type { UpdateCategoryUseCase } from '@/domain/usecases/inventory/UpdateCategoryUseCase'
import type { DeleteCategoryUseCase } from '@/domain/usecases/inventory/DeleteCategoryUseCase'
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/domain/entities/inventory/InventoryCategory'

export class InventoryCategoriesPloc extends Ploc<StoreApi<InventoryCategoriesState>> {
  private readonly getCategoriesUseCase: GetCategoriesUseCase
  private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase
  private readonly createCategoryUseCase: CreateCategoryUseCase
  private readonly updateCategoryUseCase: UpdateCategoryUseCase
  private readonly deleteCategoryUseCase: DeleteCategoryUseCase

  constructor({
    store,
    getCategoriesUseCase,
    getCategoryByIdUseCase,
    createCategoryUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase,
  }: {
    store: StoreApi<InventoryCategoriesState>
    getCategoriesUseCase: GetCategoriesUseCase
    getCategoryByIdUseCase: GetCategoryByIdUseCase
    createCategoryUseCase: CreateCategoryUseCase
    updateCategoryUseCase: UpdateCategoryUseCase
    deleteCategoryUseCase: DeleteCategoryUseCase
  }) {
    super({ store })
    this.getCategoriesUseCase = getCategoriesUseCase
    this.getCategoryByIdUseCase = getCategoryByIdUseCase
    this.createCategoryUseCase = createCategoryUseCase
    this.updateCategoryUseCase = updateCategoryUseCase
    this.deleteCategoryUseCase = deleteCategoryUseCase
  }

  async fetchAll(): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getCategoriesUseCase.execute()
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (categories) => this.store.setState({ loading: false, categories }),
    )
  }

  async fetchById(id: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getCategoryByIdUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (category) => this.store.setState({ loading: false, selectedCategory: category }),
    )
  }

  async create(params: CreateCategoryRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.createCategoryUseCase.execute(params)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      (category) => {
        this.store.setState((state) => ({
          submitting: false,
          categories: [...state.categories, category],
        }))
        return true
      },
    )
  }

  async update(id: string, params: UpdateCategoryRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.updateCategoryUseCase.execute(id, params)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      (updated) => {
        this.store.setState((state) => ({
          submitting: false,
          categories: state.categories.map((c) => (c.id === updated.id ? updated : c)),
          selectedCategory:
            state.selectedCategory?.id === updated.id ? updated : state.selectedCategory,
        }))
        return true
      },
    )
  }

  async delete(id: string): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.deleteCategoryUseCase.execute(id)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      () => {
        this.store.setState((state) => ({
          submitting: false,
          categories: state.categories.filter((c) => c.id !== id),
          selectedCategory:
            state.selectedCategory?.id === id ? null : state.selectedCategory,
        }))
        return true
      },
    )
  }

  clearError(): void {
    this.store.setState({ error: null })
  }

  selectCategory(id: string | null): void {
    const category = id
      ? (this.store.getState().categories.find((c) => c.id === id) ?? null)
      : null
    this.store.setState({ selectedCategory: category })
  }
}
