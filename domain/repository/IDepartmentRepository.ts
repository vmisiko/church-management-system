import type { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '@/domain/entities/department/Department'

export interface IDepartmentRepository {
  getAll(): Promise<Either<DataError, Department[]>>
  getById(id: string): Promise<Either<DataError, Department>>
  create(params: CreateDepartmentRequest): Promise<Either<DataError, Department>>
  update(id: string, params: UpdateDepartmentRequest): Promise<Either<DataError, Department>>
  delete(id: string): Promise<Either<DataError, void>>
}
