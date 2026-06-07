export type MessageType = 'announcement' | 'newsletter' | 'reminder' | 'alert'
export type MessageTargetGroup = 'all' | 'fellowship' | 'department' | 'zone'
export type MessageStatus = 'draft' | 'sent'
export type DeliveryStatus = 'pending' | 'sent' | 'delivered' | 'failed'

export interface Message {
  id: string
  title: string
  body: string
  type: MessageType
  targetGroup: MessageTargetGroup
  targetId: string | null
  status: MessageStatus
  scheduledAt: string | null
  sentAt: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateMessageRequest {
  title: string
  body: string
  type: MessageType
  targetGroup: MessageTargetGroup
  targetId?: string | null
  scheduledAt?: string | null
}

export interface UpdateMessageRequest {
  title?: string
  body?: string
  type?: MessageType
  targetGroup?: MessageTargetGroup
  targetId?: string | null
  scheduledAt?: string | null
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
  sent: number
  delivered: number
  failed: number
}
