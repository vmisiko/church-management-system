import type { IMemberRepository } from '@/domain/repository/IMemberRepository'

export class DeleteMemberUseCase {
  constructor(private readonly repo: IMemberRepository) {}

  execute(id: string) {
    return this.repo.delete(id)
  }
}
