import type { IDamageReportRepository } from '@/domain/repository/IDamageReportRepository'
import type { CreateDamageReportRequest } from '@/domain/entities/inventory/DamageReport'

export class CreateDamageReportUseCase {
  constructor(private readonly repo: IDamageReportRepository) {}

  execute(params: CreateDamageReportRequest) {
    return this.repo.create(params)
  }
}
