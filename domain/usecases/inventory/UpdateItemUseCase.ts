import type { IInventoryItemRepository } from '@/domain/repository/IInventoryItemRepository'
import type { UpdateItemRequest } from '@/domain/entities/inventory/InventoryItem'

export class UpdateItemUseCase {
  constructor(private readonly repo: IInventoryItemRepository) {}

  execute(id: string, params: UpdateItemRequest) {
    return this.repo.update(id, params)
  }
}
