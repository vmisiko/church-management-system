import type { IDamageReportRepository } from '@/domain/repository/IDamageReportRepository'

export class GetDamageReportByIdUseCase {
  constructor(private readonly repo: IDamageReportRepository) {}

  execute(id: string) {
    return this.repo.getById(id)
  }
}
