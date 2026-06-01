import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IDamageReportRepository } from '@/domain/repository/IDamageReportRepository'
import type {
  DamageReport,
  CreateDamageReportRequest,
  UpdateDamageReportRequest,
} from '@/domain/entities/inventory/DamageReport'

export class DamageReportRepository extends BaseRepository implements IDamageReportRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(): Promise<Either<DataError, DamageReport[]>> {
    try {
      const { data } = await this.axios.get<DamageReport[]>('/api/inventory/damage-reports')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getById(id: string): Promise<Either<DataError, DamageReport>> {
    try {
      const { data } = await this.axios.get<DamageReport>(`/api/inventory/damage-reports/${id}`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async create(params: CreateDamageReportRequest): Promise<Either<DataError, DamageReport>> {
    try {
      const { data } = await this.axios.post<DamageReport>(
        '/api/inventory/damage-reports',
        params,
      )
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async update(
    id: string,
    params: UpdateDamageReportRequest,
  ): Promise<Either<DataError, DamageReport>> {
    try {
      const { data } = await this.axios.patch<DamageReport>(
        `/api/inventory/damage-reports/${id}`,
        params,
      )
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async delete(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete<void>(`/api/inventory/damage-reports/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
