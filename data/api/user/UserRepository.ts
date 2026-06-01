import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IUserRepository } from '@/domain/repository/IUserRepository'
import type { User, CreateUserRequest, UpdateUserRequest } from '@/domain/entities/user/User'

export class UserRepository extends BaseRepository implements IUserRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(): Promise<Either<DataError, User[]>> {
    try {
      const { data } = await this.axios.get<User[]>('/api/users')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getById(id: string): Promise<Either<DataError, User>> {
    try {
      const { data } = await this.axios.get<User>(`/api/users/${id}`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async create(params: CreateUserRequest): Promise<Either<DataError, User>> {
    try {
      const { data } = await this.axios.post<User>('/api/users', params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async update(id: string, params: UpdateUserRequest): Promise<Either<DataError, User>> {
    try {
      const { data } = await this.axios.patch<User>(`/api/users/${id}`, params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async delete(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete(`/api/users/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
