import type { IMessagingRepository } from '@/domain/repository/IMessagingRepository'

export class GetDeliveriesUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(messageId: string) {
    return this.repo.getDeliveries(messageId)
  }
}
