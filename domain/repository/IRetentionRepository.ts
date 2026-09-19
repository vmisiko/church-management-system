import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { AtRiskMembersResponse, RetentionStats, RetentionStatsQuery } from "@/domain/entities/retention/Retention"

export interface IRetentionRepository {
  getStats(query?: RetentionStatsQuery): Promise<Either<DataError, RetentionStats>>
  getAtRiskMembers(page?: number, limit?: number): Promise<Either<DataError, AtRiskMembersResponse>>
}
