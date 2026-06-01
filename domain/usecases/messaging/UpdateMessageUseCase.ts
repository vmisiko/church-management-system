import type { IMessagingRepository } from '@/domain/repository/IMessagingRepository'
import type { UpdateMessageRequest } from '@/domain/entities/messaging/Message'

export class UpdateMessageUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(id: string, params: UpdateMessageRequest) {
    return this.repo.update(id, params)
  }
}
