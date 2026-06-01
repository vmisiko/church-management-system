import type { IInventoryCategoryRepository } from '@/domain/repository/IInventoryCategoryRepository'
import type { UpdateCategoryRequest } from '@/domain/entities/inventory/InventoryCategory'

export class UpdateCategoryUseCase {
  constructor(private readonly repo: IInventoryCategoryRepository) {}

  execute(id: string, params: UpdateCategoryRequest) {
    return this.repo.update(id, params)
  }
}
