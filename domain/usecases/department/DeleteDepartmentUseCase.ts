import type { IDepartmentRepository } from '@/domain/repository/IDepartmentRepository'

export class DeleteDepartmentUseCase {
  constructor(private readonly repo: IDepartmentRepository) {}

  execute(id: string) {
    return this.repo.delete(id)
  }
}
