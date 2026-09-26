import { create } from 'zustand'
import type { MilestoneType, MemberMilestone } from '@/domain/entities/milestone/Milestone'

export interface MilestonesState {
  types: MilestoneType[]
  memberMilestones: MemberMilestone[]
  loading: boolean
  submitting: boolean
  error: string | null
}

const useMilestonesState = create<MilestonesState>(() => ({
  types: [],
  memberMilestones: [],
  loading: false,
  submitting: false,
  error: null,
}))

export default useMilestonesState
