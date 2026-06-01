import type { IFellowshipZoneRepository } from '@/domain/repository/IFellowshipZoneRepository'

export class DeleteFellowshipZoneUseCase {
  constructor(private readonly repo: IFellowshipZoneRepository) {}
  execute(id: string) {
    return this.repo.delete(id)
  }
}
