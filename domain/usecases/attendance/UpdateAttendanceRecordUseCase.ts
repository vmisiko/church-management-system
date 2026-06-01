import type { IAttendanceRepository } from '@/domain/repository/IAttendanceRepository'
import type { UpdateAttendanceRecordRequest } from '@/domain/entities/attendance/Attendance'

export class UpdateAttendanceRecordUseCase {
  constructor(private readonly repo: IAttendanceRepository) {}

  execute(id: string, data: UpdateAttendanceRecordRequest) {
    return this.repo.updateRecord(id, data)
  }
}
