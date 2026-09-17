import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { CreateFollowUpInput, FollowUpTask } from "@/domain/entities/follow-up/FollowUp"
import type { IFollowUpRepository } from "@/domain/repository/IFollowUpRepository"

export class CreateFollowUpUseCase {
  constructor(private readonly repo: IFollowUpRepository) {}
  execute(input: CreateFollowUpInput): Promise<Either<DataError, FollowUpTask>> { return this.repo.create(input) }
}
