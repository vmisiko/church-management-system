import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IAttendanceRepository } from '@/domain/repository/IAttendanceRepository'
import type {
  AttendanceSession,
  AttendanceRecord,
  CreateSessionRequest,
  UpdateSessionRequest,
  RecordAttendanceRequest,
  UpdateAttendanceRecordRequest,
} from '@/domain/entities/attendance/Attendance'

export class AttendanceRepository extends BaseRepository implements IAttendanceRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getSessions(): Promise<Either<DataError, AttendanceSession[]>> {
    try {
      const { data } = await this.axios.get<AttendanceSession[]>('/api/attendance/sessions')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async createSession(body: CreateSessionRequest): Promise<Either<DataError, AttendanceSession>> {
    try {
      const { data } = await this.axios.post<AttendanceSession>('/api/attendance/sessions', body)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getSessionById(id: string): Promise<Either<DataError, AttendanceSession>> {
    try {
      const { data } = await this.axios.get<AttendanceSession>(`/api/attendance/sessions/${id}`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async updateSession(id: string, body: UpdateSessionRequest): Promise<Either<DataError, AttendanceSession>> {
    try {
      const { data } = await this.axios.patch<AttendanceSession>(`/api/attendance/sessions/${id}`, body)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async deleteSession(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete<void>(`/api/attendance/sessions/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getSessionRecords(sessionId: string): Promise<Either<DataError, AttendanceRecord[]>> {
    try {
      const { data } = await this.axios.get<AttendanceRecord[]>(`/api/attendance/sessions/${sessionId}/records`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async recordAttendance(body: RecordAttendanceRequest): Promise<Either<DataError, AttendanceRecord>> {
    try {
      const { data } = await this.axios.post<AttendanceRecord>('/api/attendance/records', body)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getMemberRecords(memberId: string): Promise<Either<DataError, AttendanceRecord[]>> {
    try {
      const { data } = await this.axios.get<AttendanceRecord[]>(`/api/attendance/members/${memberId}/records`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async updateRecord(id: string, body: UpdateAttendanceRecordRequest): Promise<Either<DataError, AttendanceRecord>> {
    try {
      const { data } = await this.axios.patch<AttendanceRecord>(`/api/attendance/records/${id}`, body)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async deleteRecord(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete<void>(`/api/attendance/records/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
