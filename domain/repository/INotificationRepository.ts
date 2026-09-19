import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { AppNotification, NotificationsResponse } from "@/domain/entities/notification/Notification"

export interface INotificationRepository {
  getAll(): Promise<Either<DataError, NotificationsResponse>>
  markRead(id: string): Promise<Either<DataError, AppNotification>>
}
