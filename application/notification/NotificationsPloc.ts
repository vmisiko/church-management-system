import type { StoreApi } from "zustand"
import { Ploc } from "@/core/application/ploc"
import type { NotificationsState } from "./useNotificationsState"
import type { GetNotificationsUseCase } from "@/domain/usecases/notification/GetNotificationsUseCase"
import type { MarkNotificationReadUseCase } from "@/domain/usecases/notification/MarkNotificationReadUseCase"

export class NotificationsPloc extends Ploc<StoreApi<NotificationsState>> {
  private readonly getNotificationsUseCase: GetNotificationsUseCase
  private readonly markNotificationReadUseCase: MarkNotificationReadUseCase

  constructor({
    store,
    getNotificationsUseCase,
    markNotificationReadUseCase,
  }: {
    store: StoreApi<NotificationsState>
    getNotificationsUseCase: GetNotificationsUseCase
    markNotificationReadUseCase: MarkNotificationReadUseCase
  }) {
    super({ store })
    this.getNotificationsUseCase = getNotificationsUseCase
    this.markNotificationReadUseCase = markNotificationReadUseCase
  }

  async fetchAll(): Promise<void> {
    if (this.store.getState().loading) return
    this.store.setState({ loading: true, error: null })
    const result = await this.getNotificationsUseCase.execute()
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      ({ notifications, unreadCount }) => this.store.setState({ loading: false, notifications, unreadCount }),
    )
  }

  async markRead(id: string): Promise<void> {
    const result = await this.markNotificationReadUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ error: this.handleError(error) }),
      (updated) => {
        const notifications = this.store.getState().notifications.map((n) => (n.id === id ? updated : n))
        const unreadCount = notifications.filter((n) => !n.readAt).length
        this.store.setState({ notifications, unreadCount })
      },
    )
  }
}
