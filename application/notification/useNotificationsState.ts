import { create } from "zustand"
import type { AppNotification } from "@/domain/entities/notification/Notification"

export interface NotificationsState { notifications: AppNotification[]; unreadCount: number; loading: boolean; error: string | null }
const useNotificationsState = create<NotificationsState>(() => ({ notifications: [], unreadCount: 0, loading: false, error: null }))
export default useNotificationsState
