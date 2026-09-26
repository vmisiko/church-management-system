export interface FellowshipZone {
  id: string
  name: string
  overseerId: string | null
}

export interface CreateFellowshipZoneRequest {
  name: string
  overseerId?: string | null
}

export interface UpdateFellowshipZoneRequest {
  name?: string
  overseerId?: string | null
}
