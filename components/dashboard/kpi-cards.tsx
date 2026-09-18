"use client"

import { useEffect } from "react"
import { format } from "date-fns"
import { AlertTriangle, CheckCircle2, ClipboardList, Church, Package, UserCheck, UserPlus, Users } from "lucide-react"
import useDashboardState from "@/application/dashboard/useDashboardState"
import { useDashboardPloc } from "@/core/di/DependencyLocator"

interface KpiCardProps {
  index: string
  label: string
  value: string
  sublabel: string
  trend?: { text: string; positive: boolean }
  icon: React.ReactNode
  featured?: boolean
  accentColor?: string
}

function KpiCard({ index, label, value, sublabel, trend, icon, featured, accentColor }: KpiCardProps) {
  const accent = accentColor ?? (featured ? "#E3B04B" : "var(--muted-foreground)")
  return (
    <div
      className="group relative overflow-hidden rounded-xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5"
      style={
        featured
          ? {
              background: "#0E1B25",
              border: "1px solid rgba(227,176,75,.30)",
              boxShadow: "0 0 32px rgba(227,176,75,.10), 0 2px 16px rgba(0,0,0,.35)",
            }
          : {
              background: "var(--card)",
              border: "1px solid var(--border)",
            }
      }
    >
      {featured && (
        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full"
          style={{ border: "1px solid rgba(227,176,75,.07)", boxShadow: "inset 0 0 0 10px rgba(227,176,75,.03)" }} />
      )}

      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-[8px] tracking-[0.22em] uppercase"
          style={{ color: featured ? "rgba(227,176,75,.50)" : "var(--muted-foreground)" }}>
          {index} · {label}
        </span>
        <span style={{ color: accent, opacity: 0.45 }}>{icon}</span>
      </div>

      <div>
        <p className="font-display font-light leading-none"
          style={{
            fontSize: "2.4rem",
            color: featured ? "#E3B04B" : "var(--foreground)",
            letterSpacing: "-0.02em",
            fontFeatureSettings: '"tnum" 1',
          }}>
          {value}
        </p>
        <p className="font-mono text-[9.5px] mt-2 leading-snug" style={{ color: "var(--muted-foreground)" }}>
          {sublabel}
        </p>
        {trend && (
          <p className="font-mono text-[9px] mt-1 font-semibold"
            style={{ color: trend.positive ? "#6FD79B" : "#EB6A56" }}>
            {trend.positive ? "↑" : "↓"} {trend.text}
          </p>
        )}
      </div>

      {featured && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: "linear-gradient(90deg, rgba(227,176,75,.65), transparent)" }} />
      )}
    </div>
  )
}

export function KpiCardsGrid() {
  const dashboardPloc = useDashboardPloc()
  const stats = useDashboardState((state) => state.stats)
  const loading = useDashboardState((state) => state.loading)

  useEffect(() => {
    void dashboardPloc.fetchStats()
  }, [dashboardPloc])

  const dash = loading || !stats ? "—" : null
  const lastSession = stats?.attendance.lastSession ?? null
  const inventoryAlerts = stats ? stats.inventory.lowStockItems + stats.inventory.pendingDamageReports : 0

  const cards = [
    {
      index: "01",
      label: "Active Members",
      value: dash ?? stats!.members.active.toLocaleString(),
      sublabel: `Of ${stats?.members.total.toLocaleString() ?? 0} total members`,
      icon: <Users className="h-4 w-4" />,
      featured: true,
    },
    {
      index: "02",
      label: "Sunday Attendance",
      value: dash ?? (lastSession ? lastSession.present.toLocaleString() : "0"),
      sublabel: lastSession
        ? `${lastSession.title} · ${format(new Date(lastSession.sessionDate), "MMM d")}`
        : "No sessions recorded yet",
      trend: lastSession
        ? { text: `${lastSession.attendanceRate}% attendance rate`, positive: lastSession.attendanceRate >= 70 }
        : undefined,
      icon: <UserCheck className="h-4 w-4" />,
      accentColor: "#5CA8E0",
    },
    {
      index: "03",
      label: "First-Time Visitors",
      value: dash ?? stats!.members.firstTimeVisitors.toLocaleString(),
      sublabel: "Marked as first-time visitors",
      icon: <UserPlus className="h-4 w-4" />,
      accentColor: "#6FD79B",
    },
    {
      index: "04",
      label: "Fellowships Active",
      value: dash ?? stats!.fellowships.active.toLocaleString(),
      sublabel: `Of ${stats?.fellowships.total.toLocaleString() ?? 0} total`,
      icon: <Church className="h-4 w-4" />,
      accentColor: "#E3B04B",
    },
    {
      index: "05",
      label: "Inventory Alerts",
      value: dash ?? String(inventoryAlerts),
      sublabel: stats
        ? `${stats.inventory.lowStockItems} low stock · ${stats.inventory.pendingDamageReports} damage reports`
        : "Low stock + pending reports",
      icon: <Package className="h-4 w-4" />,
      accentColor: "#EB6A56",
    },
    {
      index: "06",
      label: "Open Follow-ups",
      value: dash ?? String(stats!.followUps.open),
      sublabel: "Waiting for a staff response",
      trend: stats ? { text: `${stats.followUps.unassigned} unassigned`, positive: stats.followUps.unassigned <= 3 } : undefined,
      icon: <ClipboardList className="h-4 w-4" />,
      accentColor: "#EFA64A",
    },
    {
      index: "07",
      label: "Overdue Follow-ups",
      value: dash ?? String(stats!.followUps.overdue),
      sublabel: "Past due date",
      trend: stats ? { text: `${stats.followUps.completed} completed`, positive: true } : undefined,
      icon: <AlertTriangle className="h-4 w-4" />,
      accentColor: "#EB6A56",
    },
    {
      index: "08",
      label: "Follow-up Completion",
      value: dash ?? `${stats!.followUps.completionRate}%`,
      sublabel: "Completed vs. total follow-up tasks",
      icon: <CheckCircle2 className="h-4 w-4" />,
      accentColor: "#6FD79B",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
      {cards.map((card) => (
        <KpiCard
          key={card.index}
          index={card.index}
          label={card.label}
          value={card.value}
          sublabel={card.sublabel}
          trend={card.trend}
          icon={card.icon}
          featured={card.featured}
          accentColor={card.accentColor}
        />
      ))}
    </div>
  )
}
