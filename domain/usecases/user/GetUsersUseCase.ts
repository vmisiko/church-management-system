import type { IUserRepository } from '@/domain/repository/IUserRepository'

export class GetUsersUseCase {
  constructor(private readonly repo: IUserRepository) {}
  execute() {
    return this.repo.getAll()
  }
}
