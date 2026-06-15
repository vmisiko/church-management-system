export type ItemRequestStatus = 'pending' | 'approved' | 'rejected' | 'returned'

export interface ItemRequest {
  id: string
  requester: string
  requesterAvatar: string
  itemId: string
  itemName: string
  quantity: number
  reason: string | null
  requestDate: string
  returnDate: string
  status: ItemRequestStatus
  createdAt: string
  updatedAt: string
}

export interface CreateItemRequestInput {
  requester: string
  itemId: string
  quantity: number
  requestDate: string
  returnDate: string
  reason?: string
}
