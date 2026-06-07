export type MemberStatus = 'guest' | 'member' | 'leader'
export type MemberType = 'adult' | 'child'
export type ActivityStatus = 'active' | 'inactive'

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
  joinedAfter?: string
}
