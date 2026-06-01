import { create } from 'zustand'
import type { InventoryItem } from '@/domain/entities/inventory/InventoryItem'

export interface InventoryItemsState {
  items: InventoryItem[]
  selectedItem: InventoryItem | null
  loading: boolean
  submitting: boolean
  error: string | null
}

const useInventoryItemsState = create<InventoryItemsState>(
  (): InventoryItemsState => ({
    items: [],
    selectedItem: null,
    loading: false,
    submitting: false,
    error: null,
  }),
)

export default useInventoryItemsState
