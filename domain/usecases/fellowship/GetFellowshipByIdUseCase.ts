import type { IFellowshipRepository } from '@/domain/repository/IFellowshipRepository'

export class GetFellowshipByIdUseCase {
  constructor(private readonly repo: IFellowshipRepository) {}
  execute(id: string) {
    return this.repo.getById(id)
  }
}
