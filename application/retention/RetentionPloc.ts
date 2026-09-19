import type { StoreApi } from "zustand"
import { Ploc } from "@/core/application/ploc"
import type { RetentionState } from "./useRetentionState"
import type { RetentionStatsQuery } from "@/domain/entities/retention/Retention"
import type { GetRetentionStatsUseCase } from "@/domain/usecases/retention/GetRetentionStatsUseCase"
import type { GetAtRiskMembersUseCase } from "@/domain/usecases/retention/GetAtRiskMembersUseCase"

export class RetentionPloc extends Ploc<StoreApi<RetentionState>> {
  private readonly getRetentionStatsUseCase: GetRetentionStatsUseCase
  private readonly getAtRiskMembersUseCase: GetAtRiskMembersUseCase

  constructor({
    store,
    getRetentionStatsUseCase,
    getAtRiskMembersUseCase,
  }: {
    store: StoreApi<RetentionState>
    getRetentionStatsUseCase: GetRetentionStatsUseCase
    getAtRiskMembersUseCase: GetAtRiskMembersUseCase
  }) {
    super({ store })
    this.getRetentionStatsUseCase = getRetentionStatsUseCase
    this.getAtRiskMembersUseCase = getAtRiskMembersUseCase
  }

  async fetchStats(query?: RetentionStatsQuery): Promise<void> {
    this.store.setState({ loading: true, error: null })
    const result = await this.getRetentionStatsUseCase.execute(query)
    result.fold(
      (error) => this.store.setState({ loading: false, error: this.handleError(error) }),
      (stats) => this.store.setState({ loading: false, stats }),
    )
  }

  async fetchAtRiskMembers(page = 1, limit = 20): Promise<void> {
    this.store.setState({ atRiskLoading: true, error: null })
    const result = await this.getAtRiskMembersUseCase.execute(page, limit)
    result.fold(
      (error) => this.store.setState({ atRiskLoading: false, error: this.handleError(error) }),
      (res) =>
        this.store.setState({
          atRiskLoading: false,
          atRiskMembers: res.members,
          atRiskTotal: res.total,
          atRiskPage: res.page,
          atRiskLimit: res.limit,
        }),
    )
  }
}
