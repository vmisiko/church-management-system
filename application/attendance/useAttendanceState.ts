import { create } from 'zustand'
import type { AttendanceSession, AttendanceRecord } from '@/domain/entities/attendance/Attendance'

export interface AttendanceState {
  sessions: AttendanceSession[]
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
    currentSession: null,
    sessionRecords: [],
    memberRecords: [],
    loading: false,
    submitting: false,
    error: null,
  }),
)

export default useAttendanceState
