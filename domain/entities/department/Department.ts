export interface Department {
  id: string
  name: string
  headId: string | null
  memberTarget: number
  annualBudget: number
  budgetSpent: number
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateDepartmentRequest {
  name: string
  headId?: string
  memberTarget?: number
  annualBudget?: number
  description?: string
}

export interface UpdateDepartmentRequest {
  name?: string
  headId?: string | null
  memberTarget?: number
  annualBudget?: number
  budgetSpent?: number
  description?: string
}
