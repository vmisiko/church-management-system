import type { IMemberRepository } from '@/domain/repository/IMemberRepository'

export class GetMemberEngagementUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute(memberId: string) {
    return this.repo.getEngagement(memberId)
  }
}
