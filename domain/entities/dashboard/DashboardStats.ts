export interface MemberStats {
  total: number
  active: number
  inactive: number
  firstTimeVisitors: number
  byStatus: { guest: number; member: number; leader: number }
  byType: { adult: number; child: number }
  /** Keyed by stored age group (under_18, 18_25, 26_35, 36_50, above_50); "unknown" when unset. */
  byAgeGroup: Record<string, number>
  /** Keyed male, female, unspecified. */
  byGender: Record<string, number>
  online: number
  international: number
}

export interface ZoneSummary {
  id: string
  name: string
  fellowshipCount: number
  activeFellowships: number
  memberCount: number
  /** Full day names as entered on each fellowship, e.g. "Friday". */
  meetingDays: string[]
}

export interface FellowshipStats {
  total: number
  active: number
  inactive: number
  /** Zones that have at least one fellowship. */
  zones: ZoneSummary[]
}

export interface DepartmentStats {
  total: number
}

export interface LastSessionStats {
  id: string
  title: string
  sessionDate: string
  totalRecorded: number
  present: number
  absent: number
  excused: number
  attendanceRate: number
}

export interface AttendanceStats {
  totalSessions: number
  lastSession: LastSessionStats | null
}

export interface RecentMessage {
  id: string
  title: string
  type: string
  targetGroup: string
  sentAt: string | null
  /** Percent of this message's deliveries that were delivered. */
  deliveryRate: number
}

export interface MessagingStats {
  totalMessages: number
  sent: number
  drafts: number
  totalDeliveries: number
  delivered: number
  sentDeliveries: number
  pendingDeliveries: number
  failedDeliveries: number
  recent: RecentMessage[]
}

export interface InventoryStats {
  totalItems: number
  lowStockItems: number
  pendingDamageReports: number
}

export interface RecentFollowUpAttempt {
  id: string
  taskId: string
  taskTitle: string
  memberName: string
  contactMethod: string
  outcome: string
  contactedAt: string
}

export interface FollowUpStats {
  open: number
  overdue: number
  completed: number
  unassigned: number
  completionRate: number
  recentAttempts: RecentFollowUpAttempt[]
}

export interface AttentionStats {
  lowStock: { id: string; name: string; availableQty: number; totalQty: number }[]
  pendingDamage: { id: string; itemName: string; severity: string; quantityAffected: number }[]
  fellowshipsWithoutLeader: { id: string; name: string; zoneName: string }[]
  /** Largest shortfall first. */
  departmentsBelowTarget: { id: string; name: string; target: number; memberCount: number }[]
}

export interface DashboardStats {
  members: MemberStats
  fellowships: FellowshipStats
  departments: DepartmentStats
  attendance: AttendanceStats
  messaging: MessagingStats
  inventory: InventoryStats
  followUps: FollowUpStats
  attention: AttentionStats
}
