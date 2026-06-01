import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type {
  AttendanceSession,
  AttendanceRecord,
  CreateSessionRequest,
  UpdateSessionRequest,
  RecordAttendanceRequest,
  UpdateAttendanceRecordRequest,
} from '@/domain/entities/attendance/Attendance'

export interface IAttendanceRepository {
  getSessions(): Promise<Either<DataError, AttendanceSession[]>>
  createSession(data: CreateSessionRequest): Promise<Either<DataError, AttendanceSession>>
  getSessionById(id: string): Promise<Either<DataError, AttendanceSession>>
  updateSession(id: string, data: UpdateSessionRequest): Promise<Either<DataError, AttendanceSession>>
  deleteSession(id: string): Promise<Either<DataError, void>>
  getSessionRecords(sessionId: string): Promise<Either<DataError, AttendanceRecord[]>>
  recordAttendance(data: RecordAttendanceRequest): Promise<Either<DataError, AttendanceRecord>>
  getMemberRecords(memberId: string): Promise<Either<DataError, AttendanceRecord[]>>
  updateRecord(id: string, data: UpdateAttendanceRecordRequest): Promise<Either<DataError, AttendanceRecord>>
  deleteRecord(id: string): Promise<Either<DataError, void>>
}
