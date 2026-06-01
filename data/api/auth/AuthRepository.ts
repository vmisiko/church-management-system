import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import { tokenStorage } from '@/core/tokenStorage'
import type { IAuthRepository } from '@/domain/repository/IAuthRepository'
import type {
  LoginRequest,
  LoginResponse,
  UserProfile,
  ChangePasswordRequest,
} from '@/domain/entities/auth/Auth'
import type CustomAxios from '@/core/utility/CustomAxios'

const skipAuth = { skipAuth: true }

export class AuthRepository extends BaseRepository implements IAuthRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async login(params: LoginRequest): Promise<Either<DataError, LoginResponse>> {
    try {
      const { data } = await this.axios.post<LoginResponse>('/api/auth/login', params, skipAuth)
      tokenStorage.setAccessToken(data.accessToken)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async logout(): Promise<Either<DataError, void>> {
    try {
      await this.axios.post<void>('/api/auth/logout')
      tokenStorage.clear()
      return Either.right(undefined)
    } catch (error) {
      tokenStorage.clear()
      return Either.left(mapToDataError(error))
    }
  }

  async refresh(): Promise<Either<DataError, LoginResponse>> {
    try {
      const { data } = await this.axios.post<LoginResponse>('/api/auth/refresh', undefined, skipAuth)
      tokenStorage.setAccessToken(data.accessToken)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getMe(): Promise<Either<DataError, UserProfile>> {
    try {
      const { data } = await this.axios.get<UserProfile>('/api/auth/me')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async changePassword(params: ChangePasswordRequest): Promise<Either<DataError, void>> {
    try {
      await this.axios.patch<void>('/api/auth/me/password', params)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
