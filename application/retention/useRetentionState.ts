import { create } from "zustand"
import type { AtRiskMember, RetentionStats } from "@/domain/entities/retention/Retention"

export interface RetentionState {
  stats: RetentionStats | null
  atRiskMembers: AtRiskMember[]
  atRiskTotal: number
  atRiskPage: number
  atRiskLimit: number
  loading: boolean
  atRiskLoading: boolean
  error: string | null
}

const useRetentionState = create<RetentionState>(() => ({
  stats: null,
  atRiskMembers: [],
  atRiskTotal: 0,
  atRiskPage: 1,
  atRiskLimit: 20,
  loading: false,
  atRiskLoading: false,
  error: null,
}))

export default useRetentionState
