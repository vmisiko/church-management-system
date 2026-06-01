import type { IMessagingRepository } from '@/domain/repository/IMessagingRepository'

export class GetDeliveryStatsUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(messageId: string) {
    return this.repo.getDeliveryStats(messageId)
  }
}
