import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IMessageTemplateRepository } from '@/domain/repository/IMessageTemplateRepository'
import type { MessageTemplate, CreateMessageTemplateRequest } from '@/domain/entities/messaging/MessageTemplate'

export class MessageTemplateRepository extends BaseRepository implements IMessageTemplateRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(): Promise<Either<DataError, MessageTemplate[]>> {
    try {
      const { data } = await this.axios.get<{ data: MessageTemplate[] }>('/api/messaging/templates')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async create(params: CreateMessageTemplateRequest): Promise<Either<DataError, MessageTemplate>> {
    try {
      const { data } = await this.axios.post<{ data: MessageTemplate }>('/api/messaging/templates', params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async delete(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete(`/api/messaging/templates/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
