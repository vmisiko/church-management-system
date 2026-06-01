import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type {
  Fellowship,
  CreateFellowshipRequest,
  UpdateFellowshipRequest,
} from '@/domain/entities/fellowship/Fellowship'

export interface IFellowshipRepository {
  getAll(): Promise<Either<DataError, Fellowship[]>>
  getById(id: string): Promise<Either<DataError, Fellowship>>
  getBySlug(slug: string): Promise<Either<DataError, Fellowship>>
  create(params: CreateFellowshipRequest): Promise<Either<DataError, Fellowship>>
  update(id: string, params: UpdateFellowshipRequest): Promise<Either<DataError, Fellowship>>
  delete(id: string): Promise<Either<DataError, void>>
}
