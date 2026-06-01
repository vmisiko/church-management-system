import type { IDepartmentRepository } from '@/domain/repository/IDepartmentRepository'

export class GetDepartmentByIdUseCase {
  constructor(private readonly repo: IDepartmentRepository) {}

  execute(id: string) {
    return this.repo.getById(id)
  }
}
