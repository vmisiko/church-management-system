import type { IAuthRepository } from '@/domain/repository/IAuthRepository'

export class LogoutUseCase {
  constructor(private readonly repo: IAuthRepository) {}
  execute() {
    return this.repo.logout()
  }
}
