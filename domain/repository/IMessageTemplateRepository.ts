import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { MessageTemplate, CreateMessageTemplateRequest } from '@/domain/entities/messaging/MessageTemplate'

export interface IMessageTemplateRepository {
  getAll(): Promise<Either<DataError, MessageTemplate[]>>
  create(params: CreateMessageTemplateRequest): Promise<Either<DataError, MessageTemplate>>
  delete(id: string): Promise<Either<DataError, void>>
}
