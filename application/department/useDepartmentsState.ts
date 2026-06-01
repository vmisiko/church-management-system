import { create } from 'zustand'
import type { Department } from '@/domain/entities/department/Department'

export interface DepartmentsState {
  departments: Department[]
  selectedDepartment: Department | null
  loading: boolean
  submitting: boolean
  error: string | null
}

const useDepartmentsState = create<DepartmentsState>(
  (): DepartmentsState => ({
    departments: [],
    selectedDepartment: null,
    loading: false,
    submitting: false,
    error: null,
  }),
)

export default useDepartmentsState
