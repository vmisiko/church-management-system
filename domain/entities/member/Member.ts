export type MemberStatus = 'guest' | 'member' | 'leader'
export type MemberType = 'adult' | 'child'
export type ActivityStatus = 'active' | 'inactive'
export type AgeGroup = 'under_18' | '18_25' | '26_35' | '36_50' | 'above_50'
export type ChurchRole = 'church_member' | 'elder' | 'first_time_visitor' | 'online_member' | 'overseer' | 'pastor' | 'regular_attendee'
export type Gender = 'male' | 'female' | 'other'

export interface Member {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  email: string | null
  status: MemberStatus
  fellowshipId: string | null
  memberType: MemberType
  activityStatus: ActivityStatus
  joinedAt: string
  avatarUrl: string | null
  gender: Gender | null
  ageGroup: AgeGroup | null
  churchRole: ChurchRole | null
  isOnline: boolean
  isInternational: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateMemberRequest {
  firstName: string
  lastName: string
  phone?: string
  email?: string
  status?: MemberStatus
  fellowshipId?: string
  memberType?: MemberType
  activityStatus?: ActivityStatus
  gender?: Gender
  ageGroup?: AgeGroup
  churchRole?: ChurchRole
  isOnline?: boolean
  isInternational?: boolean
}

export interface UpdateMemberRequest {
  firstName?: string
  lastName?: string
  phone?: string | null
  email?: string | null
  status?: MemberStatus
  fellowshipId?: string | null
  memberType?: MemberType
  activityStatus?: ActivityStatus
  avatarUrl?: string | null
  gender?: Gender | null
  ageGroup?: AgeGroup | null
  churchRole?: ChurchRole | null
  isOnline?: boolean
  isInternational?: boolean
}

export interface MemberDepartment {
  id: string
  name: string
}

export interface MemberQueryParams {
  status?: MemberStatus
  hasFellowship?: boolean
  fellowshipId?: string
  departmentId?: string
  memberType?: MemberType
  activityStatus?: ActivityStatus
  joinDateRange?: 'recently' | 'week' | 'month'
}

export interface BulkImportRow {
  fullName: string
  rowIndex?: number
  phone?: string
  email?: string
  gender?: Gender
  ageGroup?: AgeGroup
  fellowshipId?: string
  churchRole?: ChurchRole
  isOnline?: boolean
  isInternational?: boolean
  wantsUpdates?: boolean
}

export interface BulkImportResult {
  imported: number
  duplicates: number
  errors: { row: number; name: string; reason: string }[]
  members: Member[]
}
