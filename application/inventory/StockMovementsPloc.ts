import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { StockMovementsState } from './useStockMovementsState'
import type { GetStockMovementsUseCase } from '@/domain/usecases/inventory/GetStockMovementsUseCase'

export class StockMovementsPloc extends Ploc<StoreApi<StockMovementsState>> {
  private readonly getMovementsUseCase: GetStockMovementsUseCase

  constructor({
    store,
    getMovementsUseCase,
  }: {
    store: StoreApi<StockMovementsState>
    getMovementsUseCase: GetStockMovementsUseCase
  }) {
    super({ store })
    this.getMovementsUseCase = getMovementsUseCase
  }

  async fetchAll(limit?: number): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getMovementsUseCase.execute(limit)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (movements) => this.store.setState({ loading: false, movements }),
    )
  }

  prepend(movement: import('@/domain/entities/inventory/StockMovement').StockMovement): void {
    this.store.setState((state) => ({ movements: [movement, ...state.movements] }))
  }
}
