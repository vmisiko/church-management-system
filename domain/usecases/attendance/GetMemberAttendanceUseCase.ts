import type { IAttendanceRepository } from '@/domain/repository/IAttendanceRepository'

export class GetMemberAttendanceUseCase {
  constructor(private readonly repo: IAttendanceRepository) {}

  execute(memberId: string) {
    return this.repo.getMemberRecords(memberId)
  }
}
