import type { IMessagingRepository } from '@/domain/repository/IMessagingRepository'

export class SendMessageUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(id: string) {
    return this.repo.send(id)
  }
}
