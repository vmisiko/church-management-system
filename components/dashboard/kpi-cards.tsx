"use client"

import { Users, UserPlus, CalendarCheck, Church, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: string
    positive: boolean
  }
  icon: React.ReactNode
  variant?: "blue" | "gold" | "tan" | "olive"
}

const variantStyles = {
  blue: "bg-primary text-primary-foreground",
  gold: "bg-accent text-accent-foreground",
  tan: "bg-[oklch(0.75_0.08_85)] text-[oklch(0.25_0.05_85)]",
  olive: "bg-[oklch(0.65_0.1_110)] text-[oklch(0.2_0.05_110)]",
}

export function KpiCard({ title, value, subtitle, trend, icon, variant = "blue" }: KpiCardProps) {
  return (
    <Card className={cn("border-0 shadow-sm", variantStyles[variant])}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wider opacity-80">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <p className="flex items-center gap-1 text-sm">
                {trend.positive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{trend.value}</span>
              </p>
            )}
            {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
          </div>
          <div className="opacity-60">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export function KpiCardsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total Members"
        value="2,480"
        trend={{ value: "12% from last month", positive: true }}
        icon={<Users className="h-8 w-8" />}
        variant="blue"
      />
      <KpiCard
        title="New Guests"
        value="24"
        subtitle="Registered this week"
        icon={<UserPlus className="h-8 w-8" />}
        variant="gold"
      />
      <KpiCard
        title="Attendance"
        value="842"
        subtitle="Average Sunday service"
        icon={<CalendarCheck className="h-8 w-8" />}
        variant="tan"
      />
      <KpiCard
        title="Active Fellowships"
        value="15"
        subtitle="Across 4 zones"
        icon={<Church className="h-8 w-8" />}
        variant="olive"
      />
    </div>
  )
}
