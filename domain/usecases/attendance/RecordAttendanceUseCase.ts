import type { IAttendanceRepository } from '@/domain/repository/IAttendanceRepository'
import type { RecordAttendanceRequest } from '@/domain/entities/attendance/Attendance'

export class RecordAttendanceUseCase {
  constructor(private readonly repo: IAttendanceRepository) {}

  execute(data: RecordAttendanceRequest) {
    return this.repo.recordAttendance(data)
  }
}
