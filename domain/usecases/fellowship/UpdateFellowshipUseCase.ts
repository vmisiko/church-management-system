import type { IFellowshipRepository } from '@/domain/repository/IFellowshipRepository'
import type { UpdateFellowshipRequest } from '@/domain/entities/fellowship/Fellowship'

export class UpdateFellowshipUseCase {
  constructor(private readonly repo: IFellowshipRepository) {}
  execute(id: string, params: UpdateFellowshipRequest) {
    return this.repo.update(id, params)
  }
}
