import { create } from 'zustand'
import type { Fellowship } from '@/domain/entities/fellowship/Fellowship'

export interface FellowshipsState {
  fellowships: Fellowship[]
  currentFellowship: Fellowship | null
  loading: boolean
  submitting: boolean
  error: string | null
}

const useFellowshipsState = create<FellowshipsState>()(() => ({
  fellowships: [],
  currentFellowship: null,
  loading: false,
  submitting: false,
  error: null,
}))

export default useFellowshipsState
