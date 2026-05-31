import type { StoreApi } from 'zustand'

import { Ploc } from '@/core/application/ploc'
import type { IAuthTokenSource } from '@/core/utility/CustomAxios'
import { tokenStorage } from '@/core/tokenStorage'
import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'

import type {
  LoginRequest,
  OTPRequestRequest,
  TokenResponse,
} from '@/domain/entities/auth/Auth'
import type { LoginUseCase } from '@/domain/usecases/auth/LoginUseCase'
import type { LogoutUseCase } from '@/domain/usecases/auth/LogoutUseCase'
import type { RefreshTokenUseCase } from '@/domain/usecases/auth/RefreshTokenUseCase'
import type { RequestOtpUseCase } from '@/domain/usecases/auth/RequestOtpUseCase'
import type { OtpRequestResult } from '@/domain/repository/IAuthRepository'

import { clearNotificationPersistence } from '@/application/notifications/useNotificationState'

import type { AuthState } from './useAuthState'
import { jwtDecode, type JwtPayload } from 'jwt-decode'

export type AuthPlocStoreType = StoreApi<AuthState>

export class AuthPloc extends Ploc<AuthPlocStoreType> implements IAuthTokenSource {
  constructor(
    {
      store,
      requestOtpUseCase,
      loginUseCase,
      refreshTokenUseCase,
      logoutUseCase,
    }: {
      store: AuthPlocStoreType
      requestOtpUseCase: RequestOtpUseCase
      loginUseCase: LoginUseCase
      refreshTokenUseCase: RefreshTokenUseCase
      logoutUseCase: LogoutUseCase
    },
  ) {
    super({ store })
    this.requestOtpUseCase = requestOtpUseCase
    this.loginUseCase = loginUseCase
    this.refreshTokenUseCase = refreshTokenUseCase
    this.logoutUseCase = logoutUseCase
  }

  private readonly requestOtpUseCase: RequestOtpUseCase
  private readonly loginUseCase: LoginUseCase
  private readonly refreshTokenUseCase: RefreshTokenUseCase
  private readonly logoutUseCase: LogoutUseCase

  getAccessToken(): string | null {
    return this.store.getState().accessToken ?? tokenStorage.getAccessToken()
  }

  getRefreshToken(): string | null {
    return this.store.getState().refreshToken ?? tokenStorage.getRefreshToken()
  }

  /** Returns true when the JWT is missing, malformed, has no `exp`, or `exp` is in the past. */
  isTokenExpired(token: string | null): boolean {
    if (token === null || token.length === 0) {
      return true
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      if (decoded.exp === undefined) {
        return true
      }
      const nowSec = Math.floor(Date.now() / 1000)
      return decoded.exp <= nowSec
    } catch {
      return true
    }
  }

  /**
   * Synchronous check (after {@link hydrateSessionFromStorage}): access JWT exists and is not expired.
   * Use on each navigation to skip network when the session is still good.
   */
  hasValidAccessToken(): boolean {
    const access = this.getAccessToken()
    return access !== null && access.length > 0 && !this.isTokenExpired(access)
  }

  /**
   * Synchronous: refresh token is missing or expired, so no new access can be obtained without signing in again.
   */
  isRefreshSessionDead(): boolean {
    const refresh = this.getRefreshToken()
    if (refresh === null || refresh.length === 0) {
      return true
    }
    return this.isTokenExpired(refresh)
  }

  /**
   * True when both tokens are present, access is still valid, or access is expired but refresh succeeds.
   * On successful refresh, tokens are updated via {@link applyTokenResponse} (same path as login).
   */
  async isAuthenticated(): Promise<boolean> {
    this.hydrateSessionFromStorage()
    if (this.hasValidAccessToken()) {
      return true
    }
    if (this.isRefreshSessionDead()) {
      return false
    }
    const result = await this.refreshSession()
    if (result.isLeft()) {
      return false
    }
    const newAccess = this.getAccessToken()
    return (
      newAccess !== null &&
      newAccess.length > 0 &&
      !this.isTokenExpired(newAccess)
    )
  }

  getElevatedToken(): string | null {
    return null
  }

  private applyTokenResponse(tokens: TokenResponse): void {
    const access = tokens.access_token
    const refresh = tokens.refresh_token
    if (typeof access === 'string' && access.length > 0 && typeof refresh === 'string' && refresh.length > 0) {
      tokenStorage.setTokens(access, refresh)
      this.store.setState({
        accessToken: access,
        refreshToken: refresh,
      })
    }
  }

  /** Call on app mount (client) to sync store from localStorage */
  hydrateSessionFromStorage(): void {
    const access = tokenStorage.getAccessToken()
    const refresh = tokenStorage.getRefreshToken()
    this.store.setState({
      accessToken: access,
      refreshToken: refresh,
    })
  }

  async requestOtp(params: OTPRequestRequest): Promise<Either<string, OtpRequestResult>> {
    this.store.setState({
      otpLoading: true,
      otpError: null,
    })

    try {
      const result = await this.requestOtpUseCase.execute(params)
      return result.fold(
        (error: DataError) => {
          const message = this.handleError(error)
          this.store.setState({
            otpLoading: false,
            otpError: message,
          })
          return Either.left(message)
        },
        (data) => {
          this.store.setState({
            otpLoading: false,
          })
          return Either.right(data)
        },
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      this.store.setState({
        otpLoading: false,
        otpError: message,
      })
      return Either.left(message)
    }
  }

  async login(params: LoginRequest): Promise<Either<string, TokenResponse>> {
    this.store.setState({
      loginLoading: true,
      loginError: null,
    })

    try {
      const result = await this.loginUseCase.execute(params)
      return result.fold(
        (error: DataError) => {
          const message = this.handleError(error)
          this.store.setState({
            loginLoading: false,
            loginError: message,
          })
          return Either.left(message)
        },
        (tokens: TokenResponse) => {
          this.applyTokenResponse(tokens)
          this.store.setState({
            loginLoading: false,
          })
          return Either.right(tokens)
        },
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      this.store.setState({
        loginLoading: false,
        loginError: message,
      })
      return Either.left(message)
    }
  }

  async refreshSession(): Promise<Either<string, TokenResponse>> {
    const refresh = this.getRefreshToken()
    if (!refresh || refresh.length === 0) {
      return Either.left('No refresh token')
    }

    this.store.setState({
      refreshLoading: true,
      refreshError: null,
    })

    try {
      const result = await this.refreshTokenUseCase.execute({ refresh_token: refresh })
      return result.fold(
        (error: DataError) => {
          const message = this.handleError(error)
          this.store.setState({
            refreshLoading: false,
            refreshError: message,
          })
          return Either.left(message)
        },
        (tokens: TokenResponse) => {
          this.applyTokenResponse(tokens)
          this.store.setState({
            refreshLoading: false,
          })
          return Either.right(tokens)
        },
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      this.store.setState({
        refreshLoading: false,
        refreshError: message,
      })
      return Either.left(message)
    }
  }

  async logout(): Promise<Either<string, void>> {
    const refresh = tokenStorage.getRefreshToken()

    this.store.setState({
      logoutLoading: true,
      logoutError: null,
    })

    const clearLocal = (): void => {
      clearNotificationPersistence()
      tokenStorage.clear()
      this.store.setState({
        accessToken: null,
        refreshToken: null,
        logoutLoading: false,
      })
    }

    if (!refresh) {
      clearLocal()
      return Either.right(undefined)
    }

    try {
      const result = await this.logoutUseCase.execute({ refresh_token: refresh })
      return result.fold(
        (error: DataError) => {
          const message = this.handleError(error)
          this.store.setState({
            logoutLoading: false,
            logoutError: message,
          })
          clearLocal()
          return Either.left(message)
        },
        () => {
          clearLocal()
          return Either.right(undefined)
        },
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      this.store.setState({
        logoutLoading: false,
        logoutError: message,
      })
      clearLocal()
      return Either.left(message)
    }
  }

  clearErrors(): void {
    this.store.setState({
      otpError: null,
      loginError: null,
      logoutError: null,
      refreshError: null,
    })
  }

  resetState(): void {
    clearNotificationPersistence()
    tokenStorage.clear()
    this.store.setState({
      accessToken: null,
      refreshToken: null,
      otpLoading: false,
      loginLoading: false,
      logoutLoading: false,
      refreshLoading: false,
      otpError: null,
      loginError: null,
      logoutError: null,
      refreshError: null,
    })
  }
}
