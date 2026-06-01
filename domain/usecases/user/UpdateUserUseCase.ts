import type { IUserRepository } from '@/domain/repository/IUserRepository'
import type { UpdateUserRequest } from '@/domain/entities/user/User'

export class UpdateUserUseCase {
  constructor(private readonly repo: IUserRepository) {}
  execute(id: string, params: UpdateUserRequest) {
    return this.repo.update(id, params)
  }
}
