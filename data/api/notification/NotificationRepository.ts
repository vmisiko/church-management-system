import { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import { BaseRepository } from "@/core/data/repository/BaseRepository"
import { mapToDataError } from "@/core/utility/mapToDataError"
import type CustomAxios from "@/core/utility/CustomAxios"
import type { INotificationRepository } from "@/domain/repository/INotificationRepository"
import type { AppNotification, NotificationsResponse } from "@/domain/entities/notification/Notification"

export class NotificationRepository extends BaseRepository implements INotificationRepository {
  constructor({ axios }: { axios: CustomAxios }) { super({ axios }) }
  async getAll(): Promise<Either<DataError, NotificationsResponse>> { try { const { data } = await this.axios.get<NotificationsResponse>("/api/notifications"); return Either.right(data) } catch (error) { return Either.left(mapToDataError(error)) } }
  async markRead(id: string): Promise<Either<DataError, AppNotification>> { try { const { data } = await this.axios.patch<AppNotification>(`/api/notifications/${id}/read`); return Either.right(data) } catch (error) { return Either.left(mapToDataError(error)) } }
}
