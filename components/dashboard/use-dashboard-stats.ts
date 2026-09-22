"use client"

import { useEffect } from "react"
import useDashboardState from "@/application/dashboard/useDashboardState"
import { useDashboardPloc } from "@/core/di/DependencyLocator"

/**
 * Shared read of GET /api/dashboard/stats for every dashboard widget.
 * DashboardPloc.fetchStats ignores calls while a request is in flight or the data is loaded,
 * so any number of widgets can call this and only one request is made.
 */
export function useDashboardStats() {
  const dashboardPloc = useDashboardPloc()
  const stats = useDashboardState((state) => state.stats)
  const error = useDashboardState((state) => state.error)

  useEffect(() => {
    void dashboardPloc.fetchStats()
  }, [dashboardPloc])

  return { stats, error, loading: !stats && !error }
}
