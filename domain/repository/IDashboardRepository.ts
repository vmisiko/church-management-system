import type { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import type { DashboardStats } from "@/domain/entities/dashboard/DashboardStats"

export interface IDashboardRepository {
  getStats(): Promise<Either<DataError, DashboardStats>>
}
