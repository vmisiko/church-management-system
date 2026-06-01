export interface InventoryCategory {
  id: string
  name: string
  departmentId: string | null
  leaderName: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  departmentId?: string
  leaderName?: string
}

export interface UpdateCategoryRequest {
  name?: string
  departmentId?: string | null
  leaderName?: string | null
}
