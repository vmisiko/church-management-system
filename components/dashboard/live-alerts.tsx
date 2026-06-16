"use client"

import Link from "next/link"
import { Package, AlertTriangle, Users, Building2, ChevronRight } from "lucide-react"

/*
 * Aggregates actionable alerts across modules:
 * - Inventory: low stock (availableQty < threshold), pending damage reports
 * - Fellowships: missing leader (leaderId === null)
 * - Departments: below memberTarget
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

const alerts: Alert[] = [
  {
    id: "1", severity: "critical", module: "Inventory",
    title: "Critically low stock",
    detail: "Offering envelopes — 4 remaining",
    cta: "Reorder", href: "/inventory/stock",
  },
  {
    id: "2", severity: "critical", module: "Inventory",
    title: "Damage report pending",
    detail: "PA Speaker — severe · awaiting resolution",
    cta: "Review", href: "/inventory/damage-reports",
  },
  {
    id: "3", severity: "warning", module: "Inventory",
    title: "Low stock",
    detail: "Visitor cards — 12 remaining",
    cta: "Reorder", href: "/inventory/stock",
  },
  {
    id: "4", severity: "warning", module: "Fellowship",
    title: "No fellowship leader",
    detail: "Eastlands Zone · Lang'ata Fellowship",
    cta: "Assign", href: "/fellowships",
  },
  {
    id: "5", severity: "warning", module: "Fellowship",
    title: "No fellowship leader",
    detail: "Thika Road Zone · Ruiru Fellowship",
    cta: "Assign", href: "/fellowships",
  },
  {
    id: "6", severity: "info", module: "Department",
    title: "Below membership target",
    detail: "Media Dept — 14 of 30 target",
    cta: "View", href: "/departments",
  },
  {
    id: "7", severity: "info", module: "Inventory",
    title: "Item request awaiting approval",
    detail: "Choir robes — 8 units · Youth Dept",
    cta: "Approve", href: "/inventory/stock",
  },
]

const severityConfig: Record<AlertSeverity, { dot: string; label: string }> = {
  critical: { dot: "#EB6A56", label: "Critical" },
  warning:  { dot: "#EFA64A", label: "Warning"  },
  info:     { dot: "#5CA8E0", label: "Info"     },
}

const moduleIcon: Record<string, React.ReactNode> = {
  Inventory:  <Package className="h-3 w-3" />,
  Fellowship: <Users className="h-3 w-3" />,
  Department: <Building2 className="h-3 w-3" />,
}

export function LiveAlerts() {
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
      </div>

      {/* Alert list */}
      <div className="flex flex-col gap-1.5 flex-1">
        {alerts.map((alert) => {
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
    </div>
  )
}
