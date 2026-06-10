import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { MembersState } from './useMembersState'
import type { GetMembersUseCase } from '@/domain/usecases/member/GetMembersUseCase'
import type { GetMemberByIdUseCase } from '@/domain/usecases/member/GetMemberByIdUseCase'
import type { CreateMemberUseCase } from '@/domain/usecases/member/CreateMemberUseCase'
import type { UpdateMemberUseCase } from '@/domain/usecases/member/UpdateMemberUseCase'
import type { DeleteMemberUseCase } from '@/domain/usecases/member/DeleteMemberUseCase'
import type { GetMemberDepartmentsUseCase } from '@/domain/usecases/member/GetMemberDepartmentsUseCase'
import type { AssignMemberDepartmentUseCase } from '@/domain/usecases/member/AssignMemberDepartmentUseCase'
import type { RemoveMemberDepartmentUseCase } from '@/domain/usecases/member/RemoveMemberDepartmentUseCase'
import type { CreateMemberRequest, UpdateMemberRequest, MemberQueryParams, BulkImportRow } from '@/domain/entities/member/Member'
import type { BulkImportMembersUseCase } from '@/domain/usecases/member/BulkImportMembersUseCase'
import type { PreviewBulkImportUseCase } from '@/domain/usecases/member/PreviewBulkImportUseCase'

export class MembersPloc extends Ploc<StoreApi<MembersState>> {
  private readonly getMembersUseCase: GetMembersUseCase
  private readonly getMemberByIdUseCase: GetMemberByIdUseCase
  private readonly createMemberUseCase: CreateMemberUseCase
  private readonly updateMemberUseCase: UpdateMemberUseCase
  private readonly deleteMemberUseCase: DeleteMemberUseCase
  private readonly getMemberDepartmentsUseCase: GetMemberDepartmentsUseCase
  private readonly assignMemberDepartmentUseCase: AssignMemberDepartmentUseCase
  private readonly removeMemberDepartmentUseCase: RemoveMemberDepartmentUseCase
  private readonly bulkImportMembersUseCase: BulkImportMembersUseCase
  private readonly previewBulkImportUseCase: PreviewBulkImportUseCase

  constructor({
    store,
    getMembersUseCase,
    getMemberByIdUseCase,
    createMemberUseCase,
    updateMemberUseCase,
    deleteMemberUseCase,
    getMemberDepartmentsUseCase,
    assignMemberDepartmentUseCase,
    removeMemberDepartmentUseCase,
    bulkImportMembersUseCase,
    previewBulkImportUseCase,
  }: {
    store: StoreApi<MembersState>
    getMembersUseCase: GetMembersUseCase
    getMemberByIdUseCase: GetMemberByIdUseCase
    createMemberUseCase: CreateMemberUseCase
    updateMemberUseCase: UpdateMemberUseCase
    deleteMemberUseCase: DeleteMemberUseCase
    getMemberDepartmentsUseCase: GetMemberDepartmentsUseCase
    assignMemberDepartmentUseCase: AssignMemberDepartmentUseCase
    removeMemberDepartmentUseCase: RemoveMemberDepartmentUseCase
    bulkImportMembersUseCase: BulkImportMembersUseCase
    previewBulkImportUseCase: PreviewBulkImportUseCase
  }) {
    super({ store })
    this.getMembersUseCase = getMembersUseCase
    this.getMemberByIdUseCase = getMemberByIdUseCase
    this.createMemberUseCase = createMemberUseCase
    this.updateMemberUseCase = updateMemberUseCase
    this.deleteMemberUseCase = deleteMemberUseCase
    this.getMemberDepartmentsUseCase = getMemberDepartmentsUseCase
    this.assignMemberDepartmentUseCase = assignMemberDepartmentUseCase
    this.removeMemberDepartmentUseCase = removeMemberDepartmentUseCase
    this.bulkImportMembersUseCase = bulkImportMembersUseCase
    this.previewBulkImportUseCase = previewBulkImportUseCase
  }

  async fetchAll(params?: MemberQueryParams): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getMembersUseCase.execute(params)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (members) => this.store.setState({ loading: false, members }),
    )
  }

  async fetchById(id: string): Promise<void> {
    this.store.setState({ drawerLoading: true, error: null })
    const result = await this.getMemberByIdUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ drawerLoading: false, error: this.handleError(error) }),
      (currentMember) => this.store.setState({ drawerLoading: false, currentMember }),
    )
  }

  async create(data: CreateMemberRequest): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.createMemberUseCase.execute(data)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (member) => {
        const current = this.store.getState().members
        this.store.setState({ submitting: false, members: [member, ...current] })
      },
    )
  }

  async update(id: string, data: UpdateMemberRequest): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.updateMemberUseCase.execute(id, data)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (updated) => {
        const members = this.store.getState().members.map((m) => (m.id === id ? updated : m))
        const currentMember =
          this.store.getState().currentMember?.id === id
            ? updated
            : this.store.getState().currentMember
        this.store.setState({ submitting: false, members, currentMember })
      },
    )
  }

  async delete(id: string): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.deleteMemberUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      () => {
        const members = this.store.getState().members.filter((m) => m.id !== id)
        const currentMember =
          this.store.getState().currentMember?.id === id
            ? null
            : this.store.getState().currentMember
        this.store.setState({ submitting: false, members, currentMember })
      },
    )
  }

  async fetchDepartments(memberId: string): Promise<void> {
    this.store.setState({ drawerLoading: true, error: null })
    const result = await this.getMemberDepartmentsUseCase.execute(memberId)
    result.fold(
      (error) => this.store.setState({ drawerLoading: false, error: this.handleError(error) }),
      (memberDepartments) => this.store.setState({ drawerLoading: false, memberDepartments }),
    )
  }

  async assignDepartment(memberId: string, departmentId: string): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.assignMemberDepartmentUseCase.execute(memberId, departmentId)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      async () => {
        this.store.setState({ submitting: false })
        await this.fetchDepartments(memberId)
      },
    )
  }

  async removeDepartment(memberId: string, departmentId: string): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.removeMemberDepartmentUseCase.execute(memberId, departmentId)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      async () => {
        this.store.setState({ submitting: false })
        await this.fetchDepartments(memberId)
      },
    )
  }

  async bulkImport(rows: BulkImportRow[]): Promise<boolean> {
    this.store.setState({ bulkImporting: true, error: null, bulkImportResult: null })
    const result = await this.bulkImportMembersUseCase.execute(rows)
    let success = false
    result.fold(
      (error) => this.store.setState({ bulkImporting: false, error: this.handleError(error) }),
      (bulkImportResult) => {
        success = true
        const current = this.store.getState().members
        this.store.setState({
          bulkImporting: false,
          bulkImportResult,
          members: [...bulkImportResult.members, ...current],
        })
      },
    )
    return success
  }

  async previewBulkImport(file: File): Promise<boolean> {
    this.store.setState({ bulkPreviewing: true, error: null })
    const result = await this.previewBulkImportUseCase.execute(file)
    let success = false
    result.fold(
      (error) => this.store.setState({ bulkPreviewing: false, error: this.handleError(error) }),
      (response) => {
        success = true
        this.store.setState({ bulkPreviewing: false, bulkPreviewRows: response.rows })
      },
    )
    return success
  }
}
