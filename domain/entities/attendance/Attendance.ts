export type AttendanceType = 'service' | 'midweek' | 'special'

export interface AttendanceSession {
  id: string
  name: string
  type: AttendanceType
  eventDate: string
  adultsCount: number
  childrenCount: number
  firstTimersCount: number
  totalCount: number
  recordedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateSessionRequest {
  name: string
  type: AttendanceType
  eventDate: string
  adultsCount?: number
  childrenCount?: number
  firstTimersCount?: number
}

export interface UpdateSessionRequest {
  name?: string
  type?: AttendanceType
  eventDate?: string
  adultsCount?: number
  childrenCount?: number
  firstTimersCount?: number
}

export interface AttendanceRecord {
  id: string
  sessionId: string
  memberId: string
  present: boolean
  createdAt: string
  updatedAt: string
}

export interface RecordAttendanceRequest {
  sessionId: string
  memberId: string
  present: boolean
}

export interface UpdateAttendanceRecordRequest {
  present?: boolean
}
