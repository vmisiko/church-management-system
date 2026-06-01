import type { IAuthRepository } from '@/domain/repository/IAuthRepository'
import type { ChangePasswordRequest } from '@/domain/entities/auth/Auth'

export class ChangePasswordUseCase {
  constructor(private readonly repo: IAuthRepository) {}
  execute(params: ChangePasswordRequest) {
    return this.repo.changePassword(params)
  }
}
