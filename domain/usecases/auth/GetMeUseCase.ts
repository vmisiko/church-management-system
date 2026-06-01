import type { IAuthRepository } from '@/domain/repository/IAuthRepository'

export class GetMeUseCase {
  constructor(private readonly repo: IAuthRepository) {}
  execute() {
    return this.repo.getMe()
  }
}
