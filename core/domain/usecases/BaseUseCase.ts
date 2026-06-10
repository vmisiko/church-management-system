import { Either } from '@/core/domain/Either'
import type { DataError } from '@/core/domain/DataError'

export class BaseUseCase<T, R> {
  constructor(private readonly repository: Record<string, unknown>) {}

  async execute(command: T): Promise<Either<DataError, R>> {
    return this.repository.create(command)
  }
}
