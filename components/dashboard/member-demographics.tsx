"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

/* Based on Member entity: status, ageGroup, gender, isOnline, isInternational */
const statusData = [
  { name: "Active",   value: 2341, color: "#E3B04B" },
  { name: "Inactive", value: 421,  color: "#5E6E78" },
  { name: "Guests",   value: 184,  color: "#5CA8E0" },
]

const ageGroups = [
  { label: "Under 18", key: "under_18", count: 340,  pct: 12 },
  { label: "18 – 25",  key: "18_25",   count: 820,  pct: 28 },
  { label: "26 – 35",  key: "26_35",   count: 950,  pct: 32 },
  { label: "36 – 50",  key: "36_50",   count: 540,  pct: 18 },
  { label: "50+",      key: "above_50",count: 296,  pct: 10 },
]

const ageColors = ["#5CA8E0", "#E3B04B", "#6FD79B", "#EFA64A", "#CFC8BA"]

const total = statusData.reduce((s, d) => s + d.value, 0)

/* eslint-disable @typescript-eslint/no-explicit-any */
function StatusTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-xl px-3 py-2 text-[11px]"
      style={{ background: "var(--popover)", border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,.15)" }}>
      <p className="font-mono text-[9px] uppercase tracking-wider mb-0.5" style={{ color: d.payload.color }}>{d.name}</p>
      <p className="font-semibold text-foreground">{d.value.toLocaleString()}</p>
      <p className="text-muted-foreground text-[10px]">{Math.round((d.value / total) * 100)}% of congregation</p>
    </div>
  )
}

export function MemberDemographics() {
  const maleCount = 1430
  const femaleCount = 1516
  const onlineCount = 312
  const intlCount = 87
  const grandTotal = maleCount + femaleCount

  return (
    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <h2 className="font-display text-[1.4rem] font-light italic text-foreground mb-0.5">
        Congregation
      </h2>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
        Demographics snapshot
      </p>

      {/* Status donut */}
      <div className="flex items-center gap-4 mb-5">
        <div style={{ width: 90, height: 90, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={28} outerRadius={42}
                dataKey="value" strokeWidth={0}>
                {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip content={<StatusTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-1.5">
          {statusData.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="font-mono text-[10px] text-muted-foreground">{d.name}</span>
              <span className="font-mono text-[11px] font-semibold text-foreground ml-auto pl-4">
                {d.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mb-4" style={{ background: "var(--border)" }} />

      {/* Age groups */}
      <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-muted-foreground mb-3">
        Age Groups
      </p>
      <div className="flex flex-col gap-2">
        {ageGroups.map((g, i) => (
          <div key={g.key}>
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-mono text-[9.5px] text-muted-foreground">{g.label}</span>
              <span className="font-mono text-[10px] font-semibold text-foreground">{g.count}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${g.pct}%`, background: ageColors[i] }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px my-4" style={{ background: "var(--border)" }} />

      {/* Gender + Online stats */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground mb-1.5">
            Gender
          </p>
          <div className="flex h-2 rounded-full overflow-hidden mb-1.5">
            <div style={{ width: `${Math.round((maleCount / grandTotal) * 100)}%`, background: "#5CA8E0" }} />
            <div style={{ flex: 1, background: "#E3B04B" }} />
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-[9px]" style={{ color: "#5CA8E0" }}>
              ♂ {Math.round((maleCount / grandTotal) * 100)}%
            </span>
            <span className="font-mono text-[9px]" style={{ color: "#E3B04B" }}>
              ♀ {Math.round((femaleCount / grandTotal) * 100)}%
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[9px] text-muted-foreground">Online</span>
            <span className="font-mono text-[10px] font-semibold text-foreground">{onlineCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[9px] text-muted-foreground">International</span>
            <span className="font-mono text-[10px] font-semibold text-foreground">{intlCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
