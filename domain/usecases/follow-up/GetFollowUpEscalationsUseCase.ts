import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { FollowUpEscalation } from "@/domain/entities/follow-up/FollowUp"
import type { IFollowUpRepository } from "@/domain/repository/IFollowUpRepository"

export class GetFollowUpEscalationsUseCase {
  constructor(private readonly repo: IFollowUpRepository) {}
  execute(id: string): Promise<Either<DataError, FollowUpEscalation[]>> { return this.repo.getEscalations(id) }
}
