import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { IItemRequestRepository } from '@/domain/repository/IItemRequestRepository'
import type { ItemRequest } from '@/domain/entities/inventory/ItemRequest'

export class GetItemRequestsUseCase {
  constructor(private readonly repo: IItemRequestRepository) {}

  execute(): Promise<Either<DataError, ItemRequest[]>> {
    return this.repo.getAll()
  }
}
