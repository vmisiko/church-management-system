import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type {
  LoginRequest,
  LoginResponse,
  UserProfile,
  ChangePasswordRequest,
} from '@/domain/entities/auth/Auth'

export interface IAuthRepository {
  login(params: LoginRequest): Promise<Either<DataError, LoginResponse>>
  logout(): Promise<Either<DataError, void>>
  refresh(): Promise<Either<DataError, LoginResponse>>
  getMe(): Promise<Either<DataError, UserProfile>>
  changePassword(params: ChangePasswordRequest): Promise<Either<DataError, void>>
}
