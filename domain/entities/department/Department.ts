export interface Department {
  id: string
  name: string
  headId: string | null
  memberTarget: number
  description: string | null
  memberCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateDepartmentRequest {
  name: string
  headId?: string
  memberTarget?: number
  description?: string
}

export interface UpdateDepartmentRequest {
  name?: string
  headId?: string | null
  memberTarget?: number
  description?: string
}
