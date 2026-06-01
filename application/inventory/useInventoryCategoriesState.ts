import { create } from 'zustand'
import type { InventoryCategory } from '@/domain/entities/inventory/InventoryCategory'

export interface InventoryCategoriesState {
  categories: InventoryCategory[]
  selectedCategory: InventoryCategory | null
  loading: boolean
  submitting: boolean
  error: string | null
}

const useInventoryCategoriesState = create<InventoryCategoriesState>(
  (): InventoryCategoriesState => ({
    categories: [],
    selectedCategory: null,
    loading: false,
    submitting: false,
    error: null,
  }),
)

export default useInventoryCategoriesState
