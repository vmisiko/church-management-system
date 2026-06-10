import { create } from 'zustand'
import type { MessageTemplate } from '@/domain/entities/messaging/MessageTemplate'

export interface MessageTemplateState {
  templates: MessageTemplate[]
  loading: boolean
  submitting: boolean
  error: string | null
}

const useMessageTemplateState = create<MessageTemplateState>()(() => ({
  templates: [],
  loading: false,
  submitting: false,
  error: null,
}))

export default useMessageTemplateState
