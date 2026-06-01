import type { IAttendanceRepository } from '@/domain/repository/IAttendanceRepository'

export class DeleteAttendanceRecordUseCase {
  constructor(private readonly repo: IAttendanceRepository) {}

  execute(id: string) {
    return this.repo.deleteRecord(id)
  }
}
