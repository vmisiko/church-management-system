import type { IAttendanceRepository } from '@/domain/repository/IAttendanceRepository'

export class GetSessionsUseCase {
  constructor(private readonly repo: IAttendanceRepository) {}

  execute() {
    return this.repo.getSessions()
  }
}
