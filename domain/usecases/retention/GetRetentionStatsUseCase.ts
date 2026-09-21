import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { RetentionStats, RetentionStatsQuery } from "@/domain/entities/retention/Retention"
import type { IRetentionRepository } from "@/domain/repository/IRetentionRepository"

export class GetRetentionStatsUseCase {
  constructor(private readonly repo: IRetentionRepository) {}
  execute(query?: RetentionStatsQuery): Promise<Either<DataError, RetentionStats>> { return this.repo.getStats(query) }
}
