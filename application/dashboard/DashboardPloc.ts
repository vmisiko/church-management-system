import type { StoreApi } from "zustand"
import { Ploc } from "@/core/application/ploc"
import type { DashboardState } from "./useDashboardState"
import type { GetDashboardStatsUseCase } from "@/domain/usecases/dashboard/GetDashboardStatsUseCase"

export class DashboardPloc extends Ploc<StoreApi<DashboardState>> {
  constructor(private readonly deps: { store: StoreApi<DashboardState>; getDashboardStatsUseCase: GetDashboardStatsUseCase }) { super({ store: deps.store }) }
  async fetchStats(): Promise<void> {
    const current = this.deps.store.getState()
    if (current.loading || current.stats) return
    this.deps.store.setState({ loading: true, error: null })
    const result = await this.deps.getDashboardStatsUseCase.execute()
    result.fold((error) => this.deps.store.setState({ loading: false, error: this.handleError(error) }), (stats) => this.deps.store.setState({ loading: false, stats }))
  }
}
