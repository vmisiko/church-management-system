import type { IMemberRepository } from '@/domain/repository/IMemberRepository'
import type { CreateMemberRequest } from '@/domain/entities/member/Member'

export class CreateMemberUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute(data: CreateMemberRequest) {
    return this.repo.create(data)
  }
}
