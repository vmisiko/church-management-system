import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { AtRiskMembersResponse } from "@/domain/entities/retention/Retention"
import type { IRetentionRepository } from "@/domain/repository/IRetentionRepository"

export class GetAtRiskMembersUseCase {
  constructor(private readonly repo: IRetentionRepository) {}
  execute(page?: number, limit?: number): Promise<Either<DataError, AtRiskMembersResponse>> { return this.repo.getAtRiskMembers(page, limit) }
}
