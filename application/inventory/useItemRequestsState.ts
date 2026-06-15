import { create } from 'zustand'
import type { ItemRequest } from '@/domain/entities/inventory/ItemRequest'

export interface ItemRequestsState {
  requests: ItemRequest[]
  loading: boolean
  submitting: boolean
  error: string | null
}

const useItemRequestsState = create<ItemRequestsState>(
  (): ItemRequestsState => ({
    requests: [],
    loading: false,
    submitting: false,
    error: null,
  }),
)

export default useItemRequestsState
