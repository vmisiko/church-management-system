import type { IFellowshipZoneRepository } from '@/domain/repository/IFellowshipZoneRepository'
import type { UpdateFellowshipZoneRequest } from '@/domain/entities/fellowship-zone/FellowshipZone'

export class UpdateFellowshipZoneUseCase {
  constructor(private readonly repo: IFellowshipZoneRepository) {}
  execute(id: string, params: UpdateFellowshipZoneRequest) {
    return this.repo.update(id, params)
  }
}
