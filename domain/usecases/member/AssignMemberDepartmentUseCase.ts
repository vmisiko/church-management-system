import type { IMemberRepository } from '@/domain/repository/IMemberRepository'

export class AssignMemberDepartmentUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute(memberId: string, departmentId: string) {
    return this.repo.assignDepartment(memberId, departmentId)
  }
}
