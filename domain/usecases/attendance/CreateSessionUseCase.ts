import type { IAttendanceRepository } from '@/domain/repository/IAttendanceRepository'
import type { CreateSessionRequest } from '@/domain/entities/attendance/Attendance'

export class CreateSessionUseCase {
  constructor(private readonly repo: IAttendanceRepository) {}

  execute(data: CreateSessionRequest) {
    return this.repo.createSession(data)
  }
}
