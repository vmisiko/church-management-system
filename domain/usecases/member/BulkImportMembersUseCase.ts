import type { IMemberRepository } from '@/domain/repository/IMemberRepository'
import type { BulkImportRow } from '@/domain/entities/member/Member'

export class BulkImportMembersUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute(rows: BulkImportRow[]) {
    return this.repo.bulkImport(rows)
  }
}
