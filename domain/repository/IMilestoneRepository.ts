import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type {
  MilestoneType,
  MemberMilestone,
  CreateMilestoneTypeRequest,
  UpdateMilestoneTypeRequest,
  RecordMemberMilestoneRequest,
} from '@/domain/entities/milestone/Milestone'

export interface IMilestoneRepository {
  getAllTypes(): Promise<Either<DataError, MilestoneType[]>>
  createType(data: CreateMilestoneTypeRequest): Promise<Either<DataError, MilestoneType>>
  updateType(id: string, data: UpdateMilestoneTypeRequest): Promise<Either<DataError, MilestoneType>>
  deleteType(id: string): Promise<Either<DataError, void>>
  getByMember(memberId: string): Promise<Either<DataError, MemberMilestone[]>>
  record(memberId: string, data: RecordMemberMilestoneRequest): Promise<Either<DataError, MemberMilestone>>
  remove(memberId: string, milestoneId: string): Promise<Either<DataError, void>>
}
