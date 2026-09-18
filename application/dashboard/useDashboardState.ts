import { create } from "zustand"
import type { DashboardStats } from "@/domain/entities/dashboard/DashboardStats"

export interface DashboardState { stats: DashboardStats | null; loading: boolean; error: string | null }
const useDashboardState = create<DashboardState>(() => ({ stats: null, loading: false, error: null }))
export default useDashboardState
