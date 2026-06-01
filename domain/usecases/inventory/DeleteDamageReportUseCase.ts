import type { IDamageReportRepository } from '@/domain/repository/IDamageReportRepository'

export class DeleteDamageReportUseCase {
  constructor(private readonly repo: IDamageReportRepository) {}

  execute(id: string) {
    return this.repo.delete(id)
  }
}
