import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IMemberRepository } from '@/domain/repository/IMemberRepository'
import type {
  Member,
  MembersPage,
  CreateMemberRequest,
  UpdateMemberRequest,
  MemberDepartment,
  MemberQueryParams,
  BulkImportRow,
  BulkImportResult,
  BulkPreviewResponse,
} from '@/domain/entities/member/Member'

interface MembersListResponse {
  data: Member[]
  total: number
}

export class MemberRepository extends BaseRepository implements IMemberRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(params?: MemberQueryParams): Promise<Either<DataError, MembersPage>> {
    try {
      const query: Record<string, string> = {}
      if (params?.status) query.status = params.status
      if (params?.hasFellowship !== undefined) query.hasFellowship = String(params.hasFellowship)
      if (params?.fellowshipId) query.fellowshipId = params.fellowshipId
      if (params?.departmentId) query.departmentId = params.departmentId
      if (params?.memberType) query.memberType = params.memberType
      if (params?.activityStatus) query.activityStatus = params.activityStatus
      if (params?.joinDateRange) query.joinDateRange = params.joinDateRange
      if (params?.search) query.search = params.search
      if (params?.page) query.page = String(params.page)
      if (params?.limit) query.limit = String(params.limit)
      const { data } = await this.axios.get<MembersListResponse>('/api/members', { params: query })
      const response = data as unknown as MembersListResponse
      return Either.right({ data: response.data, total: response.total })
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getById(id: string): Promise<Either<DataError, Member>> {
    try {
      const { data } = await this.axios.get<Member>(`/api/members/${id}`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async create(body: CreateMemberRequest): Promise<Either<DataError, Member>> {
    try {
      const { data } = await this.axios.post<Member>('/api/members', body)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async update(id: string, body: UpdateMemberRequest): Promise<Either<DataError, Member>> {
    try {
      const { data } = await this.axios.patch<Member>(`/api/members/${id}`, body)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async delete(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete<void>(`/api/members/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getDepartments(memberId: string): Promise<Either<DataError, MemberDepartment[]>> {
    try {
      const { data } = await this.axios.get<MemberDepartment[]>(`/api/members/${memberId}/departments`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async assignDepartment(memberId: string, departmentId: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.post<void>(`/api/members/${memberId}/departments/${departmentId}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async removeDepartment(memberId: string, departmentId: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete<void>(`/api/members/${memberId}/departments/${departmentId}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async bulkImport(rows: BulkImportRow[]): Promise<Either<DataError, BulkImportResult>> {
    try {
      const { data } = await this.axios.post<BulkImportResult>('/api/members/bulk-import', { rows })
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async previewBulkImport(file: File): Promise<Either<DataError, BulkPreviewResponse>> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await this.axios.post<BulkPreviewResponse>('/api/members/bulk-preview', formData)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
