import type { IDepartmentRepository } from '@/domain/repository/IDepartmentRepository'

export class GetDepartmentsUseCase {
  constructor(private readonly repo: IDepartmentRepository) {}

  execute() {
    return this.repo.getAll()
  }
}
