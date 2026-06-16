"use client"

import { Users, UserCheck, UserPlus, UserX, Package, Church } from "lucide-react"

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
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <KpiCard
        index="01" label="Active Members" value="2,341"
        sublabel="Registered congregation"
        trend={{ text: "+38 this month", positive: true }}
        icon={<Users className="h-4 w-4" />}
        featured
      />
      <KpiCard
        index="02" label="Sunday Attendance" value="892"
        sublabel="Last service · adults + children"
        trend={{ text: "+47 vs prior week", positive: true }}
        icon={<UserCheck className="h-4 w-4" />}
        accentColor="#5CA8E0"
      />
      <KpiCard
        index="03" label="First-Time Visitors" value="31"
        sublabel="Walked in last Sunday"
        trend={{ text: "+8 vs prior week", positive: true }}
        icon={<UserPlus className="h-4 w-4" />}
        accentColor="#6FD79B"
      />
      <KpiCard
        index="04" label="Needs Follow-up" value="124"
        sublabel="Inactive members this month"
        trend={{ text: "–12 from last week", positive: true }}
        icon={<UserX className="h-4 w-4" />}
        accentColor="#EFA64A"
      />
      <KpiCard
        index="05" label="Inventory Alerts" value="7"
        sublabel="Low stock + pending reports"
        trend={{ text: "3 critical items", positive: false }}
        icon={<Package className="h-4 w-4" />}
        accentColor="#EB6A56"
      />
      <KpiCard
        index="06" label="Fellowships Active" value="13"
        sublabel="Of 15 total · 2 no leader"
        icon={<Church className="h-4 w-4" />}
        accentColor="#E3B04B"
      />
    </div>
  )
}
