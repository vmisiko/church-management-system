export type DamageType = 'broken' | 'lost' | 'stolen' | 'wear' | 'other'
export type DamageSeverity = 'minor' | 'moderate' | 'severe' | 'total_loss'
export type DamageStatus = 'pending' | 'investigating' | 'resolved' | 'written_off'

export interface DamageReport {
  id: string
  itemId: string
  reportedById: string | null
  reportedByName: string
  damageType: DamageType
  severity: DamageSeverity
  quantityAffected: number
  description: string
  reportDate: string
  status: DamageStatus
  resolution: string | null
  resolvedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateDamageReportRequest {
  itemId: string
  reportedByName: string
  damageType: DamageType
  severity: DamageSeverity
  quantityAffected: number
  description: string
  reportedById?: string
}

export interface UpdateDamageReportRequest {
  status?: DamageStatus
  resolution?: string
  resolvedBy?: string
}
