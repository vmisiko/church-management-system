import type { StoreApi } from 'zustand'
import { Ploc } from '@/core/application/ploc'
import type { AttendanceState } from './useAttendanceState'
import type { GetSessionsUseCase } from '@/domain/usecases/attendance/GetSessionsUseCase'
import type { GetSessionByIdUseCase } from '@/domain/usecases/attendance/GetSessionByIdUseCase'
import type { CreateSessionUseCase } from '@/domain/usecases/attendance/CreateSessionUseCase'
import type { UpdateSessionUseCase } from '@/domain/usecases/attendance/UpdateSessionUseCase'
import type { DeleteSessionUseCase } from '@/domain/usecases/attendance/DeleteSessionUseCase'
import type { GetSessionRecordsUseCase } from '@/domain/usecases/attendance/GetSessionRecordsUseCase'
import type { RecordAttendanceUseCase } from '@/domain/usecases/attendance/RecordAttendanceUseCase'
import type { GetMemberAttendanceUseCase } from '@/domain/usecases/attendance/GetMemberAttendanceUseCase'
import type { UpdateAttendanceRecordUseCase } from '@/domain/usecases/attendance/UpdateAttendanceRecordUseCase'
import type { DeleteAttendanceRecordUseCase } from '@/domain/usecases/attendance/DeleteAttendanceRecordUseCase'
import type {
  CreateSessionRequest,
  UpdateSessionRequest,
  RecordAttendanceRequest,
  UpdateAttendanceRecordRequest,
} from '@/domain/entities/attendance/Attendance'

export class AttendancePloc extends Ploc<StoreApi<AttendanceState>> {
  private readonly getSessionsUseCase: GetSessionsUseCase
  private readonly getSessionByIdUseCase: GetSessionByIdUseCase
  private readonly createSessionUseCase: CreateSessionUseCase
  private readonly updateSessionUseCase: UpdateSessionUseCase
  private readonly deleteSessionUseCase: DeleteSessionUseCase
  private readonly getSessionRecordsUseCase: GetSessionRecordsUseCase
  private readonly recordAttendanceUseCase: RecordAttendanceUseCase
  private readonly getMemberAttendanceUseCase: GetMemberAttendanceUseCase
  private readonly updateAttendanceRecordUseCase: UpdateAttendanceRecordUseCase
  private readonly deleteAttendanceRecordUseCase: DeleteAttendanceRecordUseCase

  constructor({
    store,
    getSessionsUseCase,
    getSessionByIdUseCase,
    createSessionUseCase,
    updateSessionUseCase,
    deleteSessionUseCase,
    getSessionRecordsUseCase,
    recordAttendanceUseCase,
    getMemberAttendanceUseCase,
    updateAttendanceRecordUseCase,
    deleteAttendanceRecordUseCase,
  }: {
    store: StoreApi<AttendanceState>
    getSessionsUseCase: GetSessionsUseCase
    getSessionByIdUseCase: GetSessionByIdUseCase
    createSessionUseCase: CreateSessionUseCase
    updateSessionUseCase: UpdateSessionUseCase
    deleteSessionUseCase: DeleteSessionUseCase
    getSessionRecordsUseCase: GetSessionRecordsUseCase
    recordAttendanceUseCase: RecordAttendanceUseCase
    getMemberAttendanceUseCase: GetMemberAttendanceUseCase
    updateAttendanceRecordUseCase: UpdateAttendanceRecordUseCase
    deleteAttendanceRecordUseCase: DeleteAttendanceRecordUseCase
  }) {
    super({ store })
    this.getSessionsUseCase = getSessionsUseCase
    this.getSessionByIdUseCase = getSessionByIdUseCase
    this.createSessionUseCase = createSessionUseCase
    this.updateSessionUseCase = updateSessionUseCase
    this.deleteSessionUseCase = deleteSessionUseCase
    this.getSessionRecordsUseCase = getSessionRecordsUseCase
    this.recordAttendanceUseCase = recordAttendanceUseCase
    this.getMemberAttendanceUseCase = getMemberAttendanceUseCase
    this.updateAttendanceRecordUseCase = updateAttendanceRecordUseCase
    this.deleteAttendanceRecordUseCase = deleteAttendanceRecordUseCase
  }

  async fetchSessions(): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getSessionsUseCase.execute()
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (sessions) => this.store.setState({ loading: false, sessions }),
    )
  }

  async fetchSessionById(id: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getSessionByIdUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (currentSession) => this.store.setState({ loading: false, currentSession }),
    )
  }

  async createSession(data: CreateSessionRequest): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.createSessionUseCase.execute(data)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (session) => {
        const current = this.store.getState().sessions
        this.store.setState({ submitting: false, sessions: [session, ...current] })
      },
    )
  }

  async updateSession(id: string, data: UpdateSessionRequest): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.updateSessionUseCase.execute(id, data)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (updated) => {
        const sessions = this.store.getState().sessions.map((s) => (s.id === id ? updated : s))
        const currentSession =
          this.store.getState().currentSession?.id === id
            ? updated
            : this.store.getState().currentSession
        this.store.setState({ submitting: false, sessions, currentSession })
      },
    )
  }

  async deleteSession(id: string): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.deleteSessionUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      () => {
        const sessions = this.store.getState().sessions.filter((s) => s.id !== id)
        const currentSession =
          this.store.getState().currentSession?.id === id
            ? null
            : this.store.getState().currentSession
        this.store.setState({ submitting: false, sessions, currentSession })
      },
    )
  }

  async fetchSessionRecords(sessionId: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getSessionRecordsUseCase.execute(sessionId)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (sessionRecords) => this.store.setState({ loading: false, sessionRecords }),
    )
  }

  async recordAttendance(data: RecordAttendanceRequest): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.recordAttendanceUseCase.execute(data)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      async () => {
        this.store.setState({ submitting: false })
        await this.fetchSessionRecords(data.sessionId)
      },
    )
  }

  async fetchMemberAttendance(memberId: string): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getMemberAttendanceUseCase.execute(memberId)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (memberRecords) => this.store.setState({ loading: false, memberRecords }),
    )
  }

  async updateRecord(id: string, data: UpdateAttendanceRecordRequest): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.updateAttendanceRecordUseCase.execute(id, data)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      (updated) => {
        const sessionRecords = this.store
          .getState()
          .sessionRecords.map((r) => (r.id === id ? updated : r))
        const memberRecords = this.store
          .getState()
          .memberRecords.map((r) => (r.id === id ? updated : r))
        this.store.setState({ submitting: false, sessionRecords, memberRecords })
      },
    )
  }

  async deleteRecord(id: string): Promise<void> {
    this.store.setState({ submitting: true, error: null })
    const result = await this.deleteAttendanceRecordUseCase.execute(id)
    result.fold(
      (error) => this.store.setState({ submitting: false, error: this.handleError(error) }),
      () => {
        const sessionRecords = this.store.getState().sessionRecords.filter((r) => r.id !== id)
        const memberRecords = this.store.getState().memberRecords.filter((r) => r.id !== id)
        this.store.setState({ submitting: false, sessionRecords, memberRecords })
      },
    )
  }
}
