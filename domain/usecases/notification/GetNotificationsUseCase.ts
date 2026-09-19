import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { NotificationsResponse } from "@/domain/entities/notification/Notification"
import type { INotificationRepository } from "@/domain/repository/INotificationRepository"

export class GetNotificationsUseCase {
  constructor(private readonly repo: INotificationRepository) {}
  execute(): Promise<Either<DataError, NotificationsResponse>> { return this.repo.getAll() }
}
