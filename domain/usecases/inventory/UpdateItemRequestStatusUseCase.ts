import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { IItemRequestRepository } from '@/domain/repository/IItemRequestRepository'
import type { ItemRequest, ItemRequestStatus } from '@/domain/entities/inventory/ItemRequest'

export class UpdateItemRequestStatusUseCase {
  constructor(private readonly repo: IItemRequestRepository) {}

  execute(id: string, status: ItemRequestStatus): Promise<Either<DataError, ItemRequest>> {
    return this.repo.updateStatus(id, status)
  }
}
