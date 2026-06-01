import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type {
  DamageReport,
  CreateDamageReportRequest,
  UpdateDamageReportRequest,
} from '@/domain/entities/inventory/DamageReport'

export interface IDamageReportRepository {
  getAll(): Promise<Either<DataError, DamageReport[]>>
  getById(id: string): Promise<Either<DataError, DamageReport>>
  create(params: CreateDamageReportRequest): Promise<Either<DataError, DamageReport>>
  update(id: string, params: UpdateDamageReportRequest): Promise<Either<DataError, DamageReport>>
  delete(id: string): Promise<Either<DataError, void>>
}
