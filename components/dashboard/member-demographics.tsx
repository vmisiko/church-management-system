"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useDashboardStats } from "./use-dashboard-stats"
import { WidgetFrame, WidgetLoading, WidgetError, WidgetEmpty } from "./widget-frame"

const TITLE = "Congregation"
const SUBTITLE = "Demographics snapshot"

const AGE_GROUPS: { key: string; label: string }[] = [
  { key: "under_18", label: "Under 18" },
  { key: "18_25", label: "18 – 25" },
  { key: "26_35", label: "26 – 35" },
  { key: "36_50", label: "36 – 50" },
  { key: "above_50", label: "50+" },
]
const AGE_COLORS = ["#5CA8E0", "#E3B04B", "#6FD79B", "#EFA64A", "#CFC8BA", "#5E6E78"]

/* eslint-disable @typescript-eslint/no-explicit-any */
function StatusTooltip({ active, payload, total }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-xl px-3 py-2 text-[11px]"
      style={{ background: "var(--popover)", border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,.15)" }}>
      <p className="font-mono text-[9px] uppercase tracking-wider mb-0.5" style={{ color: d.payload.color }}>{d.name}</p>
      <p className="font-semibold text-foreground">{d.value.toLocaleString()}</p>
      <p className="text-muted-foreground text-[10px]">{total > 0 ? Math.round((d.value / total) * 100) : 0}% of congregation</p>
    </div>
  )
}

export function MemberDemographics() {
  const { stats, error, loading } = useDashboardStats()

  if (error) return <WidgetFrame title={TITLE} subtitle={SUBTITLE}><WidgetError message="Couldn't load member demographics." /></WidgetFrame>
  if (loading || !stats) return <WidgetFrame title={TITLE} subtitle={SUBTITLE}><WidgetLoading rows={5} /></WidgetFrame>

  const m = stats.members
  if (m.total === 0) return <WidgetFrame title={TITLE} subtitle={SUBTITLE}><WidgetEmpty>No members yet.</WidgetEmpty></WidgetFrame>

  const statusData = [
    { name: "Members", value: m.byStatus.member, color: "#E3B04B" },
    { name: "Leaders", value: m.byStatus.leader, color: "#6FD79B" },
    { name: "Guests", value: m.byStatus.guest, color: "#5CA8E0" },
  ]
  const statusTotal = statusData.reduce((s, d) => s + d.value, 0)

  const byAge = m.byAgeGroup ?? {}
  const ageRows = AGE_GROUPS.map((g) => ({ ...g, count: byAge[g.key] ?? 0 }))
  if ((byAge.unknown ?? 0) > 0) ageRows.push({ key: "unknown", label: "Not set", count: byAge.unknown })
  const ageTotal = ageRows.reduce((s, g) => s + g.count, 0)

  const male = m.byGender?.male ?? 0
  const female = m.byGender?.female ?? 0
  const unspecified = m.byGender?.unspecified ?? 0
  const genderTotal = male + female
  const malePct = genderTotal > 0 ? Math.round((male / genderTotal) * 100) : 0
  const femalePct = genderTotal > 0 ? 100 - malePct : 0

  return (
    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <h2 className="font-display text-[1.4rem] font-light italic text-foreground mb-0.5">{TITLE}</h2>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
        {m.total.toLocaleString()} people · {m.active.toLocaleString()} active · {m.inactive.toLocaleString()} inactive
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
              <Tooltip content={<StatusTooltip total={statusTotal} />} />
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
        {ageRows.map((g, i) => (
          <div key={g.key}>
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-mono text-[9.5px] text-muted-foreground">{g.label}</span>
              <span className="font-mono text-[10px] font-semibold text-foreground">{g.count.toLocaleString()}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${ageTotal > 0 ? Math.round((g.count / ageTotal) * 100) : 0}%`, background: AGE_COLORS[i] }}
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
          {genderTotal > 0 ? (
            <>
              <div className="flex h-2 rounded-full overflow-hidden mb-1.5">
                <div style={{ width: `${malePct}%`, background: "#5CA8E0" }} />
                <div style={{ flex: 1, background: "#E3B04B" }} />
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-[9px]" style={{ color: "#5CA8E0" }}>♂ {malePct}%</span>
                <span className="font-mono text-[9px]" style={{ color: "#E3B04B" }}>♀ {femalePct}%</span>
              </div>
            </>
          ) : (
            <p className="font-mono text-[9px] text-muted-foreground">Not recorded</p>
          )}
          {unspecified > 0 && (
            <p className="font-mono text-[8.5px] text-muted-foreground mt-1">{unspecified.toLocaleString()} not specified</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[9px] text-muted-foreground">Online</span>
            <span className="font-mono text-[10px] font-semibold text-foreground">{m.online.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[9px] text-muted-foreground">International</span>
            <span className="font-mono text-[10px] font-semibold text-foreground">{m.international.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
