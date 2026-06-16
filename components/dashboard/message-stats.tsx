"use client"

import Link from "next/link"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

/*
 * Based on DeliveryStats entity:
 * { total, pending, sent, delivered, failed }
 * and recent Message list (type, targetGroup, sentAt)
 */

const stats = { total: 1842, pending: 47, sent: 312, delivered: 1428, failed: 55 }
const deliveryRate = Math.round((stats.delivered / stats.total) * 100)

const donutData = [
  { name: "Delivered", value: stats.delivered, color: "#6FD79B" },
  { name: "Sent",      value: stats.sent,      color: "#5CA8E0" },
  { name: "Pending",   value: stats.pending,   color: "#EFA64A" },
  { name: "Failed",    value: stats.failed,    color: "#EB6A56" },
]

const recentMessages = [
  { title: "Sunday Service Reminder",    type: "reminder",     target: "All Members",       sent: "Sun, 08 Jun",  deliveryRate: 96 },
  { title: "Youth Camp Registration",    type: "announcement", target: "18–25 Age Group",   sent: "Fri, 06 Jun",  deliveryRate: 88 },
  { title: "Prayer Week Newsletter",     type: "newsletter",   target: "Fellowship Leaders", sent: "Mon, 02 Jun",  deliveryRate: 100 },
  { title: "Midweek Service Alert",      type: "alert",        target: "Nairobi Central",   sent: "Wed, 04 Jun",  deliveryRate: 91 },
]

const typeColor: Record<string, string> = {
  reminder:     "#5CA8E0",
  announcement: "#E3B04B",
  newsletter:   "#6FD79B",
  alert:        "#EB6A56",
}

export function MessageStats() {
  return (
    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display text-[1.4rem] font-light italic text-foreground">Messaging</h2>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5 text-muted-foreground">
            Delivery performance · last 30 days
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
            <span className="font-mono text-[9.5px] text-muted-foreground">Total sent</span>
            <span className="font-mono text-[10px] font-bold text-foreground">{stats.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mb-4" style={{ background: "var(--border)" }} />

      {/* Recent campaigns */}
      <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-muted-foreground mb-3">
        Recent Campaigns
      </p>
      <div className="flex flex-col gap-0.5">
        {recentMessages.map((m, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2"
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--secondary)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}>
            <span
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ background: typeColor[m.type] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-medium text-foreground leading-tight truncate">{m.title}</p>
              <p className="font-mono text-[9px] text-muted-foreground">{m.target} · {m.sent}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-mono text-[10px] font-semibold" style={{ color: m.deliveryRate >= 95 ? "#6FD79B" : m.deliveryRate >= 85 ? "#E3B04B" : "#EB6A56" }}>
                {m.deliveryRate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
