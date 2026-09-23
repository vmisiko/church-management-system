export type FollowUpStatus = "open" | "completed" | "cancelled"
export type FollowUpSource = "manual" | "visitor_automation" | "inactivity_automation"
export type FollowUpContactMethod = "call" | "sms" | "email" | "visit" | "other"
export type FollowUpOutcome =
  | "connected"
  | "no_answer"
  | "requested_callback"
  | "not_interested"
  | "wrong_number"
  | "other"

export interface FollowUpTask {
  id: string
  memberId: string
  /** Present when the backend joined the member row; falls back to a members-list lookup by memberId if absent. */
  member?: { id: string; firstName: string; lastName: string } | null
  ownerId: string | null
  title: string
  notes: string | null
  dueDate: string
  status: FollowUpStatus
  source: FollowUpSource
  escalationLevel: number
  escalatedAt: string | null
  escalatedToId: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface FollowUpEscalation {
  id: string
  taskId: string
  fromOwnerId: string | null
  toOwnerId: string
  reason: string
  escalatedAt: string
}

export interface FollowUpAttempt {
  id: string
  taskId: string
  contactMethod: FollowUpContactMethod
  outcome: FollowUpOutcome
  notes: string | null
  contactedAt: string
  createdById: string | null
  createdAt: string
}

export interface CreateFollowUpInput {
  memberId: string
  ownerId?: string | null
  title: string
  notes?: string | null
  dueDate: string
}

export interface UpdateFollowUpInput {
  memberId?: string
  ownerId?: string | null
  title?: string
  notes?: string | null
  dueDate?: string
  status?: FollowUpStatus
}

export interface RecordFollowUpAttemptInput {
  contactMethod: FollowUpContactMethod
  outcome: FollowUpOutcome
  notes?: string | null
  contactedAt?: string
}
