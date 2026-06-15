import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { IItemRequestRepository } from '@/domain/repository/IItemRequestRepository'
import type { ItemRequest, CreateItemRequestInput } from '@/domain/entities/inventory/ItemRequest'

export class CreateItemRequestUseCase {
  constructor(private readonly repo: IItemRequestRepository) {}

  execute(data: CreateItemRequestInput): Promise<Either<DataError, ItemRequest>> {
    return this.repo.create(data)
  }
}
