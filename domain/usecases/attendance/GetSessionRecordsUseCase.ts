import type { IAttendanceRepository } from '@/domain/repository/IAttendanceRepository'

export class GetSessionRecordsUseCase {
  constructor(private readonly repo: IAttendanceRepository) {}

  execute(sessionId: string) {
    return this.repo.getSessionRecords(sessionId)
  }
}
