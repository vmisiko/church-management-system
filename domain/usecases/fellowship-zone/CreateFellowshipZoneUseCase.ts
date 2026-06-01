import type { IFellowshipZoneRepository } from '@/domain/repository/IFellowshipZoneRepository'
import type { CreateFellowshipZoneRequest } from '@/domain/entities/fellowship-zone/FellowshipZone'

export class CreateFellowshipZoneUseCase {
  constructor(private readonly repo: IFellowshipZoneRepository) {}
  execute(params: CreateFellowshipZoneRequest) {
    return this.repo.create(params)
  }
}
