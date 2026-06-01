import type { IInventoryCategoryRepository } from '@/domain/repository/IInventoryCategoryRepository'

export class GetCategoriesUseCase {
  constructor(private readonly repo: IInventoryCategoryRepository) {}

  execute() {
    return this.repo.getAll()
  }
}
