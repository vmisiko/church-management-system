import type { IDepartmentRepository } from '@/domain/repository/IDepartmentRepository'
import type { UpdateDepartmentRequest } from '@/domain/entities/department/Department'

export class UpdateDepartmentUseCase {
  constructor(private readonly repo: IDepartmentRepository) {}

  execute(id: string, params: UpdateDepartmentRequest) {
    return this.repo.update(id, params)
  }
}
