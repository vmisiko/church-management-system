export type FollowUpStatus = "open" | "completed" | "cancelled"
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
  ownerId: string | null
  title: string
  notes: string | null
  dueDate: string
  status: FollowUpStatus
  completedAt: string | null
  createdAt: string
  updatedAt: string
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
