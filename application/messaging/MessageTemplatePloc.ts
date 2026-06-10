import type { StoreApi } from 'zustand'
import { toast } from 'sonner'
import { Ploc } from '@/core/application/ploc'
import type { MessageTemplateState } from './useMessageTemplateState'
import type { GetTemplatesUseCase } from '@/domain/usecases/messaging/GetTemplatesUseCase'
import type { CreateTemplateUseCase } from '@/domain/usecases/messaging/CreateTemplateUseCase'
import type { DeleteTemplateUseCase } from '@/domain/usecases/messaging/DeleteTemplateUseCase'
import type { CreateMessageTemplateRequest } from '@/domain/entities/messaging/MessageTemplate'

export class MessageTemplatePloc extends Ploc<StoreApi<MessageTemplateState>> {
  private readonly getTemplatesUseCase: GetTemplatesUseCase
  private readonly createTemplateUseCase: CreateTemplateUseCase
  private readonly deleteTemplateUseCase: DeleteTemplateUseCase

  constructor({
    store,
    getTemplatesUseCase,
    createTemplateUseCase,
    deleteTemplateUseCase,
  }: {
    store: StoreApi<MessageTemplateState>
    getTemplatesUseCase: GetTemplatesUseCase
    createTemplateUseCase: CreateTemplateUseCase
    deleteTemplateUseCase: DeleteTemplateUseCase
  }) {
    super({ store })
    this.getTemplatesUseCase = getTemplatesUseCase
    this.createTemplateUseCase = createTemplateUseCase
    this.deleteTemplateUseCase = deleteTemplateUseCase
  }

  async fetchAll(): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getTemplatesUseCase.execute()
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (templates) => this.store.setState({ loading: false, templates }),
    )
  }

  async create(params: CreateMessageTemplateRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.createTemplateUseCase.execute(params)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      (created) => {
        this.store.setState((state) => ({
          submitting: false,
          templates: [...state.templates, created],
        }))
        toast.success('Template created')
        return true
      },
    )
  }

  async delete(id: string): Promise<void> {
    const result = await this.deleteTemplateUseCase.execute(id)
    result.fold(
      (error) => toast.error(this.handleError(error)),
      () => {
        this.store.setState((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        }))
        toast.success('Template deleted')
      },
    )
  }
}
