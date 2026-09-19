import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { CreateFollowUpInput, FollowUpAttempt, FollowUpEscalation, FollowUpStatus, FollowUpTask, RecordFollowUpAttemptInput, UpdateFollowUpInput } from "@/domain/entities/follow-up/FollowUp"

export interface IFollowUpRepository {
  getAll(status?: FollowUpStatus): Promise<Either<DataError, FollowUpTask[]>>
  getById(id: string): Promise<Either<DataError, { task: FollowUpTask; attempts: FollowUpAttempt[] }>>
  create(input: CreateFollowUpInput): Promise<Either<DataError, FollowUpTask>>
  update(id: string, input: UpdateFollowUpInput): Promise<Either<DataError, FollowUpTask>>
  recordAttempt(id: string, input: RecordFollowUpAttemptInput): Promise<Either<DataError, { task: FollowUpTask; attempt: FollowUpAttempt }>>
  getEscalations(id: string): Promise<Either<DataError, FollowUpEscalation[]>>
}
