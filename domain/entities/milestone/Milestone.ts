export interface MilestoneType {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface MemberMilestone {
  id: string
  memberId: string
  milestoneTypeId: string
  achievedAt: string
  notes: string | null
  createdAt: string
}

export interface CreateMilestoneTypeRequest {
  name: string
  description?: string | null
}

export interface UpdateMilestoneTypeRequest {
  name?: string
  description?: string | null
}

export interface RecordMemberMilestoneRequest {
  milestoneTypeId: string
  achievedAt?: string
  notes?: string | null
}
