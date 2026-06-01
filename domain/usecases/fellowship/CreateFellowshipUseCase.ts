import type { IFellowshipRepository } from '@/domain/repository/IFellowshipRepository'
import type { CreateFellowshipRequest } from '@/domain/entities/fellowship/Fellowship'

export class CreateFellowshipUseCase {
  constructor(private readonly repo: IFellowshipRepository) {}
  execute(params: CreateFellowshipRequest) {
    return this.repo.create(params)
  }
}
