export interface AppNotification {
  id: string
  userId: string
  title: string
  body: string
  link: string | null
  readAt: string | null
  createdAt: string
}

export interface NotificationsResponse {
  notifications: AppNotification[]
  unreadCount: number
}
