export interface InventoryCategory {
  id: string
  name: string
  departmentId: string | null
  leaderId: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  departmentId?: string
  leaderId?: string | null
}

export interface UpdateCategoryRequest {
  name?: string
  departmentId?: string | null
  leaderId?: string | null
}
