export type SessionType = 'sunday_service' | 'midweek_service' | 'fellowship' | 'special_event'
export type AttendanceStatus = 'present' | 'absent' | 'excused'

export interface AttendanceSession {
  id: string
  title: string
  sessionType: SessionType
  sessionDate: string
  fellowshipId: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface SessionSummary {
  id: string
  title: string
  sessionType: SessionType
  sessionDate: string
  present: number
  absent: number
  excused: number
  adults: number
  children: number
  firstTimers: number
  guests: number
  members: number
}

export interface CreateSessionRequest {
  title: string
  sessionType: SessionType
  sessionDate: string
  fellowshipId?: string | null
  notes?: string | null
}

export interface UpdateSessionRequest {
  title?: string
  sessionType?: SessionType
  sessionDate?: string
  fellowshipId?: string | null
  notes?: string | null
}

export interface AttendanceRecord {
  id: string
  sessionId: string
  memberId: string
  status: AttendanceStatus
  checkedInAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface RecordAttendanceRequest {
  sessionId: string
  memberId: string
  status: AttendanceStatus
  checkedInAt?: string | null
  notes?: string | null
}

export interface UpdateAttendanceRecordRequest {
  status?: AttendanceStatus
  checkedInAt?: string | null
  notes?: string | null
}
