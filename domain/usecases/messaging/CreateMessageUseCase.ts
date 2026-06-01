import type { IMessagingRepository } from '@/domain/repository/IMessagingRepository'
import type { CreateMessageRequest } from '@/domain/entities/messaging/Message'

export class CreateMessageUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(params: CreateMessageRequest) {
    return this.repo.create(params)
  }
}
