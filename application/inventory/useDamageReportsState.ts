import { create } from 'zustand'
import type { DamageReport } from '@/domain/entities/inventory/DamageReport'

export interface DamageReportsState {
  reports: DamageReport[]
  selectedReport: DamageReport | null
  loading: boolean
  submitting: boolean
  error: string | null
}

const useDamageReportsState = create<DamageReportsState>(
  (): DamageReportsState => ({
    reports: [],
    selectedReport: null,
    loading: false,
    submitting: false,
    error: null,
  }),
)

export default useDamageReportsState
