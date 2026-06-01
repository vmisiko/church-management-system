import type { IUserRepository } from '@/domain/repository/IUserRepository'
import type { CreateUserRequest } from '@/domain/entities/user/User'

export class CreateUserUseCase {
  constructor(private readonly repo: IUserRepository) {}
  execute(params: CreateUserRequest) {
    return this.repo.create(params)
  }
}
