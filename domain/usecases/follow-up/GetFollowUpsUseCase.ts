import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { FollowUpStatus, FollowUpTask } from "@/domain/entities/follow-up/FollowUp"
import type { IFollowUpRepository } from "@/domain/repository/IFollowUpRepository"

export class GetFollowUpsUseCase {
  constructor(private readonly repo: IFollowUpRepository) {}
  execute(status?: FollowUpStatus): Promise<Either<DataError, FollowUpTask[]>> { return this.repo.getAll(status) }
}
