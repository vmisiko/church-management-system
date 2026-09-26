import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { CareRecord, CreateCareRecordRequest, UpdateCareRecordRequest } from '@/domain/entities/care/CareRecord'

export interface ICareRepository {
  getByMember(memberId: string): Promise<Either<DataError, CareRecord[]>>
  create(memberId: string, data: CreateCareRecordRequest): Promise<Either<DataError, CareRecord>>
  update(memberId: string, careRecordId: string, data: UpdateCareRecordRequest): Promise<Either<DataError, CareRecord>>
}
