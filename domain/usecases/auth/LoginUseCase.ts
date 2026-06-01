import type { IAuthRepository } from '@/domain/repository/IAuthRepository'
import type { LoginRequest } from '@/domain/entities/auth/Auth'

export class LoginUseCase {
  constructor(private readonly repo: IAuthRepository) {}
  execute(params: LoginRequest) {
    return this.repo.login(params)
  }
}
