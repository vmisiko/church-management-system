export interface CohortResult {
  eligible: number
  retained: number
  rate: number
}

export interface CohortRetention {
  d30: CohortResult
  d60: CohortResult
  d90: CohortResult
}

export interface GuestConversion {
  total: number
  converted: number
  rate: number
  note: string
}

export interface FollowUpCompletion {
  total: number
  completed: number
  rate: number
}

export interface MonthlyTrendPoint {
  month: string
  eligible: number
  rate: number
}

export interface BreakdownRow {
  id: string
  name: string
  memberCount: number
  activeCount: number
}

export interface RetentionStats {
  cohortRetention: CohortRetention
  guestConversion: GuestConversion
  followUpCompletion: FollowUpCompletion
  trend: MonthlyTrendPoint[]
  departmentBreakdown?: BreakdownRow[]
  fellowshipBreakdown?: BreakdownRow[]
}

export interface RetentionStatsQuery {
  from?: string
  to?: string
  departmentId?: string
  fellowshipId?: string
}

export type AtRiskReason = "inactive" | "stale_guest"

export interface AtRiskMember {
  id: string
  firstName: string
  lastName: string
  status: string
  activityStatus: string
  joinedAt: string
  reason: AtRiskReason
}

export interface AtRiskMembersResponse {
  members: AtRiskMember[]
  total: number
  page: number
  limit: number
}
