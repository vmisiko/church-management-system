import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { IStockMovementRepository } from '@/domain/repository/IStockMovementRepository'
import type { StockMovement } from '@/domain/entities/inventory/StockMovement'

export class GetStockMovementsUseCase {
  constructor(private readonly repo: IStockMovementRepository) {}

  execute(limit?: number): Promise<Either<DataError, StockMovement[]>> {
    return this.repo.getAll(limit)
  }
}
