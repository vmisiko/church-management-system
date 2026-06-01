import type { IMessagingRepository } from '@/domain/repository/IMessagingRepository'

export class GetMessageByIdUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(id: string) {
    return this.repo.getById(id)
  }
}
