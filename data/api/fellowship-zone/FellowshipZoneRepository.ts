import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IFellowshipZoneRepository } from '@/domain/repository/IFellowshipZoneRepository'
import type {
  FellowshipZone,
  CreateFellowshipZoneRequest,
  UpdateFellowshipZoneRequest,
} from '@/domain/entities/fellowship-zone/FellowshipZone'

export class FellowshipZoneRepository extends BaseRepository implements IFellowshipZoneRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(): Promise<Either<DataError, FellowshipZone[]>> {
    try {
      const { data } = await this.axios.get<FellowshipZone[]>('/api/fellowship-zones')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getById(id: string): Promise<Either<DataError, FellowshipZone>> {
    try {
      const { data } = await this.axios.get<FellowshipZone>(`/api/fellowship-zones/${id}`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async create(params: CreateFellowshipZoneRequest): Promise<Either<DataError, FellowshipZone>> {
    try {
      const { data } = await this.axios.post<FellowshipZone>('/api/fellowship-zones', params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async update(
    id: string,
    params: UpdateFellowshipZoneRequest,
  ): Promise<Either<DataError, FellowshipZone>> {
    try {
      const { data } = await this.axios.patch<FellowshipZone>(
        `/api/fellowship-zones/${id}`,
        params,
      )
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async delete(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete(`/api/fellowship-zones/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
