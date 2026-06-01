import type { IDepartmentRepository } from '@/domain/repository/IDepartmentRepository'
import type { CreateDepartmentRequest } from '@/domain/entities/department/Department'

export class CreateDepartmentUseCase {
  constructor(private readonly repo: IDepartmentRepository) {}

  execute(params: CreateDepartmentRequest) {
    return this.repo.create(params)
  }
}
