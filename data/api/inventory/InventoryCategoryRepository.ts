import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IInventoryCategoryRepository } from '@/domain/repository/IInventoryCategoryRepository'
import type {
  InventoryCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/domain/entities/inventory/InventoryCategory'

export class InventoryCategoryRepository
  extends BaseRepository
  implements IInventoryCategoryRepository
{
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(): Promise<Either<DataError, InventoryCategory[]>> {
    try {
      const { data } = await this.axios.get<InventoryCategory[]>('/api/inventory/categories')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getById(id: string): Promise<Either<DataError, InventoryCategory>> {
    try {
      const { data } = await this.axios.get<InventoryCategory>(`/api/inventory/categories/${id}`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async create(params: CreateCategoryRequest): Promise<Either<DataError, InventoryCategory>> {
    try {
      const { data } = await this.axios.post<InventoryCategory>('/api/inventory/categories', params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async update(
    id: string,
    params: UpdateCategoryRequest,
  ): Promise<Either<DataError, InventoryCategory>> {
    try {
      const { data } = await this.axios.patch<InventoryCategory>(
        `/api/inventory/categories/${id}`,
        params,
      )
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async delete(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete<void>(`/api/inventory/categories/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
