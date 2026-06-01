import type { IAuthRepository } from '@/domain/repository/IAuthRepository'

export class RefreshTokenUseCase {
  constructor(private readonly repo: IAuthRepository) {}
  execute() {
    return this.repo.refresh()
  }
}
