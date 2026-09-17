import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { FollowUpAttempt, FollowUpTask, RecordFollowUpAttemptInput } from "@/domain/entities/follow-up/FollowUp"
import type { IFollowUpRepository } from "@/domain/repository/IFollowUpRepository"

export class RecordFollowUpAttemptUseCase {
  constructor(private readonly repo: IFollowUpRepository) {}
  execute(id: string, input: RecordFollowUpAttemptInput): Promise<Either<DataError, { task: FollowUpTask; attempt: FollowUpAttempt }>> { return this.repo.recordAttempt(id, input) }
}
