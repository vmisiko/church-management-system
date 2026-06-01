import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IFellowshipRepository } from '@/domain/repository/IFellowshipRepository'
import type {
  Fellowship,
  CreateFellowshipRequest,
  UpdateFellowshipRequest,
} from '@/domain/entities/fellowship/Fellowship'

export class FellowshipRepository extends BaseRepository implements IFellowshipRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(): Promise<Either<DataError, Fellowship[]>> {
    try {
      const { data } = await this.axios.get<Fellowship[]>('/api/fellowships')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getById(id: string): Promise<Either<DataError, Fellowship>> {
    try {
      const { data } = await this.axios.get<Fellowship>(`/api/fellowships/${id}`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getBySlug(slug: string): Promise<Either<DataError, Fellowship>> {
    try {
      const { data } = await this.axios.get<Fellowship>(`/api/fellowships/slug/${slug}`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async create(params: CreateFellowshipRequest): Promise<Either<DataError, Fellowship>> {
    try {
      const { data } = await this.axios.post<Fellowship>('/api/fellowships', params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async update(id: string, params: UpdateFellowshipRequest): Promise<Either<DataError, Fellowship>> {
    try {
      const { data } = await this.axios.patch<Fellowship>(`/api/fellowships/${id}`, params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async delete(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete(`/api/fellowships/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
