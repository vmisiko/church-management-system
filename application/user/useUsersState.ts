import { create } from 'zustand'
import type { User } from '@/domain/entities/user/User'

export interface UsersState {
  users: User[]
  selectedUser: User | null
  loading: boolean
  submitting: boolean
  error: string | null
}

const useUsersState = create<UsersState>()(() => ({
  users: [],
  selectedUser: null,
  loading: false,
  submitting: false,
  error: null,
}))

export default useUsersState
