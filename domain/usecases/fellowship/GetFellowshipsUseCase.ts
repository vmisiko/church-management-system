import type { IFellowshipRepository } from '@/domain/repository/IFellowshipRepository'

export class GetFellowshipsUseCase {
  constructor(private readonly repo: IFellowshipRepository) {}
  execute() {
    return this.repo.getAll()
  }
}
