import type { IFellowshipZoneRepository } from '@/domain/repository/IFellowshipZoneRepository'

export class GetFellowshipZoneByIdUseCase {
  constructor(private readonly repo: IFellowshipZoneRepository) {}
  execute(id: string) {
    return this.repo.getById(id)
  }
}
