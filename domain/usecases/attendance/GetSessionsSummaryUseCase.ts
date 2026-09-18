import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type { SessionSummary } from '@/domain/entities/attendance/Attendance'
import type { IAttendanceRepository } from '@/domain/repository/IAttendanceRepository'

export class GetSessionsSummaryUseCase {
  constructor(private readonly repo: IAttendanceRepository) {}
  execute(): Promise<Either<DataError, SessionSummary[]>> {
    return this.repo.getSessionsSummary()
  }
}
