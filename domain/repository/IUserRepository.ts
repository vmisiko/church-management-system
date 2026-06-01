import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { User, CreateUserRequest, UpdateUserRequest } from '@/domain/entities/user/User'

export interface IUserRepository {
  getAll(): Promise<Either<DataError, User[]>>
  getById(id: string): Promise<Either<DataError, User>>
  create(params: CreateUserRequest): Promise<Either<DataError, User>>
  update(id: string, params: UpdateUserRequest): Promise<Either<DataError, User>>
  delete(id: string): Promise<Either<DataError, void>>
}
