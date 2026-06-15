import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { ItemRequest, ItemRequestStatus, CreateItemRequestInput } from '@/domain/entities/inventory/ItemRequest'

export interface IItemRequestRepository {
  getAll(): Promise<Either<DataError, ItemRequest[]>>
  create(data: CreateItemRequestInput): Promise<Either<DataError, ItemRequest>>
  updateStatus(id: string, status: ItemRequestStatus): Promise<Either<DataError, ItemRequest>>
  delete(id: string): Promise<Either<DataError, void>>
}
