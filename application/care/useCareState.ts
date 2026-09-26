import { create } from 'zustand'
import type { CareRecord } from '@/domain/entities/care/CareRecord'

export interface CareState {
  records: CareRecord[]
  loading: boolean
  submitting: boolean
  error: string | null
}

const useCareState = create<CareState>(() => ({
  records: [],
  loading: false,
  submitting: false,
  error: null,
}))

export default useCareState
