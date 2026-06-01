export interface Fellowship {
  id: string
  name: string
  slug: string
  zoneId: string
  leaderId: string | null
  meetingDay: string
  meetingTime: string
  location: string
  status: 'active' | 'inactive'
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateFellowshipRequest {
  name: string
  zoneId: string
  meetingDay: string
  meetingTime: string
  location: string
  status?: 'active' | 'inactive'
  description?: string
  leaderId?: string
}

export interface UpdateFellowshipRequest {
  name?: string
  zoneId?: string
  meetingDay?: string
  meetingTime?: string
  location?: string
  status?: 'active' | 'inactive'
  description?: string
  leaderId?: string | null
}
