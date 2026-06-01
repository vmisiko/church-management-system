import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type {
  InventoryItem,
  CreateItemRequest,
  UpdateItemRequest,
  AdjustStockRequest,
} from '@/domain/entities/inventory/InventoryItem'

export interface IInventoryItemRepository {
  getAll(): Promise<Either<DataError, InventoryItem[]>>
  getById(id: string): Promise<Either<DataError, InventoryItem>>
  create(params: CreateItemRequest): Promise<Either<DataError, InventoryItem>>
  update(id: string, params: UpdateItemRequest): Promise<Either<DataError, InventoryItem>>
  delete(id: string): Promise<Either<DataError, void>>
  adjustStock(id: string, params: AdjustStockRequest): Promise<Either<DataError, InventoryItem>>
}
