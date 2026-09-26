import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { ICareRepository } from '@/domain/repository/ICareRepository'
import type { CareRecord, CreateCareRecordRequest, UpdateCareRecordRequest } from '@/domain/entities/care/CareRecord'

export class CareRepository extends BaseRepository implements ICareRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getByMember(memberId: string): Promise<Either<DataError, CareRecord[]>> {
    try {
      const { data } = await this.axios.get<CareRecord[]>(`/api/members/${memberId}/care-records`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async create(memberId: string, body: CreateCareRecordRequest): Promise<Either<DataError, CareRecord>> {
    try {
      const { data } = await this.axios.post<CareRecord>(`/api/members/${memberId}/care-records`, body)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async update(memberId: string, careRecordId: string, body: UpdateCareRecordRequest): Promise<Either<DataError, CareRecord>> {
    try {
      const { data } = await this.axios.patch<CareRecord>(`/api/members/${memberId}/care-records/${careRecordId}`, body)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
