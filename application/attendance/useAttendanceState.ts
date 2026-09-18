import { create } from 'zustand'
import type { AttendanceSession, SessionSummary, AttendanceRecord } from '@/domain/entities/attendance/Attendance'

export interface AttendanceState {
  sessions: AttendanceSession[]
  sessionSummaries: SessionSummary[]
  currentSession: AttendanceSession | null
  sessionRecords: AttendanceRecord[]
  memberRecords: AttendanceRecord[]
  loading: boolean
  submitting: boolean
  error: string | null
}

const useAttendanceState = create<AttendanceState>(
  (): AttendanceState => ({
    sessions: [],
    sessionSummaries: [],
    currentSession: null,
    sessionRecords: [],
    memberRecords: [],
    loading: false,
    submitting: false,
    error: null,
  }),
)

export default useAttendanceState
