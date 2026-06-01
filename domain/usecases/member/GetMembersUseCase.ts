import type { IMemberRepository } from '@/domain/repository/IMemberRepository'

export class GetMembersUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute() {
    return this.repo.getAll()
  }
}
