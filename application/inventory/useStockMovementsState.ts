import { create } from 'zustand'
import type { StockMovement } from '@/domain/entities/inventory/StockMovement'

export interface StockMovementsState {
  movements: StockMovement[]
  loading: boolean
  error: string | null
}

const useStockMovementsState = create<StockMovementsState>(
  (): StockMovementsState => ({
    movements: [],
    loading: false,
    error: null,
  }),
)

export default useStockMovementsState
