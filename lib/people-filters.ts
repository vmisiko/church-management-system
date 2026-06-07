import { fellowshipFilterOptions } from "@/lib/fellowships"
import type { MemberQueryParams, MemberStatus, ActivityStatus, MemberType } from "@/domain/entities/member/Member"

export interface PeopleFilterState {
  status: string
  inFellowship: boolean | null
  fellowship: string
  department: string
  memberType: string[]
  activityStatus: string
  joinDateRange: string
}

export const defaultPeopleFilters: PeopleFilterState = {
  status: "all",
  inFellowship: null,
  fellowship: "all",
  department: "all",
  memberType: [],
  activityStatus: "all",
  joinDateRange: "all",
}

export const statuses = [
  { value: "all", label: "All Status" },
  { value: "guest", label: "Guest" },
  { value: "member", label: "Member" },
  { value: "leader", label: "Leader" },
]

export const fellowships = fellowshipFilterOptions

export const memberTypes = [
  { value: "adult", label: "Adult" },
  { value: "child", label: "Child" },
]

export const activityStatuses = [
  { value: "all", label: "All Activity" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export const joinDateRanges = [
  { value: "all", label: "All Time" },
  { value: "recently", label: "Recently Added" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
]

export function countActiveFilters(filters: PeopleFilterState): number {
  let count = 0
  if (filters.status !== "all") count++
  if (filters.inFellowship !== null) count++
  if (filters.fellowship !== "all") count++
  if (filters.department !== "all") count++
  if (filters.memberType.length > 0) count++
  if (filters.activityStatus !== "all") count++
  if (filters.joinDateRange !== "all") count++
  return count
}

export function hasActiveFilters(filters: PeopleFilterState): boolean {
  return countActiveFilters(filters) > 0
}

export function toMemberQueryParams(filters: PeopleFilterState): MemberQueryParams {
  const params: MemberQueryParams = {}

  if (filters.status !== "all") params.status = filters.status as MemberStatus
  if (filters.activityStatus !== "all") params.activityStatus = filters.activityStatus as ActivityStatus

  if (filters.inFellowship === false) {
    params.hasFellowship = false
  } else if (filters.fellowship !== "all") {
    params.fellowshipId = filters.fellowship
  } else if (filters.inFellowship === true) {
    params.hasFellowship = true
  }

  if (filters.department !== "all") params.departmentId = filters.department

  if (filters.memberType.length === 1) {
    params.memberType = filters.memberType[0] as MemberType
  }

  if (filters.joinDateRange !== "all") {
    params.joinDateRange = filters.joinDateRange as 'recently' | 'week' | 'month'
  }

  return params
}
