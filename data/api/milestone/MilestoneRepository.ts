import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IMilestoneRepository } from '@/domain/repository/IMilestoneRepository'
import type {
  MilestoneType,
  MemberMilestone,
  CreateMilestoneTypeRequest,
  UpdateMilestoneTypeRequest,
  RecordMemberMilestoneRequest,
} from '@/domain/entities/milestone/Milestone'

export class MilestoneRepository extends BaseRepository implements IMilestoneRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAllTypes(): Promise<Either<DataError, MilestoneType[]>> {
    try {
      const { data } = await this.axios.get<MilestoneType[]>('/api/milestone-types')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async createType(body: CreateMilestoneTypeRequest): Promise<Either<DataError, MilestoneType>> {
    try {
      const { data } = await this.axios.post<MilestoneType>('/api/milestone-types', body)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async updateType(id: string, body: UpdateMilestoneTypeRequest): Promise<Either<DataError, MilestoneType>> {
    try {
      const { data } = await this.axios.patch<MilestoneType>(`/api/milestone-types/${id}`, body)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async deleteType(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete(`/api/milestone-types/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getByMember(memberId: string): Promise<Either<DataError, MemberMilestone[]>> {
    try {
      const { data } = await this.axios.get<MemberMilestone[]>(`/api/members/${memberId}/milestones`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async record(memberId: string, body: RecordMemberMilestoneRequest): Promise<Either<DataError, MemberMilestone>> {
    try {
      const { data } = await this.axios.post<MemberMilestone>(`/api/members/${memberId}/milestones`, body)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async remove(memberId: string, milestoneId: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete(`/api/members/${memberId}/milestones/${milestoneId}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
