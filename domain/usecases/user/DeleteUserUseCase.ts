import type { IUserRepository } from '@/domain/repository/IUserRepository'

export class DeleteUserUseCase {
  constructor(private readonly repo: IUserRepository) {}
  execute(id: string) {
    return this.repo.delete(id)
  }
}
