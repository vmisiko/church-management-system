import type { IInventoryCategoryRepository } from '@/domain/repository/IInventoryCategoryRepository'

export class GetCategoryByIdUseCase {
  constructor(private readonly repo: IInventoryCategoryRepository) {}

  execute(id: string) {
    return this.repo.getById(id)
  }
}
