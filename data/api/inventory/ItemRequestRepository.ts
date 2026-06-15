import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IItemRequestRepository } from '@/domain/repository/IItemRequestRepository'
import type { ItemRequest, ItemRequestStatus, CreateItemRequestInput } from '@/domain/entities/inventory/ItemRequest'

export class ItemRequestRepository extends BaseRepository implements IItemRequestRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(): Promise<Either<DataError, ItemRequest[]>> {
    try {
      const { data } = await this.axios.get<ItemRequest[]>('/api/inventory/requests')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async create(input: CreateItemRequestInput): Promise<Either<DataError, ItemRequest>> {
    try {
      const { data } = await this.axios.post<ItemRequest>('/api/inventory/requests', {
        requester: input.requester,
        itemId: input.itemId,
        quantity: input.quantity,
        requestDate: input.requestDate,
        returnDate: input.returnDate,
        reason: input.reason,
      })
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async updateStatus(id: string, status: ItemRequestStatus): Promise<Either<DataError, ItemRequest>> {
    try {
      const { data } = await this.axios.patch<ItemRequest>(`/api/inventory/requests/${id}/status`, { status })
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async delete(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete(`/api/inventory/requests/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
