import type { IAttendanceRepository } from '@/domain/repository/IAttendanceRepository'
import type { UpdateSessionRequest } from '@/domain/entities/attendance/Attendance'

export class UpdateSessionUseCase {
  constructor(private readonly repo: IAttendanceRepository) {}

  execute(id: string, data: UpdateSessionRequest) {
    return this.repo.updateSession(id, data)
  }
}
