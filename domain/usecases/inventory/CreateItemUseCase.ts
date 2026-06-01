import type { IInventoryItemRepository } from '@/domain/repository/IInventoryItemRepository'
import type { CreateItemRequest } from '@/domain/entities/inventory/InventoryItem'

export class CreateItemUseCase {
  constructor(private readonly repo: IInventoryItemRepository) {}

  execute(params: CreateItemRequest) {
    return this.repo.create(params)
  }
}
