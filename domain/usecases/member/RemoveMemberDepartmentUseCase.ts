import type { IMemberRepository } from '@/domain/repository/IMemberRepository'

export class RemoveMemberDepartmentUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute(memberId: string, departmentId: string) {
    return this.repo.removeDepartment(memberId, departmentId)
  }
}
