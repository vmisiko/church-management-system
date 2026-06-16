"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useState } from "react"

/* Each entry = one attendance session from AttendanceSession entity */
const sessions = [
  { name: "Sun 01 Jun", type: "service", adults: 490, children: 142, firstTimers: 28 },
  { name: "Wed 04 Jun", type: "midweek", adults: 210, children: 38,  firstTimers: 6  },
  { name: "Sun 08 Jun", type: "service", adults: 521, children: 158, firstTimers: 34 },
  { name: "Sat 14 Jun", type: "special", adults: 380, children: 95,  firstTimers: 51 },
  { name: "Sun 15 Jun", type: "service", adults: 546, children: 168, firstTimers: 31 },
]

const typeLabel: Record<string, string> = {
  service: "Sunday Service",
  midweek: "Midweek",
  special: "Special Event",
}

const typeDot: Record<string, string> = {
  service: "#E3B04B",
  midweek: "#5CA8E0",
  special: "#6FD79B",
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const session = sessions.find(s => s.name === label)
  const total = (payload[0]?.value ?? 0) + (payload[1]?.value ?? 0) + (payload[2]?.value ?? 0)
  return (
    <div
      className="rounded-xl px-4 py-3 text-[12px]"
      style={{
        background: "var(--popover)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 20px rgba(0,0,0,.15)",
        minWidth: 170,
      }}
    >
      <p className="font-display italic text-foreground mb-2">{label}</p>
      {session && (
        <p className="font-mono text-[9px] uppercase tracking-wider mb-2"
          style={{ color: typeDot[session.type] }}>
          {typeLabel[session.type]}
        </p>
      )}
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-6 mb-0.5">
          <span style={{ color: p.fill }} className="font-mono text-[10px]">{p.name}</span>
          <span className="font-mono text-[10px] text-foreground font-semibold">{p.value}</span>
        </div>
      ))}
      <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex justify-between">
          <span className="font-mono text-[10px] text-muted-foreground">Total</span>
          <span className="font-mono text-[10px] text-foreground font-bold">{total}</span>
        </div>
      </div>
    </div>
  )
}

export function AttendanceSessions() {
  const [activeType, setActiveType] = useState<string | null>(null)

  const filtered = activeType ? sessions.filter(s => s.type === activeType) : sessions
  const totalLastService = sessions.filter(s => s.type === "service").at(-1)
  const firstTimerRate = totalLastService
    ? Math.round((totalLastService.firstTimers / (totalLastService.adults + totalLastService.children)) * 100)
    : 0

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display text-[1.4rem] font-light italic text-foreground">
            Attendance Sessions
          </h2>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5 text-muted-foreground">
            Adults · Children · First-time visitors per session
          </p>
        </div>

        {/* First-timer rate callout */}
        <div className="text-right">
          <p className="font-display italic text-foreground" style={{ fontSize: "2rem", color: "#6FD79B", lineHeight: 1 }}>
            {firstTimerRate}<span className="text-xl opacity-50">%</span>
          </p>
          <p className="font-mono text-[8.5px] uppercase tracking-wider text-muted-foreground mt-0.5">
            visitor rate · last Sunday
          </p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[null, "service", "midweek", "special"].map((t) => (
          <button
            key={t ?? "all"}
            onClick={() => setActiveType(t)}
            className="font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-full cursor-pointer transition-all"
            style={
              activeType === t
                ? { background: t ? typeDot[t] : "#E3B04B", color: "#0A141C", fontWeight: 600 }
                : { background: "var(--secondary)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }
            }
          >
            {t === null ? "All" : typeLabel[t]}
          </button>
        ))}
      </div>

      {/* Stacked bar chart */}
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filtered} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
            <XAxis
              dataKey="name"
              tickLine={false} axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-mono)" }}
              interval={0}
            />
            <YAxis
              tickLine={false} axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-mono)" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(243,237,225,.03)" }} />
            <Bar dataKey="adults"      name="Adults"       fill="#E3B04B" stackId="a" radius={[0,0,0,0]} />
            <Bar dataKey="children"    name="Children"     fill="#5CA8E0" stackId="a" radius={[0,0,0,0]} />
            <Bar dataKey="firstTimers" name="First-timers" fill="#6FD79B" stackId="a" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-5 mt-3">
        {[
          { label: "Adults",        color: "#E3B04B" },
          { label: "Children",      color: "#5CA8E0" },
          { label: "First-timers",  color: "#6FD79B" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
