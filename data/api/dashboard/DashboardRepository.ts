import { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import { BaseRepository } from "@/core/data/repository/BaseRepository"
import { mapToDataError } from "@/core/utility/mapToDataError"
import type CustomAxios from "@/core/utility/CustomAxios"
import type { IDashboardRepository } from "@/domain/repository/IDashboardRepository"
import type { DashboardStats } from "@/domain/entities/dashboard/DashboardStats"

export class DashboardRepository extends BaseRepository implements IDashboardRepository {
  constructor({ axios }: { axios: CustomAxios }) { super({ axios }) }
  async getStats(): Promise<Either<DataError, DashboardStats>> {
    try {
      const { data } = await this.axios.get<DashboardStats>("/api/dashboard/stats")
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
