import type { IMemberRepository } from '@/domain/repository/IMemberRepository'

export class PreviewBulkImportUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute(file: File) {
    return this.repo.previewBulkImport(file)
  }
}
