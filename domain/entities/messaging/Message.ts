export type MessageChannel = 'sms' | 'email'
export type MessageStatus = 'pending' | 'delivered' | 'failed'
export type DeliveryStatus = 'pending' | 'delivered' | 'failed'

export interface Message {
  id: string
  title: string
  channel: MessageChannel
  subject: string | null
  content: string
  sentAt: string | null
  sentBy: string
  status: MessageStatus
  recipientCount: number
  deliveryRate: number | null
  createdAt: string
}

export interface CreateMessageRequest {
  title: string
  channel: MessageChannel
  subject?: string
  content: string
}

export interface UpdateMessageRequest {
  title?: string
  subject?: string
  content?: string
}

export interface MessageDelivery {
  id: string
  messageId: string
  memberId: string
  memberName: string
  phone: string
  text: string
  status: DeliveryStatus
  uwaziRef: string | null
  failureReason: string | null
  sentAt: string | null
  deliveredAt: string | null
  createdAt: string
  updatedAt: string
}

export interface DeliveryStats {
  total: number
  pending: number
  delivered: number
  failed: number
  deliveryRate: number
}
