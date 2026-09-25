import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type {
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
  DeliveryStats,
  PaginatedDeliveries,
} from '@/domain/entities/messaging/Message'

export interface IMessagingRepository {
  getAll(): Promise<Either<DataError, Message[]>>
  getById(id: string): Promise<Either<DataError, Message>>
  create(params: CreateMessageRequest): Promise<Either<DataError, Message>>
  update(id: string, params: UpdateMessageRequest): Promise<Either<DataError, Message>>
  delete(id: string): Promise<Either<DataError, void>>
  send(id: string): Promise<Either<DataError, void>>
  getDeliveries(messageId: string, page?: number, limit?: number): Promise<Either<DataError, PaginatedDeliveries>>
  getDeliveryStats(messageId: string): Promise<Either<DataError, DeliveryStats>>
}
