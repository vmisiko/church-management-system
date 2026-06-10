import type { IMessageTemplateRepository } from '@/domain/repository/IMessageTemplateRepository'

export class GetTemplatesUseCase {
  constructor(private readonly repo: IMessageTemplateRepository) {}
  execute() {
    return this.repo.getAll()
  }
}
