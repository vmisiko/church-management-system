"use client"

import Link from "next/link"
import { Package, AlertTriangle, Users, Building2, ClipboardList, ChevronRight, CheckCircle2 } from "lucide-react"
import type { DashboardStats } from "@/domain/entities/dashboard/DashboardStats"
import { useDashboardStats } from "./use-dashboard-stats"
import { WidgetLoading, WidgetError } from "./widget-frame"

/*
 * Actionable alerts built from GET /api/dashboard/stats:
 * - Inventory: low or empty stock, pending damage reports
 * - Fellowships: no leader assigned
 * - Departments: below their member target (largest shortfall first)
 * - Follow-ups: overdue and unassigned tasks
 * The backend returns at most 5 records per type, so this shows the most urgent items.
 */

type AlertSeverity = "critical" | "warning" | "info"

interface Alert {
  id: string
  severity: AlertSeverity
  module: string
  title: string
  detail: string
  cta: string
  href: string
}

const MAX_SHOWN = 8
const SEVERITY_ORDER: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 }

function damageSeverity(severity: string): AlertSeverity {
  if (severity === "severe" || severity === "total_loss") return "critical"
  if (severity === "moderate") return "warning"
  return "info"
}

export function buildAlerts(stats: DashboardStats): Alert[] {
  const alerts: Alert[] = []
  const attention = stats.attention

  for (const item of attention?.lowStock ?? []) {
    const empty = item.availableQty <= 0
    alerts.push({
      id: `stock-${item.id}`,
      severity: empty ? "critical" : "warning",
      module: "Inventory",
      title: empty ? "Out of stock" : "Low stock",
      detail: empty ? `${item.name} — none left of ${item.totalQty}` : `${item.name} — ${item.availableQty} of ${item.totalQty} remaining`,
      cta: "Reorder",
      href: "/inventory/stock",
    })
  }

  for (const report of attention?.pendingDamage ?? []) {
    alerts.push({
      id: `damage-${report.id}`,
      severity: damageSeverity(report.severity),
      module: "Inventory",
      title: "Damage report pending",
      detail: `${report.itemName} — ${report.severity.replace("_", " ")} · ${report.quantityAffected} affected`,
      cta: "Review",
      href: "/inventory/damage-reports",
    })
  }

  for (const f of attention?.fellowshipsWithoutLeader ?? []) {
    alerts.push({
      id: `leader-${f.id}`,
      severity: "warning",
      module: "Fellowship",
      title: "No fellowship leader",
      detail: `${f.zoneName} · ${f.name}`,
      cta: "Assign",
      href: "/fellowships",
    })
  }

  for (const d of attention?.departmentsBelowTarget ?? []) {
    alerts.push({
      id: `dept-${d.id}`,
      severity: "info",
      module: "Department",
      title: "Below membership target",
      detail: `${d.name} — ${d.memberCount} of ${d.target} target`,
      cta: "View",
      href: "/departments",
    })
  }

  const { overdue, unassigned } = stats.followUps
  if (overdue > 0) {
    alerts.push({
      id: "followups-overdue",
      severity: "warning",
      module: "Follow-ups",
      title: "Overdue follow-ups",
      detail: `${overdue} ${overdue === 1 ? "task is" : "tasks are"} past due`,
      cta: "Open",
      href: "/follow-ups",
    })
  }
  if (unassigned > 0) {
    alerts.push({
      id: "followups-unassigned",
      severity: "info",
      module: "Follow-ups",
      title: "Unassigned follow-ups",
      detail: `${unassigned} open ${unassigned === 1 ? "task has" : "tasks have"} no owner`,
      cta: "Assign",
      href: "/follow-ups",
    })
  }

  // Array.prototype.sort is stable, so the backend's per-type ordering is kept within a severity.
  return alerts.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
}

const severityConfig: Record<AlertSeverity, { dot: string; label: string }> = {
  critical: { dot: "#EB6A56", label: "Critical" },
  warning:  { dot: "#EFA64A", label: "Warning"  },
  info:     { dot: "#5CA8E0", label: "Info"     },
}

const moduleIcon: Record<string, React.ReactNode> = {
  Inventory:    <Package className="h-3 w-3" />,
  Fellowship:   <Users className="h-3 w-3" />,
  Department:   <Building2 className="h-3 w-3" />,
  "Follow-ups": <ClipboardList className="h-3 w-3" />,
}

export function LiveAlerts() {
  const { stats, error, loading } = useDashboardStats()

  const alerts = stats ? buildAlerts(stats) : []
  const shown = alerts.slice(0, MAX_SHOWN)
  const hidden = alerts.length - shown.length
  const criticalCount = alerts.filter(a => a.severity === "critical").length
  const warningCount  = alerts.filter(a => a.severity === "warning").length

  return (
    <div className="rounded-xl p-5 flex flex-col" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <AlertTriangle className="h-3.5 w-3.5" style={{ color: "#EB6A56" }} />
            <h2 className="font-display text-[1.25rem] font-light italic text-foreground">
              Live Alerts
            </h2>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Needs attention now
          </p>
        </div>
        {/* Severity summary */}
        {stats && (
          <div className="flex gap-2">
            <div className="flex items-center gap-1 rounded-full px-2 py-0.5"
              style={{ background: "rgba(235,106,86,.10)", border: "1px solid rgba(235,106,86,.20)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#EB6A56" }} />
              <span className="font-mono text-[9px]" style={{ color: "#EB6A56" }}>{criticalCount}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full px-2 py-0.5"
              style={{ background: "rgba(239,166,74,.10)", border: "1px solid rgba(239,166,74,.20)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#EFA64A" }} />
              <span className="font-mono text-[9px]" style={{ color: "#EFA64A" }}>{warningCount}</span>
            </div>
          </div>
        )}
      </div>

      {error ? (
        <WidgetError message="Couldn't load alerts." />
      ) : loading || !stats ? (
        <WidgetLoading rows={5} />
      ) : alerts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
          <CheckCircle2 className="h-5 w-5" style={{ color: "#6FD79B" }} />
          <p className="text-[12px] text-muted-foreground">Nothing needs attention right now.</p>
        </div>
      ) : (
        <>
          {/* Alert list */}
          <div className="flex flex-col gap-1.5 flex-1">
            {shown.map((alert) => {
              const { dot } = severityConfig[alert.severity]
              return (
                <div
                  key={alert.id}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 cursor-pointer"
                  style={{ border: "1px solid transparent" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "var(--secondary)"
                    ;(e.currentTarget as HTMLElement).style.borderColor = "var(--border)"
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent"
                    ;(e.currentTarget as HTMLElement).style.borderColor = "transparent"
                  }}
                >
                  {/* Severity dot */}
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: dot, boxShadow: `0 0 5px ${dot}70` }} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-muted-foreground" style={{ opacity: 0.6 }}>
                        {moduleIcon[alert.module]}
                      </span>
                      <span className="font-mono text-[8.5px] uppercase tracking-wider text-muted-foreground">
                        {alert.module}
                      </span>
                    </div>
                    <p className="text-[12px] font-medium leading-tight text-foreground">{alert.title}</p>
                    <p className="font-mono text-[9.5px] text-muted-foreground leading-tight mt-0.5 truncate">
                      {alert.detail}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href={alert.href}
                    className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={e => e.stopPropagation()}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: dot }}>{alert.cta}</span>
                    <ChevronRight className="h-2.5 w-2.5" style={{ color: dot }} />
                  </Link>
                </div>
              )
            })}
          </div>
          {hidden > 0 && (
            <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mt-3 px-3">
              + {hidden} more {hidden === 1 ? "alert" : "alerts"}
            </p>
          )}
        </>
      )}
    </div>
  )
}
