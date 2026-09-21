"use client"

import Link from "next/link"
import { format } from "date-fns"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { useDashboardStats } from "./use-dashboard-stats"
import { WidgetFrame, WidgetLoading, WidgetError, WidgetEmpty } from "./widget-frame"

const TITLE = "Messaging"

const typeColor: Record<string, string> = {
  reminder:     "#5CA8E0",
  announcement: "#E3B04B",
  newsletter:   "#6FD79B",
  alert:        "#EB6A56",
}

const targetLabel: Record<string, string> = {
  all: "All members",
  fellowship: "Fellowships",
  department: "Departments",
  zone: "Zones",
  members: "Selected members",
}

function sentLabel(sentAt: string | null) {
  if (!sentAt) return "Not sent"
  const d = new Date(sentAt)
  return Number.isNaN(d.getTime()) ? "—" : format(d, "EEE, dd MMM")
}

export function MessageStats() {
  const { stats, error, loading } = useDashboardStats()

  if (error) return <WidgetFrame title={TITLE}><WidgetError message="Couldn't load messaging stats." /></WidgetFrame>
  if (loading || !stats) return <WidgetFrame title={TITLE}><WidgetLoading rows={5} /></WidgetFrame>

  const m = stats.messaging
  const recent = m.recent ?? []
  if (m.totalDeliveries === 0 && recent.length === 0) {
    return (
      <WidgetFrame title={TITLE} subtitle="Delivery performance">
        <WidgetEmpty>
          No messages sent yet.{" "}
          <Link href="/messaging" className="underline" style={{ color: "var(--primary)" }}>Compose one</Link>
        </WidgetEmpty>
      </WidgetFrame>
    )
  }

  const deliveryRate = m.totalDeliveries > 0 ? Math.round((m.delivered / m.totalDeliveries) * 100) : 0
  const donutData = [
    { name: "Delivered", value: m.delivered,         color: "#6FD79B" },
    { name: "Sent",      value: m.sentDeliveries,    color: "#5CA8E0" },
    { name: "Pending",   value: m.pendingDeliveries, color: "#EFA64A" },
    { name: "Failed",    value: m.failedDeliveries,  color: "#EB6A56" },
  ]

  return (
    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display text-[1.4rem] font-light italic text-foreground">{TITLE}</h2>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5 text-muted-foreground">
            Delivery performance · all time
          </p>
        </div>
        <Link href="/messaging"
          className="font-mono text-[9px] uppercase tracking-wider hover:opacity-70 transition-opacity cursor-pointer"
          style={{ color: "var(--primary)" }}>
          Compose →
        </Link>
      </div>

      {/* Donut + rate */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative" style={{ width: 88, height: 88, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={26} outerRadius={42}
                dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270}>
                {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center rate */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-light" style={{ fontSize: "1.2rem", color: "#6FD79B", lineHeight: 1 }}>
              {deliveryRate}
            </span>
            <span className="font-mono text-[7px] text-muted-foreground">%</span>
          </div>
        </div>

        {/* Stats breakdown */}
        <div className="flex flex-col gap-1.5 flex-1">
          {donutData.map((d) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: d.color }} />
                <span className="font-mono text-[9.5px] text-muted-foreground">{d.name}</span>
              </div>
              <span className="font-mono text-[10px] font-semibold text-foreground">{d.value.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1.5" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="font-mono text-[9.5px] text-muted-foreground">Total deliveries</span>
            <span className="font-mono text-[10px] font-bold text-foreground">{m.totalDeliveries.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mb-4" style={{ background: "var(--border)" }} />

      {/* Recent campaigns */}
      <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-muted-foreground mb-3">
        Recent Campaigns
      </p>
      {recent.length === 0 ? (
        <p className="text-[12px] text-muted-foreground">No sent campaigns yet.</p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {recent.map((msg) => (
            <div key={msg.id} className="flex items-center gap-3 rounded-lg px-2 py-2"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--secondary)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}>
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: typeColor[msg.type] ?? "var(--muted-foreground)" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11.5px] font-medium text-foreground leading-tight truncate">{msg.title}</p>
                <p className="font-mono text-[9px] text-muted-foreground">
                  {targetLabel[msg.targetGroup] ?? msg.targetGroup} · {sentLabel(msg.sentAt)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="font-mono text-[10px] font-semibold" style={{ color: msg.deliveryRate >= 95 ? "#6FD79B" : msg.deliveryRate >= 85 ? "#E3B04B" : "#EB6A56" }}>
                  {msg.deliveryRate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
