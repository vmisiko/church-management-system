import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { IAuthTokenSource } from '@/core/utility/CustomAxios'
import { tokenStorage } from '@/core/tokenStorage'
import { Either } from '@/core/domain/Either'
import type { AuthState } from './useAuthState'
import type { LoginUseCase } from '@/domain/usecases/auth/LoginUseCase'
import type { LogoutUseCase } from '@/domain/usecases/auth/LogoutUseCase'
import type { RefreshTokenUseCase } from '@/domain/usecases/auth/RefreshTokenUseCase'
import type { GetMeUseCase } from '@/domain/usecases/auth/GetMeUseCase'
import type { ChangePasswordUseCase } from '@/domain/usecases/auth/ChangePasswordUseCase'
import type { LoginRequest, ChangePasswordRequest, LoginResponse } from '@/domain/entities/auth/Auth'

export class AuthPloc extends Ploc<StoreApi<AuthState>> implements IAuthTokenSource {
  constructor({
    store,
    loginUseCase,
    logoutUseCase,
    refreshTokenUseCase,
    getMeUseCase,
    changePasswordUseCase,
  }: {
    store: StoreApi<AuthState>
    loginUseCase: LoginUseCase
    logoutUseCase: LogoutUseCase
    refreshTokenUseCase: RefreshTokenUseCase
    getMeUseCase: GetMeUseCase
    changePasswordUseCase: ChangePasswordUseCase
  }) {
    super({ store })
    this.loginUseCase = loginUseCase
    this.logoutUseCase = logoutUseCase
    this.refreshTokenUseCase = refreshTokenUseCase
    this.getMeUseCase = getMeUseCase
    this.changePasswordUseCase = changePasswordUseCase
  }

  private readonly loginUseCase: LoginUseCase
  private readonly logoutUseCase: LogoutUseCase
  private readonly refreshTokenUseCase: RefreshTokenUseCase
  private readonly getMeUseCase: GetMeUseCase
  private readonly changePasswordUseCase: ChangePasswordUseCase

  // ── IAuthTokenSource ───────────────────────────────────────────────────────

  getAccessToken(): string | null {
    return this.store.getState().accessToken ?? tokenStorage.getAccessToken()
  }

  getElevatedToken(): string | null {
    return null
  }

  async refreshSession(): Promise<Either<string, LoginResponse>> {
    const result = await this.refreshTokenUseCase.execute()
    return result.fold(
      (err) => Either.left(err.message),
      (res) => {
        this.store.setState({ accessToken: res.accessToken })
        return Either.right(res)
      },
    )
  }

  // ── Public Ploc actions ────────────────────────────────────────────────────

  isAuthenticated(): boolean {
    return !!this.store.getState().accessToken
  }

  async login(params: LoginRequest, onSuccess: () => void) {
    this.store.setState({ loginLoading: true, loginError: null })
    const result = await this.loginUseCase.execute(params)
    result.fold(
      (err) => this.store.setState({ loginLoading: false, loginError: this.handleError(err) }),
      (res) => {
        this.store.setState({ loginLoading: false, accessToken: res.accessToken })
        onSuccess()
      },
    )
  }

  async logout(onSuccess?: () => void): Promise<unknown> {
    this.store.setState({ logoutLoading: true, logoutError: null })
    await this.logoutUseCase.execute()
    tokenStorage.clear()
    this.store.setState({
      logoutLoading: false,
      accessToken: null,
      currentUser: null,
    })
    onSuccess?.()
  }

  async fetchMe() {
    this.store.setState({ meLoading: true })
    const result = await this.getMeUseCase.execute()
    result.fold(
      () => this.store.setState({ meLoading: false }),
      (user) =>
        this.store.setState({
          meLoading: false,
          currentUser: { id: user.id, email: user.email, role: user.role },
        }),
    )
  }

  async changePassword(params: ChangePasswordRequest): Promise<boolean> {
    const result = await this.changePasswordUseCase.execute(params)
    return result.isRight()
  }

  clearErrors() {
    this.store.setState({ loginError: null, logoutError: null })
  }
}
