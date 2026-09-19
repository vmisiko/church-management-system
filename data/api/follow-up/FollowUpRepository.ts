import { Either } from "@/core/domain/Either"
import type { DataError } from "@/core/domain/DataError"
import { BaseRepository } from "@/core/data/repository/BaseRepository"
import { mapToDataError } from "@/core/utility/mapToDataError"
import type CustomAxios from "@/core/utility/CustomAxios"
import type { IFollowUpRepository } from "@/domain/repository/IFollowUpRepository"
import type { CreateFollowUpInput, FollowUpAttempt, FollowUpEscalation, FollowUpStatus, FollowUpTask, RecordFollowUpAttemptInput, UpdateFollowUpInput } from "@/domain/entities/follow-up/FollowUp"

export class FollowUpRepository extends BaseRepository implements IFollowUpRepository {
  constructor({ axios }: { axios: CustomAxios }) { super({ axios }) }
  async getAll(status?: FollowUpStatus): Promise<Either<DataError, FollowUpTask[]>> { try { const { data } = await this.axios.get<FollowUpTask[]>("/api/follow-ups", { params: status ? { status } : undefined }); return Either.right(data) } catch (error) { return Either.left(mapToDataError(error)) } }
  async getById(id: string): Promise<Either<DataError, { task: FollowUpTask; attempts: FollowUpAttempt[] }>> { try { const { data } = await this.axios.get(`/api/follow-ups/${id}`); return Either.right(data) } catch (error) { return Either.left(mapToDataError(error)) } }
  async create(input: CreateFollowUpInput): Promise<Either<DataError, FollowUpTask>> { try { const { data } = await this.axios.post<FollowUpTask>("/api/follow-ups", input); return Either.right(data) } catch (error) { return Either.left(mapToDataError(error)) } }
  async update(id: string, input: UpdateFollowUpInput): Promise<Either<DataError, FollowUpTask>> { try { const { data } = await this.axios.patch<FollowUpTask>(`/api/follow-ups/${id}`, input); return Either.right(data) } catch (error) { return Either.left(mapToDataError(error)) } }
  async recordAttempt(id: string, input: RecordFollowUpAttemptInput): Promise<Either<DataError, { task: FollowUpTask; attempt: FollowUpAttempt }>> { try { const { data } = await this.axios.post(`/api/follow-ups/${id}/attempts`, input); return Either.right(data) } catch (error) { return Either.left(mapToDataError(error)) } }
  async getEscalations(id: string): Promise<Either<DataError, FollowUpEscalation[]>> { try { const { data } = await this.axios.get<FollowUpEscalation[]>(`/api/follow-ups/${id}/escalations`); return Either.right(data) } catch (error) { return Either.left(mapToDataError(error)) } }
}
