import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { FollowUpTask, UpdateFollowUpInput } from "@/domain/entities/follow-up/FollowUp"
import type { IFollowUpRepository } from "@/domain/repository/IFollowUpRepository"

export class UpdateFollowUpUseCase {
  constructor(private readonly repo: IFollowUpRepository) {}
  execute(id: string, input: UpdateFollowUpInput): Promise<Either<DataError, FollowUpTask>> { return this.repo.update(id, input) }
}
