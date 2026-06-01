import type { IFellowshipZoneRepository } from '@/domain/repository/IFellowshipZoneRepository'

export class GetFellowshipZonesUseCase {
  constructor(private readonly repo: IFellowshipZoneRepository) {}
  execute() {
    return this.repo.getAll()
  }
}
