export type UserRole = 'super_admin' | 'admin' | 'staff'

export interface User {
  id: string
  email: string
  role: UserRole
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  role?: UserRole
  isActive?: boolean
  password?: string
}
