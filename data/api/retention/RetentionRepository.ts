import { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import { BaseRepository } from "@/core/data/repository/BaseRepository"
import { mapToDataError } from "@/core/utility/mapToDataError"
import type CustomAxios from "@/core/utility/CustomAxios"
import type { IRetentionRepository } from "@/domain/repository/IRetentionRepository"
import type { AtRiskMembersResponse, RetentionStats, RetentionStatsQuery } from "@/domain/entities/retention/Retention"

export class RetentionRepository extends BaseRepository implements IRetentionRepository {
  constructor({ axios }: { axios: CustomAxios }) { super({ axios }) }

  async getStats(query?: RetentionStatsQuery): Promise<Either<DataError, RetentionStats>> {
    try {
      const { data } = await this.axios.get<RetentionStats>("/api/retention/stats", { params: query })
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getAtRiskMembers(page = 1, limit = 20): Promise<Either<DataError, AtRiskMembersResponse>> {
    try {
      const { data } = await this.axios.get<AtRiskMembersResponse>("/api/retention/at-risk-members", { params: { page, limit } })
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
