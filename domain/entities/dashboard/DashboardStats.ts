export interface MemberStats {
  total: number
  active: number
  inactive: number
  firstTimeVisitors: number
  byStatus: { guest: number; member: number; leader: number }
  byType: { adult: number; child: number }
}

export interface FellowshipStats {
  total: number
  active: number
  inactive: number
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

export interface MessagingStats {
  totalMessages: number
  sent: number
  drafts: number
  totalDeliveries: number
  delivered: number
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

export interface DashboardStats {
  members: MemberStats
  fellowships: FellowshipStats
  departments: DepartmentStats
  attendance: AttendanceStats
  messaging: MessagingStats
  inventory: InventoryStats
  followUps: FollowUpStats
}
