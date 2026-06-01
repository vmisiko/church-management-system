import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type {
  FellowshipZone,
  CreateFellowshipZoneRequest,
  UpdateFellowshipZoneRequest,
} from '@/domain/entities/fellowship-zone/FellowshipZone'

export interface IFellowshipZoneRepository {
  getAll(): Promise<Either<DataError, FellowshipZone[]>>
  getById(id: string): Promise<Either<DataError, FellowshipZone>>
  create(params: CreateFellowshipZoneRequest): Promise<Either<DataError, FellowshipZone>>
  update(id: string, params: UpdateFellowshipZoneRequest): Promise<Either<DataError, FellowshipZone>>
  delete(id: string): Promise<Either<DataError, void>>
}
