import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { DamageReportsState } from './useDamageReportsState'
import type { GetDamageReportsUseCase } from '@/domain/usecases/inventory/GetDamageReportsUseCase'
import type { GetDamageReportByIdUseCase } from '@/domain/usecases/inventory/GetDamageReportByIdUseCase'
import type { CreateDamageReportUseCase } from '@/domain/usecases/inventory/CreateDamageReportUseCase'
import type { UpdateDamageReportUseCase } from '@/domain/usecases/inventory/UpdateDamageReportUseCase'
import type { DeleteDamageReportUseCase } from '@/domain/usecases/inventory/DeleteDamageReportUseCase'
import type {
  CreateDamageReportRequest,
  UpdateDamageReportRequest,
} from '@/domain/entities/inventory/DamageReport'

export class DamageReportsPloc extends Ploc<StoreApi<DamageReportsState>> {
  private readonly getDamageReportsUseCase: GetDamageReportsUseCase
  private readonly getDamageReportByIdUseCase: GetDamageReportByIdUseCase
  private readonly createDamageReportUseCase: CreateDamageReportUseCase
  private readonly updateDamageReportUseCase: UpdateDamageReportUseCase
  private readonly deleteDamageReportUseCase: DeleteDamageReportUseCase

  constructor({
    store,
    getDamageReportsUseCase,
    getDamageReportByIdUseCase,
    createDamageReportUseCase,
    updateDamageReportUseCase,
    deleteDamageReportUseCase,
  }: {
    store: StoreApi<DamageReportsState>
    getDamageReportsUseCase: GetDamageReportsUseCase
    getDamageReportByIdUseCase: GetDamageReportByIdUseCase
    createDamageReportUseCase: CreateDamageReportUseCase
    updateDamageReportUseCase: UpdateDamageReportUseCase
    deleteDamageReportUseCase: DeleteDamageReportUseCase
  }) {
    super({ store })
    this.getDamageReportsUseCase = getDamageReportsUseCase
    this.getDamageReportByIdUseCase = getDamageReportByIdUseCase
    this.createDamageReportUseCase = createDamageReportUseCase
    this.updateDamageReportUseCase = updateDamageReportUseCase
    this.deleteDamageReportUseCase = deleteDamageReportUseCase
  }

  async fetchAll(): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getDamageReportsUseCase.execute()
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (reports) => this.store.setState({ loading: false, reports }),
    )
  }

  async fetchById(id: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getDamageReportByIdUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (report) => this.store.setState({ loading: false, selectedReport: report }),
    )
  }

  async create(params: CreateDamageReportRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.createDamageReportUseCase.execute(params)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      (report) => {
        this.store.setState((state) => ({
          submitting: false,
          reports: [...state.reports, report],
        }))
        return true
      },
    )
  }

  async update(id: string, params: UpdateDamageReportRequest): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.updateDamageReportUseCase.execute(id, params)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      (updated) => {
        this.store.setState((state) => ({
          submitting: false,
          reports: state.reports.map((r) => (r.id === updated.id ? updated : r)),
          selectedReport:
            state.selectedReport?.id === updated.id ? updated : state.selectedReport,
        }))
        return true
      },
    )
  }

  async delete(id: string): Promise<boolean> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.deleteDamageReportUseCase.execute(id)
    return result.fold(
      (error) => {
        this.store.setState({ submitting: false, error: this.handleError(error) })
        return false
      },
      () => {
        this.store.setState((state) => ({
          submitting: false,
          reports: state.reports.filter((r) => r.id !== id),
          selectedReport: state.selectedReport?.id === id ? null : state.selectedReport,
        }))
        return true
      },
    )
  }

  clearError(): void {
    this.store.setState({ error: null })
  }

  selectReport(id: string | null): void {
    const report = id ? (this.store.getState().reports.find((r) => r.id === id) ?? null) : null
    this.store.setState({ selectedReport: report })
  }
}
