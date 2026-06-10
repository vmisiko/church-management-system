import type { IMessageTemplateRepository } from '@/domain/repository/IMessageTemplateRepository'

export class DeleteTemplateUseCase {
  constructor(private readonly repo: IMessageTemplateRepository) {}
  execute(id: string) {
    return this.repo.delete(id)
  }
}
