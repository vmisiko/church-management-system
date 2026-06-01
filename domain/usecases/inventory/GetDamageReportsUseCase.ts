import type { IDamageReportRepository } from '@/domain/repository/IDamageReportRepository'

export class GetDamageReportsUseCase {
  constructor(private readonly repo: IDamageReportRepository) {}

  execute() {
    return this.repo.getAll()
  }
}
