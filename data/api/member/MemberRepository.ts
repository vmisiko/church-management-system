import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IMemberRepository } from '@/domain/repository/IMemberRepository'
import type {
  Member,
  CreateMemberRequest,
  UpdateMemberRequest,
  MemberDepartment,
  MemberQueryParams,
} from '@/domain/entities/member/Member'

interface MembersListResponse {
  data: Member[]
  total: number
}

export class MemberRepository extends BaseRepository implements IMemberRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(params?: MemberQueryParams): Promise<Either<DataError, Member[]>> {
    try {
      const query: Record<string, string> = {}
      if (params?.status) query.status = params.status
      if (params?.hasFellowship !== undefined) query.hasFellowship = String(params.hasFellowship)
      if (params?.fellowshipId) query.fellowshipId = params.fellowshipId
      if (params?.departmentId) query.departmentId = params.departmentId
      if (params?.memberType) query.memberType = params.memberType
      if (params?.activityStatus) query.activityStatus = params.activityStatus
      if (params?.joinDateRange) query.joinDateRange = params.joinDateRange
      const { data } = await this.axios.get<MembersListResponse>('/api/members', { params: query })
      return Either.right((data as unknown as MembersListResponse).data)
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
}
