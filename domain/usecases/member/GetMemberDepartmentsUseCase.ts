import type { IMemberRepository } from '@/domain/repository/IMemberRepository'

export class GetMemberDepartmentsUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute(memberId: string) {
    return this.repo.getDepartments(memberId)
  }
}
