import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IStockMovementRepository } from '@/domain/repository/IStockMovementRepository'
import type { StockMovement } from '@/domain/entities/inventory/StockMovement'

export class StockMovementRepository extends BaseRepository implements IStockMovementRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(limit = 50): Promise<Either<DataError, StockMovement[]>> {
    try {
      const { data } = await this.axios.get<StockMovement[]>(
        `/api/inventory/stock-movements?limit=${limit}`,
      )
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
