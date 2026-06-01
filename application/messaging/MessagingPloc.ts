import type { StoreApi } from 'zustand'
import { toast } from 'sonner'
import { Ploc } from '@/core/application/ploc'
import type { MessagingState } from './useMessagingState'
import type { GetMessagesUseCase } from '@/domain/usecases/messaging/GetMessagesUseCase'
import type { GetMessageByIdUseCase } from '@/domain/usecases/messaging/GetMessageByIdUseCase'
import type { CreateMessageUseCase } from '@/domain/usecases/messaging/CreateMessageUseCase'
import type { UpdateMessageUseCase } from '@/domain/usecases/messaging/UpdateMessageUseCase'
import type { DeleteMessageUseCase } from '@/domain/usecases/messaging/DeleteMessageUseCase'
import type { SendMessageUseCase } from '@/domain/usecases/messaging/SendMessageUseCase'
import type { GetDeliveriesUseCase } from '@/domain/usecases/messaging/GetDeliveriesUseCase'
import type { GetDeliveryStatsUseCase } from '@/domain/usecases/messaging/GetDeliveryStatsUseCase'
import type { CreateMessageRequest, UpdateMessageRequest } from '@/domain/entities/messaging/Message'

export class MessagingPloc extends Ploc<StoreApi<MessagingState>> {
  private readonly getMessagesUseCase: GetMessagesUseCase
  private readonly getMessageByIdUseCase: GetMessageByIdUseCase
  private readonly createMessageUseCase: CreateMessageUseCase
  private readonly updateMessageUseCase: UpdateMessageUseCase
  private readonly deleteMessageUseCase: DeleteMessageUseCase
  private readonly sendMessageUseCase: SendMessageUseCase
  private readonly getDeliveriesUseCase: GetDeliveriesUseCase
  private readonly getDeliveryStatsUseCase: GetDeliveryStatsUseCase

  constructor({
    store,
    getMessagesUseCase,
    getMessageByIdUseCase,
    createMessageUseCase,
    updateMessageUseCase,
    deleteMessageUseCase,
    sendMessageUseCase,
    getDeliveriesUseCase,
    getDeliveryStatsUseCase,
  }: {
    store: StoreApi<MessagingState>
    getMessagesUseCase: GetMessagesUseCase
    getMessageByIdUseCase: GetMessageByIdUseCase
    createMessageUseCase: CreateMessageUseCase
    updateMessageUseCase: UpdateMessageUseCase
    deleteMessageUseCase: DeleteMessageUseCase
    sendMessageUseCase: SendMessageUseCase
    getDeliveriesUseCase: GetDeliveriesUseCase
    getDeliveryStatsUseCase: GetDeliveryStatsUseCase
  }) {
    super({ store })
    this.getMessagesUseCase = getMessagesUseCase
    this.getMessageByIdUseCase = getMessageByIdUseCase
    this.createMessageUseCase = createMessageUseCase
    this.updateMessageUseCase = updateMessageUseCase
    this.deleteMessageUseCase = deleteMessageUseCase
    this.sendMessageUseCase = sendMessageUseCase
    this.getDeliveriesUseCase = getDeliveriesUseCase
    this.getDeliveryStatsUseCase = getDeliveryStatsUseCase
  }

  async fetchAll(): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getMessagesUseCase.execute()
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (messages) => this.store.setState({ loading: false, messages }),
    )
  }

  async fetchById(id: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getMessageByIdUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (currentMessage) => this.store.setState({ loading: false, currentMessage }),
    )
  }

  async create(params: CreateMessageRequest): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.createMessageUseCase.execute(params)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (created) =>
        this.store.setState((state) => ({
          submitting: false,
          messages: [created, ...state.messages],
        })),
    )
  }

  async update(id: string, params: UpdateMessageRequest): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.updateMessageUseCase.execute(id, params)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (updated) =>
        this.store.setState((state) => ({
          submitting: false,
          messages: state.messages.map((m) => (m.id === id ? updated : m)),
          currentMessage: state.currentMessage?.id === id ? updated : state.currentMessage,
        })),
    )
  }

  async delete(id: string): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.deleteMessageUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      () =>
        this.store.setState((state) => ({
          submitting: false,
          messages: state.messages.filter((m) => m.id !== id),
          currentMessage: state.currentMessage?.id === id ? null : state.currentMessage,
        })),
    )
  }

  async send(id: string): Promise<void> {
    this.store.setState({ sending: true, error: null })
    const result = await this.sendMessageUseCase.execute(id)
    await result.fold(
      async (error) => {
        const message = this.handleError(error)
        this.store.setState({ sending: false, error: message })
        toast.error(message)
      },
      async () => {
        // Refresh the message to reflect updated status after send
        const refreshResult = await this.getMessageByIdUseCase.execute(id)
        refreshResult.fold(
          () => this.store.setState({ sending: false }),
          (refreshed) =>
            this.store.setState((state) => ({
              sending: false,
              messages: state.messages.map((m) => (m.id === id ? refreshed : m)),
              currentMessage: state.currentMessage?.id === id ? refreshed : state.currentMessage,
            })),
        )
        toast.success('Message sent successfully')
      },
    )
  }

  async fetchDeliveries(messageId: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getDeliveriesUseCase.execute(messageId)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (deliveries) => this.store.setState({ loading: false, deliveries }),
    )
  }

  async fetchDeliveryStats(messageId: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getDeliveryStatsUseCase.execute(messageId)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (deliveryStats) => this.store.setState({ loading: false, deliveryStats }),
    )
  }
}
