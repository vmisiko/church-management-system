import type { IInventoryCategoryRepository } from '@/domain/repository/IInventoryCategoryRepository'
import type { CreateCategoryRequest } from '@/domain/entities/inventory/InventoryCategory'

export class CreateCategoryUseCase {
  constructor(private readonly repo: IInventoryCategoryRepository) {}

  execute(params: CreateCategoryRequest) {
    return this.repo.create(params)
  }
}
