"use client"

import { Package, Calendar } from "lucide-react"

interface AlertItem {
  id: string
  type: "inventory" | "anniversary"
  title: string
  description: string
  action: string
}

const alerts: AlertItem[] = [
  { id: "1", type: "inventory", title: "Low Inventory", description: "Hymn books — 12 remaining", action: "Refill →" },
  { id: "2", type: "anniversary", title: "Fellowship Milestone", description: "Lang'ata Fellowship — 5 yrs", action: "Plan →" },
]

const config = {
  inventory: { Icon: Package, color: 'oklch(0.55 0.20 22)', bg: 'oklch(0.55 0.20 22 / 0.08)', border: 'oklch(0.55 0.20 22 / 0.20)' },
  anniversary: { Icon: Calendar, color: 'oklch(0.72 0.14 78)', bg: 'oklch(0.72 0.14 78 / 0.08)', border: 'oklch(0.72 0.14 78 / 0.20)' },
}

export function PriorityAlerts() {
  return (
    <div
      className="rounded p-5"
      style={{
        background: 'oklch(0.12 0.015 252)',
        border: '1px solid oklch(0.20 0.015 252)',
        boxShadow: '0 2px 12px oklch(0 0 0 / 0.25)',
      }}
    >
      {/* Header */}
      <div className="flex items-baseline gap-2 mb-4">
        <span
          className="h-1.5 w-1.5 rounded-full inline-block"
          style={{ background: 'oklch(0.55 0.20 22)', boxShadow: '0 0 6px oklch(0.55 0.20 22 / 0.6)' }}
        />
        <h2
          className="font-display text-[1.25rem] font-light italic"
          style={{ color: 'oklch(0.93 0.005 75)' }}
        >
          Alerts
        </h2>
      </div>

      <div className="flex flex-col gap-2.5">
        {alerts.map((alert) => {
          const { Icon, color, bg, border } = config[alert.type]
          return (
            <div
              key={alert.id}
              className="flex items-center justify-between rounded p-3"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <div>
                  <p className="text-[12.5px] font-medium leading-none" style={{ color: 'oklch(0.85 0.005 75)' }}>
                    {alert.title}
                  </p>
                  <p className="font-mono text-[10px] mt-1" style={{ color: 'oklch(0.42 0.01 75)' }}>
                    {alert.description}
                  </p>
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
