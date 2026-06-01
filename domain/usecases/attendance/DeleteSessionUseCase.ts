import type { IAttendanceRepository } from '@/domain/repository/IAttendanceRepository'

export class DeleteSessionUseCase {
  constructor(private readonly repo: IAttendanceRepository) {}

  execute(id: string) {
    return this.repo.deleteSession(id)
  }
}
