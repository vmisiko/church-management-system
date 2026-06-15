import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { StockMovement } from '@/domain/entities/inventory/StockMovement'

export interface IStockMovementRepository {
  getAll(limit?: number): Promise<Either<DataError, StockMovement[]>>
}
