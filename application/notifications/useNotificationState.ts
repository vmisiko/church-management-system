import { create } from 'zustand'

interface NotificationState {
  unreadCount: number
}

const useNotificationState = create<NotificationState>()(() => ({
  unreadCount: 0,
}))

export function clearNotificationPersistence() {
  useNotificationState.setState({ unreadCount: 0 })
}

export default useNotificationState
