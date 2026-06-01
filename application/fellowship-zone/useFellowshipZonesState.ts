import { create } from 'zustand'
import type { FellowshipZone } from '@/domain/entities/fellowship-zone/FellowshipZone'

export interface FellowshipZonesState {
  fellowshipZones: FellowshipZone[]
  selectedFellowshipZone: FellowshipZone | null
  loading: boolean
  submitting: boolean
  error: string | null
}

const useFellowshipZonesState = create<FellowshipZonesState>()(() => ({
  fellowshipZones: [],
  selectedFellowshipZone: null,
  loading: false,
  submitting: false,
  error: null,
}))

export default useFellowshipZonesState
