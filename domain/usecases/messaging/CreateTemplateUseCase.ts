import type { IMessageTemplateRepository } from '@/domain/repository/IMessageTemplateRepository'
import type { CreateMessageTemplateRequest } from '@/domain/entities/messaging/MessageTemplate'

export class CreateTemplateUseCase {
  constructor(private readonly repo: IMessageTemplateRepository) {}
  execute(params: CreateMessageTemplateRequest) {
    return this.repo.create(params)
  }
}
