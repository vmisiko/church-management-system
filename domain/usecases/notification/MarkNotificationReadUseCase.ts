import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { AppNotification } from "@/domain/entities/notification/Notification"
import type { INotificationRepository } from "@/domain/repository/INotificationRepository"

export class MarkNotificationReadUseCase {
  constructor(private readonly repo: INotificationRepository) {}
  execute(id: string): Promise<Either<DataError, AppNotification>> { return this.repo.markRead(id) }
}
