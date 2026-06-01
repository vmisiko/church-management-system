import type { IInventoryItemRepository } from '@/domain/repository/IInventoryItemRepository'

export class GetItemsUseCase {
  constructor(private readonly repo: IInventoryItemRepository) {}

  execute() {
    return this.repo.getAll()
  }
}
