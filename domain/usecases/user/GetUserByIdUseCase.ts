import type { IUserRepository } from '@/domain/repository/IUserRepository'

export class GetUserByIdUseCase {
  constructor(private readonly repo: IUserRepository) {}
  execute(id: string) {
    return this.repo.getById(id)
  }
}
