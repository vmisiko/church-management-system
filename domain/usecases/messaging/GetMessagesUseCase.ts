import type { IMessagingRepository } from '@/domain/repository/IMessagingRepository'

export class GetMessagesUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute() {
    return this.repo.getAll()
  }
}
