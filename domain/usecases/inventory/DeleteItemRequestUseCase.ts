import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { IItemRequestRepository } from '@/domain/repository/IItemRequestRepository'

export class DeleteItemRequestUseCase {
  constructor(private readonly repo: IItemRequestRepository) {}

  execute(id: string): Promise<Either<DataError, void>> {
    return this.repo.delete(id)
  }
}
