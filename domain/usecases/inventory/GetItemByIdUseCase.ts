import type { IInventoryItemRepository } from '@/domain/repository/IInventoryItemRepository'

export class GetItemByIdUseCase {
  constructor(private readonly repo: IInventoryItemRepository) {}

  execute(id: string) {
    return this.repo.getById(id)
  }
}
