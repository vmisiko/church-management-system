import type { IFellowshipRepository } from '@/domain/repository/IFellowshipRepository'

export class DeleteFellowshipUseCase {
  constructor(private readonly repo: IFellowshipRepository) {}
  execute(id: string) {
    return this.repo.delete(id)
  }
}
