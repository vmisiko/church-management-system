"use client"

import { Users, UserPlus, CalendarCheck, Church, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface VaultCardProps {
  index: string       // "01", "02", etc.
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
        "group relative overflow-hidden rounded p-5 flex flex-col justify-between transition-all duration-300",
        "hover:-translate-y-0.5"
      )}
      style={{
        background: featured
          ? 'oklch(0.13 0.015 252)'
          : 'oklch(0.12 0.015 252)',
        border: featured
          ? '1px solid oklch(0.72 0.14 78 / 0.28)'
          : '1px solid oklch(0.20 0.015 252)',
        boxShadow: featured
          ? '0 0 40px oklch(0.72 0.14 78 / 0.10), 0 2px 12px oklch(0 0 0 / 0.3)'
          : '0 2px 12px oklch(0 0 0 / 0.25)',
        cursor: 'default',
      }}
    >
      {/* Hover gold edge glow */}
      {featured && (
        <div
          className="pointer-events-none absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: 'inset 0 0 0 1px oklch(0.72 0.14 78 / 0.45)' }}
        />
      )}

      {/* Embossed ring — on featured card only */}
      {featured && (
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full"
          style={{
            border: '1px solid oklch(0.72 0.14 78 / 0.07)',
            boxShadow: 'inset 0 0 0 12px oklch(0.72 0.14 78 / 0.03)',
          }}
        />
      )}

      {/* Top row: index + icon */}
      <div className="flex items-start justify-between">
        <span
          className="font-mono text-[9px] font-semibold tracking-[0.2em]"
          style={{ color: featured ? 'oklch(0.72 0.14 78 / 0.55)' : 'oklch(0.35 0.01 75)' }}
        >
          {index} / {label.toUpperCase()}
        </span>
        <span style={{ color: featured ? 'oklch(0.72 0.14 78 / 0.35)' : 'oklch(0.30 0.01 75)' }}>
          {icon}
        </span>
      </div>

      {/* Value */}
      <div className="mt-4">
        <p
          className="font-display font-light leading-none tracking-tight"
          style={{
            fontSize: featured ? '3.5rem' : '2.75rem',
            color: featured ? 'oklch(0.72 0.14 78)' : 'oklch(0.93 0.005 75)',
            fontFeatureSettings: '"tnum" 1',
          }}
        >
          {value}
        </p>

        {trend && (
          <p
            className={cn(
              "mt-2 flex items-center gap-1 text-[11px] font-medium font-mono",
              trend.positive ? "" : ""
            )}
            style={{ color: trend.positive ? 'oklch(0.65 0.16 145)' : 'oklch(0.60 0.18 22)' }}
          >
            {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </p>
        )}
        {sublabel && (
          <p
            className="mt-1 text-[11px] font-mono"
            style={{ color: 'oklch(0.40 0.01 75)' }}
          >
            {sublabel}
          </p>
        )}
      </div>

      {/* Bottom gold line — featured only */}
      {featured && (
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, oklch(0.72 0.14 78 / 0.6), transparent)' }}
        />
      )}
    </div>
  )
}

export function KpiCardsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <VaultCard
        index="01"
        label="Members"
        value="2,480"
        trend={{ value: "+12% this month", positive: true }}
        icon={<Users className="h-4 w-4" />}
        featured
      />
      <VaultCard
        index="02"
        label="New Guests"
        value="24"
        sublabel="Registered this week"
        icon={<UserPlus className="h-4 w-4" />}
      />
      <VaultCard
        index="03"
        label="Attendance"
        value="842"
        sublabel="Avg Sunday service"
        icon={<CalendarCheck className="h-4 w-4" />}
      />
      <VaultCard
        index="04"
        label="Fellowships"
        value="15"
        sublabel="Across 4 zones"
        icon={<Church className="h-4 w-4" />}
      />
    </div>
  )
}
