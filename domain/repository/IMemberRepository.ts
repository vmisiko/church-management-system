import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { Member, CreateMemberRequest, UpdateMemberRequest, MemberDepartment, MemberQueryParams, BulkImportRow, BulkImportResult, BulkPreviewResponse } from '@/domain/entities/member/Member'

export interface IMemberRepository {
  getAll(params?: MemberQueryParams): Promise<Either<DataError, Member[]>>
  getById(id: string): Promise<Either<DataError, Member>>
  create(data: CreateMemberRequest): Promise<Either<DataError, Member>>
  update(id: string, data: UpdateMemberRequest): Promise<Either<DataError, Member>>
  delete(id: string): Promise<Either<DataError, void>>
  getDepartments(memberId: string): Promise<Either<DataError, MemberDepartment[]>>
  assignDepartment(memberId: string, departmentId: string): Promise<Either<DataError, void>>
  removeDepartment(memberId: string, departmentId: string): Promise<Either<DataError, void>>
  bulkImport(rows: BulkImportRow[]): Promise<Either<DataError, BulkImportResult>>
  previewBulkImport(file: File): Promise<Either<DataError, BulkPreviewResponse>>
}
