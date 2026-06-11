import { create } from 'zustand'

export interface MessageRecipient {
  id: string
  firstName: string
  lastName: string
  phone: string | null
}

interface MessageRecipientsState {
  recipients: MessageRecipient[]
  setRecipients: (members: MessageRecipient[]) => void
  removeRecipient: (id: string) => void
  clear: () => void
}

const useMessageRecipientsStore = create<MessageRecipientsState>((set) => ({
  recipients: [],
  setRecipients: (recipients) => set({ recipients }),
  removeRecipient: (id) => set((s) => ({ recipients: s.recipients.filter((r) => r.id !== id) })),
  clear: () => set({ recipients: [] }),
}))

export default useMessageRecipientsStore
