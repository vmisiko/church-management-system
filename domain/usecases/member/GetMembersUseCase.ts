import type { IMemberRepository } from '@/domain/repository/IMemberRepository'
import type { MemberQueryParams } from '@/domain/entities/member/Member'

export class GetMembersUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute(params?: MemberQueryParams) {
    return this.repo.getAll(params)
  }
}
