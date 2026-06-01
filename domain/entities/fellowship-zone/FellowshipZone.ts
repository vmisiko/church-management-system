export interface FellowshipZone {
  id: string
  name: string
}

export interface CreateFellowshipZoneRequest {
  name: string
}

export interface UpdateFellowshipZoneRequest {
  name?: string
}
