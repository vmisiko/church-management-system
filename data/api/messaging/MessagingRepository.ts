import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IMessagingRepository } from '@/domain/repository/IMessagingRepository'
import type {
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
  MessageDelivery,
  DeliveryStats,
} from '@/domain/entities/messaging/Message'

export class MessagingRepository extends BaseRepository implements IMessagingRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(): Promise<Either<DataError, Message[]>> {
    try {
      const { data } = await this.axios.get<Message[]>('/api/messaging')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getById(id: string): Promise<Either<DataError, Message>> {
    try {
      const { data } = await this.axios.get<Message>(`/api/messaging/${id}`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async create(params: CreateMessageRequest): Promise<Either<DataError, Message>> {
    try {
      const { data } = await this.axios.post<Message>('/api/messaging', params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async update(id: string, params: UpdateMessageRequest): Promise<Either<DataError, Message>> {
    try {
      const { data } = await this.axios.patch<Message>(`/api/messaging/${id}`, params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async delete(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete(`/api/messaging/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async send(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.post(`/api/messaging/${id}/send`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getDeliveries(messageId: string): Promise<Either<DataError, MessageDelivery[]>> {
    try {
      const { data } = await this.axios.get<MessageDelivery[]>(
        `/api/messaging/${messageId}/deliveries`,
      )
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getDeliveryStats(messageId: string): Promise<Either<DataError, DeliveryStats>> {
    try {
      const { data } = await this.axios.get<DeliveryStats>(
        `/api/messaging/${messageId}/deliveries/stats`,
      )
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
