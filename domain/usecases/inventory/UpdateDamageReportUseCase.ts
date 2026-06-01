import type { IDamageReportRepository } from '@/domain/repository/IDamageReportRepository'
import type { UpdateDamageReportRequest } from '@/domain/entities/inventory/DamageReport'

export class UpdateDamageReportUseCase {
  constructor(private readonly repo: IDamageReportRepository) {}

  execute(id: string, params: UpdateDamageReportRequest) {
    return this.repo.update(id, params)
  }
}
