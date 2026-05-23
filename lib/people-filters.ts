import { fellowshipFilterOptions } from "@/lib/fellowships"

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
  { value: "Guest", label: "Guest" },
  { value: "Member", label: "Member" },
  { value: "Leader", label: "Leader" },
]

export const fellowships = fellowshipFilterOptions

export const departments = [
  { value: "all", label: "All Departments" },
  { value: "Choir", label: "Choir" },
  { value: "Media", label: "Media" },
  { value: "Ushers", label: "Ushers" },
  { value: "Children", label: "Children" },
  { value: "Youth", label: "Youth" },
  { value: "Welfare", label: "Welfare" },
]

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
