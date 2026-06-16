"use client"

/*
 * Unified activity ledger — events from all modules:
 * members registered, attendance recorded, stock adjusted,
 * messages sent, damage reports filed, fellowships updated.
 */

type ActivityModule = "Members" | "Attendance" | "Inventory" | "Messaging" | "Fellowship"

interface ActivityItem {
  id: string
  module: ActivityModule
  action: string
  detail: string
  operator: string
  initials: string
  time: string
  status?: { label: string; color: string }
}

const activities: ActivityItem[] = [
  {
    id: "1", module: "Attendance", operator: "J. Mwangi", initials: "JM",
    action: "Sunday service recorded",
    detail: "892 total — 168 children, 31 first-timers",
    time: "9:45 AM", status: { label: "Posted", color: "#6FD79B" },
  },
  {
    id: "2", module: "Members", operator: "S. Johnson", initials: "SJ",
    action: "3 new members registered",
    detail: "Eastlands Zone · walk-ins from Sunday",
    time: "10:12 AM", status: { label: "Active", color: "#E3B04B" },
  },
  {
    id: "3", module: "Inventory", operator: "M. Thompson", initials: "MT",
    action: "Stock adjusted — Bibles",
    detail: "–12 units · Distributed to Kawangware",
    time: "11:03 AM", status: { label: "Out", color: "#EFA64A" },
  },
  {
    id: "4", module: "Messaging", operator: "D. Odhiambo", initials: "DO",
    action: "Message dispatched",
    detail: "\"Prayer Week\" → All Members (1,842 recipients)",
    time: "12:30 PM", status: { label: "Delivered", color: "#6FD79B" },
  },
  {
    id: "5", module: "Inventory", operator: "G. Williams", initials: "GW",
    action: "Damage report filed",
    detail: "PA Speaker — Severe · Media Dept",
    time: "2:17 PM", status: { label: "Pending", color: "#EB6A56" },
  },
  {
    id: "6", module: "Fellowship", operator: "P. Achieng", initials: "PA",
    action: "Fellowship leader assigned",
    detail: "Ruiru Fellowship · Thika Road Zone",
    time: "3:40 PM", status: { label: "Updated", color: "#5CA8E0" },
  },
  {
    id: "7", module: "Members", operator: "R. Kariuki", initials: "RK",
    action: "Bulk import completed",
    detail: "24 members imported · 2 duplicates skipped",
    time: "4:55 PM", status: { label: "Done", color: "#6FD79B" },
  },
]

const moduleColor: Record<ActivityModule, string> = {
  Members:    "#E3B04B",
  Attendance: "#6FD79B",
  Inventory:  "#EFA64A",
  Messaging:  "#5CA8E0",
  Fellowship: "#CFC8BA",
}

function Initials({ value, module }: { value: string; module: ActivityModule }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 6, flexShrink: 0,
      background: `${moduleColor[module]}18`,
      border: `1px solid ${moduleColor[module]}30`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 600,
      color: moduleColor[module], letterSpacing: "0.04em",
    }}>
      {value}
    </div>
  )
}

export function RecentActivity() {
  return (
    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="font-display text-[1.4rem] font-light italic text-foreground">
          Activity Ledger
        </h2>
        <div className="flex-1 h-px"
          style={{ background: "linear-gradient(90deg, rgba(227,176,75,.22), transparent)" }} />
        <a href="/activity"
          className="font-mono text-[9px] uppercase tracking-[0.2em] cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: "rgba(227,176,75,.60)" }}>
          View all →
        </a>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {activities.map((a, i) => (
          <div
            key={a.id}
            className={`flex items-start gap-3 py-3 rise rise-${Math.min(i + 5, 12)}`}
            style={{ borderBottom: i < activities.length - 1 ? "1px solid var(--border)" : "none" }}
          >
            <Initials value={a.initials} module={a.module} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    background: `${moduleColor[a.module]}14`,
                    color: moduleColor[a.module],
                  }}>
                  {a.module}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">{a.time}</span>
              </div>
              <p className="text-[12.5px] font-medium text-foreground leading-tight">{a.action}</p>
              <p className="font-mono text-[10px] text-muted-foreground mt-0.5 leading-snug truncate">
                {a.detail}
              </p>
            </div>

            {a.status && (
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.status.color }} />
                <span className="font-mono text-[9px]" style={{ color: a.status.color }}>{a.status.label}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
