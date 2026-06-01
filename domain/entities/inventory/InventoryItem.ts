export type ItemCondition = 'excellent' | 'good' | 'fair' | 'poor'

export interface InventoryItem {
  id: string
  name: string
  code: string
  categoryId: string
  totalQty: number
  availableQty: number
  condition: ItemCondition
  createdAt: string
  updatedAt: string
}

export interface CreateItemRequest {
  name: string
  code: string
  categoryId: string
  totalQty?: number
  condition?: ItemCondition
}

export interface UpdateItemRequest {
  name?: string
  code?: string
  categoryId?: string
  condition?: ItemCondition
}

export interface AdjustStockRequest {
  adjustment: number
  reason?: string
}
