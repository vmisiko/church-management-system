import type { IMemberRepository } from '@/domain/repository/IMemberRepository'

export class GetMemberByIdUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute(id: string) {
    return this.repo.getById(id)
  }
}
