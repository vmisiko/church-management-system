import type { IInventoryItemRepository } from '@/domain/repository/IInventoryItemRepository'
import type { AdjustStockRequest } from '@/domain/entities/inventory/InventoryItem'

export class AdjustStockUseCase {
  constructor(private readonly repo: IInventoryItemRepository) {}

  execute(id: string, params: AdjustStockRequest) {
    return this.repo.adjustStock(id, params)
  }
}
