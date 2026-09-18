import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { DashboardStats } from "@/domain/entities/dashboard/DashboardStats"
import type { IDashboardRepository } from "@/domain/repository/IDashboardRepository"

export class GetDashboardStatsUseCase {
  constructor(private readonly repo: IDashboardRepository) {}
  execute(): Promise<Either<DataError, DashboardStats>> { return this.repo.getStats() }
}
