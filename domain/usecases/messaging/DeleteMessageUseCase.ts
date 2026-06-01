import type { IMessagingRepository } from '@/domain/repository/IMessagingRepository'

export class DeleteMessageUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(id: string) {
    return this.repo.delete(id)
  }
}
