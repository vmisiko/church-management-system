import { create } from 'zustand'
import type { Message, MessageDelivery, DeliveryStats } from '@/domain/entities/messaging/Message'

export interface MessagingState {
  messages: Message[]
  currentMessage: Message | null
  deliveries: MessageDelivery[]
  deliveryStats: DeliveryStats | null
  loading: boolean
  submitting: boolean
  sending: boolean
  error: string | null
}

const useMessagingState = create<MessagingState>()(() => ({
  messages: [],
  currentMessage: null,
  deliveries: [],
  deliveryStats: null,
  loading: false,
  submitting: false,
  sending: false,
  error: null,
}))

export default useMessagingState
