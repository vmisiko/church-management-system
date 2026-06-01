import type { IAttendanceRepository } from '@/domain/repository/IAttendanceRepository'

export class GetSessionByIdUseCase {
  constructor(private readonly repo: IAttendanceRepository) {}

  execute(id: string) {
    return this.repo.getSessionById(id)
  }
}
