import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type {
  InventoryCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/domain/entities/inventory/InventoryCategory'

export interface IInventoryCategoryRepository {
  getAll(): Promise<Either<DataError, InventoryCategory[]>>
  getById(id: string): Promise<Either<DataError, InventoryCategory>>
  create(params: CreateCategoryRequest): Promise<Either<DataError, InventoryCategory>>
  update(id: string, params: UpdateCategoryRequest): Promise<Either<DataError, InventoryCategory>>
  delete(id: string): Promise<Either<DataError, void>>
}
