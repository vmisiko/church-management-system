import type { IMessagingRepository } from '@/domain/repository/IMessagingRepository'

export class GetDeliveriesUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(messageId: string, page?: number, limit?: number) {
    return this.repo.getDeliveries(messageId, page, limit)
  }
}
