import type { StoreApi } from "zustand"
import { Ploc } from "@/core/application/ploc"
import type { FollowUpsState } from "./useFollowUpsState"
import type { FollowUpStatus, CreateFollowUpInput, RecordFollowUpAttemptInput, UpdateFollowUpInput } from "@/domain/entities/follow-up/FollowUp"
import type { GetFollowUpsUseCase } from "@/domain/usecases/follow-up/GetFollowUpsUseCase"
import type { CreateFollowUpUseCase } from "@/domain/usecases/follow-up/CreateFollowUpUseCase"
import type { UpdateFollowUpUseCase } from "@/domain/usecases/follow-up/UpdateFollowUpUseCase"
import type { RecordFollowUpAttemptUseCase } from "@/domain/usecases/follow-up/RecordFollowUpAttemptUseCase"
import type { GetFollowUpEscalationsUseCase } from "@/domain/usecases/follow-up/GetFollowUpEscalationsUseCase"

export class FollowUpsPloc extends Ploc<StoreApi<FollowUpsState>> {
  constructor(private readonly deps: { store: StoreApi<FollowUpsState>; getFollowUpsUseCase: GetFollowUpsUseCase; createFollowUpUseCase: CreateFollowUpUseCase; updateFollowUpUseCase: UpdateFollowUpUseCase; recordFollowUpAttemptUseCase: RecordFollowUpAttemptUseCase; getFollowUpEscalationsUseCase: GetFollowUpEscalationsUseCase }) { super({ store: deps.store }) }
  async fetchAll(status?: FollowUpStatus): Promise<void> { this.deps.store.setState({ loading: true, error: null }); const result = await this.deps.getFollowUpsUseCase.execute(status); result.fold((error) => this.deps.store.setState({ loading: false, error: this.handleError(error) }), (tasks) => this.deps.store.setState({ loading: false, tasks })) }
  async create(input: CreateFollowUpInput): Promise<boolean> { this.deps.store.setState({ submitting: true, error: null }); const result = await this.deps.createFollowUpUseCase.execute(input); return result.fold((error) => { this.deps.store.setState({ submitting: false, error: this.handleError(error) }); return false }, (task) => { this.deps.store.setState((state) => ({ submitting: false, tasks: [task, ...state.tasks] })); return true }) }
  async update(id: string, input: UpdateFollowUpInput): Promise<boolean> { this.deps.store.setState({ submitting: true, error: null }); const result = await this.deps.updateFollowUpUseCase.execute(id, input); return result.fold((error) => { this.deps.store.setState({ submitting: false, error: this.handleError(error) }); return false }, (task) => { this.deps.store.setState((state) => ({ submitting: false, tasks: state.tasks.map((current) => current.id === id ? task : current), selectedTask: state.selectedTask?.id === id ? task : state.selectedTask })); return true }) }
  async recordAttempt(id: string, input: RecordFollowUpAttemptInput): Promise<boolean> { this.deps.store.setState({ submitting: true, error: null }); const result = await this.deps.recordFollowUpAttemptUseCase.execute(id, input); return result.fold((error) => { this.deps.store.setState({ submitting: false, error: this.handleError(error) }); return false }, ({ task, attempt }) => { this.deps.store.setState((state) => ({ submitting: false, tasks: state.tasks.map((current) => current.id === task.id ? task : current), selectedTask: task, attempts: [attempt, ...state.attempts] })); return true }) }
  async fetchEscalations(id: string): Promise<void> { const result = await this.deps.getFollowUpEscalationsUseCase.execute(id); result.fold((error) => this.deps.store.setState({ error: this.handleError(error) }), (escalations) => this.deps.store.setState({ escalations })) }
}
