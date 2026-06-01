import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { DepartmentsState } from './useDepartmentsState'
import type { GetDepartmentsUseCase } from '@/domain/usecases/department/GetDepartmentsUseCase'
import type { GetDepartmentByIdUseCase } from '@/domain/usecases/department/GetDepartmentByIdUseCase'
import type { CreateDepartmentUseCase } from '@/domain/usecases/department/CreateDepartmentUseCase'
import type { UpdateDepartmentUseCase } from '@/domain/usecases/department/UpdateDepartmentUseCase'
import type { DeleteDepartmentUseCase } from '@/domain/usecases/department/DeleteDepartmentUseCase'
import type {
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '@/domain/entities/department/Department'

export class DepartmentsPloc extends Ploc<StoreApi<DepartmentsState>> {
  private readonly getDepartmentsUseCase: GetDepartmentsUseCase
  private readonly getDepartmentByIdUseCase: GetDepartmentByIdUseCase
  private readonly createDepartmentUseCase: CreateDepartmentUseCase
  private readonly updateDepartmentUseCase: UpdateDepartmentUseCase
  private readonly deleteDepartmentUseCase: DeleteDepartmentUseCase

  constructor({
    store,
    getDepartmentsUseCase,
    getDepartmentByIdUseCase,
    createDepartmentUseCase,
    updateDepartmentUseCase,
    deleteDepartmentUseCase,
  }: {
    store: StoreApi<DepartmentsState>
    getDepartmentsUseCase: GetDepartmentsUseCase
    getDepartmentByIdUseCase: GetDepartmentByIdUseCase
    createDepartmentUseCase: CreateDepartmentUseCase
    updateDepartmentUseCase: UpdateDepartmentUseCase
    deleteDepartmentUseCase: DeleteDepartmentUseCase
  }) {
    super({ store })
    this.getDepartmentsUseCase = getDepartmentsUseCase
    this.getDepartmentByIdUseCase = getDepartmentByIdUseCase
    this.createDepartmentUseCase = createDepartmentUseCase
    this.updateDepartmentUseCase = updateDepartmentUseCase
    this.deleteDepartmentUseCase = deleteDepartmentUseCase
  }

  async fetchAll(): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getDepartmentsUseCase.execute()
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (departments) => this.store.setState({ loading: false, departments }),
    )
  }

  async fetchById(id: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getDepartmentByIdUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (department) => this.store.setState({ loading: false, selectedDepartment: department }),
    )
  }

  async create(params: CreateDepartmentRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.createDepartmentUseCase.execute(params)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      (department) => {
        this.store.setState((state) => ({
          submitting: false,
          departments: [...state.departments, department],
        }))
        return true
      },
    )
  }

  async update(id: string, params: UpdateDepartmentRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.updateDepartmentUseCase.execute(id, params)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      (updated) => {
        this.store.setState((state) => ({
          submitting: false,
          departments: state.departments.map((d) => (d.id === updated.id ? updated : d)),
          selectedDepartment:
            state.selectedDepartment?.id === updated.id ? updated : state.selectedDepartment,
        }))
        return true
      },
    )
  }

  async delete(id: string): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.deleteDepartmentUseCase.execute(id)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      () => {
        this.store.setState((state) => ({
          submitting: false,
          departments: state.departments.filter((d) => d.id !== id),
          selectedDepartment:
            state.selectedDepartment?.id === id ? null : state.selectedDepartment,
        }))
        return true
      },
    )
  }

  clearError(): void {
    this.store.setState({ error: null })
  }

  selectDepartment(id: string | null): void {
    const department = id
      ? (this.store.getState().departments.find((d) => d.id === id) ?? null)
      : null
    this.store.setState({ selectedDepartment: department })
  }
}
