import type { IFellowshipRepository } from '@/domain/repository/IFellowshipRepository'

export class GetFellowshipBySlugUseCase {
  constructor(private readonly repo: IFellowshipRepository) {}
  execute(slug: string) {
    return this.repo.getBySlug(slug)
  }
}
