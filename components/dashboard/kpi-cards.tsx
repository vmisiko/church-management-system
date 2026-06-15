"use client"

import { Users, UserPlus, CalendarCheck, Church, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface VaultCardProps {
  index: string
  label: string
  value: string | number
  sublabel?: string
  trend?: { value: string; positive: boolean }
  icon: React.ReactNode
  featured?: boolean
}

function VaultCard({ index, label, value, sublabel, trend, icon, featured = false }: VaultCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5",
      )}
      style={
        featured
          ? {
              background: "#0E1B25",
              border: "1px solid rgba(227,176,75,.30)",
              boxShadow: "0 0 40px rgba(227,176,75,.10), 0 2px 16px rgba(0,0,0,.35)",
            }
          : {
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 1px 8px rgba(0,0,0,.06)",
            }
      }
    >
      {/* Hover glow border — featured only */}
      {featured && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: "inset 0 0 0 1px rgba(227,176,75,.48)" }}
        />
      )}

      {/* Embossed ring — featured only */}
      {featured && (
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full"
          style={{
            border: "1px solid rgba(227,176,75,.07)",
            boxShadow: "inset 0 0 0 12px rgba(227,176,75,.03)",
          }}
        />
      )}

      {/* Top row */}
      <div className="flex items-start justify-between">
        <span
          className="font-mono text-[9px] font-semibold tracking-[0.2em]"
          style={{ color: featured ? "rgba(227,176,75,.55)" : "var(--muted-foreground)" }}
        >
          {index} / {label.toUpperCase()}
        </span>
        <span style={{ color: featured ? "rgba(227,176,75,.35)" : "var(--muted-foreground)", opacity: 0.5 }}>
          {icon}
        </span>
      </div>

      {/* Value */}
      <div className="mt-4">
        <p
          className="font-display font-light leading-none tracking-tight"
          style={{
            fontSize: featured ? "3.5rem" : "2.75rem",
            color: featured ? "#E3B04B" : "var(--foreground)",
            fontFeatureSettings: '"tnum" 1',
          }}
        >
          {value}
        </p>
        {trend && (
          <p
            className="mt-2 flex items-center gap-1 text-[11px] font-medium font-mono"
            style={{ color: trend.positive ? "#6FD79B" : "#EB6A56" }}
          >
            {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </p>
        )}
        {sublabel && (
          <p className="mt-1 text-[11px] font-mono" style={{ color: "var(--muted-foreground)" }}>
            {sublabel}
          </p>
        )}
      </div>

      {/* Bottom accent — featured only */}
      {featured && (
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: "linear-gradient(90deg, rgba(227,176,75,.65), transparent)" }}
        />
      )}
    </div>
  )
}

export function KpiCardsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <VaultCard index="01" label="Members" value="2,480" trend={{ value: "+12% this month", positive: true }} icon={<Users className="h-4 w-4" />} featured />
      <VaultCard index="02" label="New Guests" value="24" sublabel="Registered this week" icon={<UserPlus className="h-4 w-4" />} />
      <VaultCard index="03" label="Attendance" value="842" sublabel="Avg Sunday service" icon={<CalendarCheck className="h-4 w-4" />} />
      <VaultCard index="04" label="Fellowships" value="15" sublabel="Across 4 zones" icon={<Church className="h-4 w-4" />} />
    </div>
  )
}
