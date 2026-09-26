export type CareRecordType = 'visit' | 'call' | 'hospital' | 'bereavement' | 'financial_need' | 'other'
export type CareRecordStatus = 'open' | 'resolved'

export interface CareRecord {
  id: string
  memberId: string
  type: CareRecordType
  notes: string | null
  handledBy: string | null
  status: CareRecordStatus
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
}

export interface CreateCareRecordRequest {
  type: CareRecordType
  notes?: string | null
}

export interface UpdateCareRecordRequest {
  type?: CareRecordType
  notes?: string | null
  status?: CareRecordStatus
}
