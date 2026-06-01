import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IInventoryItemRepository } from '@/domain/repository/IInventoryItemRepository'
import type {
  InventoryItem,
  CreateItemRequest,
  UpdateItemRequest,
  AdjustStockRequest,
} from '@/domain/entities/inventory/InventoryItem'

export class InventoryItemRepository extends BaseRepository implements IInventoryItemRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(): Promise<Either<DataError, InventoryItem[]>> {
    try {
      const { data } = await this.axios.get<InventoryItem[]>('/api/inventory/items')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getById(id: string): Promise<Either<DataError, InventoryItem>> {
    try {
      const { data } = await this.axios.get<InventoryItem>(`/api/inventory/items/${id}`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async create(params: CreateItemRequest): Promise<Either<DataError, InventoryItem>> {
    try {
      const { data } = await this.axios.post<InventoryItem>('/api/inventory/items', params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async update(id: string, params: UpdateItemRequest): Promise<Either<DataError, InventoryItem>> {
    try {
      const { data } = await this.axios.patch<InventoryItem>(`/api/inventory/items/${id}`, params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async delete(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete<void>(`/api/inventory/items/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async adjustStock(
    id: string,
    params: AdjustStockRequest,
  ): Promise<Either<DataError, InventoryItem>> {
    try {
      const { data } = await this.axios.post<InventoryItem>(
        `/api/inventory/items/${id}/adjust-stock`,
        params,
      )
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
