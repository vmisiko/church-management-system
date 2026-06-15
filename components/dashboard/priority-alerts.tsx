"use client"

import { Package, Calendar } from "lucide-react"

const alerts = [
  { id: "1", type: "inventory" as const, title: "Low Inventory", description: "Hymn books — 12 remaining", action: "Refill →" },
  { id: "2", type: "anniversary" as const, title: "Fellowship Milestone", description: "Lang'ata Fellowship — 5 yrs", action: "Plan →" },
]

const config = {
  inventory: {
    Icon: Package,
    color: "#EB6A56",
    bg: "rgba(235,106,86,.07)",
    border: "rgba(235,106,86,.18)",
    iconBg: "rgba(235,106,86,.10)",
  },
  anniversary: {
    Icon: Calendar,
    color: "#E3B04B",
    bg: "rgba(227,176,75,.06)",
    border: "rgba(227,176,75,.18)",
    iconBg: "rgba(227,176,75,.10)",
  },
}

export function PriorityAlerts() {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 8px rgba(0,0,0,.06)",
      }}
    >
      <div className="flex items-baseline gap-2 mb-4">
        <span
          className="h-1.5 w-1.5 rounded-full inline-block"
          style={{ background: "#EB6A56", boxShadow: "0 0 6px rgba(235,106,86,.55)" }}
        />
        <h2 className="font-display text-[1.25rem] font-light italic text-foreground">
          Alerts
        </h2>
      </div>
      <div className="flex flex-col gap-2.5">
        {alerts.map((alert) => {
          const { Icon, color, bg, border, iconBg } = config[alert.type]
          return (
            <div
              key={alert.id}
              className="flex items-center justify-between rounded-lg p-3"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: iconBg }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <div>
                  <p className="text-[12.5px] font-medium leading-none text-foreground">{alert.title}</p>
                  <p className="font-mono text-[10px] mt-1 text-muted-foreground">{alert.description}</p>
                </div>
              </div>
              <button
                className="font-mono text-[9px] uppercase tracking-wider cursor-pointer transition-opacity hover:opacity-70"
                style={{ color }}
              >
                {alert.action}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
