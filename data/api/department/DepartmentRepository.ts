import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'
import { BaseRepository } from '@/core/data/repository/BaseRepository'
import { mapToDataError } from '@/core/utility/mapToDataError'
import type CustomAxios from '@/core/utility/CustomAxios'
import type { IDepartmentRepository } from '@/domain/repository/IDepartmentRepository'
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '@/domain/entities/department/Department'

export class DepartmentRepository extends BaseRepository implements IDepartmentRepository {
  constructor({ axios }: { axios: CustomAxios }) {
    super({ axios })
  }

  async getAll(): Promise<Either<DataError, Department[]>> {
    try {
      const { data } = await this.axios.get<Department[]>('/api/departments')
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async getById(id: string): Promise<Either<DataError, Department>> {
    try {
      const { data } = await this.axios.get<Department>(`/api/departments/${id}`)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async create(params: CreateDepartmentRequest): Promise<Either<DataError, Department>> {
    try {
      const { data } = await this.axios.post<Department>('/api/departments', params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async update(id: string, params: UpdateDepartmentRequest): Promise<Either<DataError, Department>> {
    try {
      const { data } = await this.axios.patch<Department>(`/api/departments/${id}`, params)
      return Either.right(data)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }

  async delete(id: string): Promise<Either<DataError, void>> {
    try {
      await this.axios.delete<void>(`/api/departments/${id}`)
      return Either.right(undefined)
    } catch (error) {
      return Either.left(mapToDataError(error))
    }
  }
}
