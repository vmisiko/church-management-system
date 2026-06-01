import type { IMemberRepository } from '@/domain/repository/IMemberRepository'
import type { UpdateMemberRequest } from '@/domain/entities/member/Member'

export class UpdateMemberUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute(id: string, data: UpdateMemberRequest) {
    return this.repo.update(id, data)
  }
}
