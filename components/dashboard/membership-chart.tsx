"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useState } from "react"

const membershipData = [
  { month: "JAN", members: 1850 },
  { month: "FEB", members: 1920 },
  { month: "MAR", members: 2050 },
  { month: "APR", members: 2180 },
  { month: "MAY", members: 2350 },
  { month: "JUN", members: 2480 },
]

const chartConfig = {
  members: { label: "Members", color: "oklch(0.72 0.14 78)" },
}

const periods = ["6M", "1Y"] as const
type Period = typeof periods[number]

export function MembershipChart() {
  const [period, setPeriod] = useState<Period>("6M")

  return (
    <div
      className="rounded p-5"
      style={{
        background: 'oklch(0.12 0.015 252)',
        border: '1px solid oklch(0.20 0.015 252)',
        boxShadow: '0 2px 12px oklch(0 0 0 / 0.25)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2
            className="font-display text-[1.4rem] font-light italic"
            style={{ color: 'oklch(0.93 0.005 75)' }}
          >
            Membership Growth
          </h2>
          <p
            className="font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5"
            style={{ color: 'oklch(0.40 0.01 75)' }}
          >
            Historical trend · 2024
          </p>
        </div>

        {/* Period toggle */}
        <div
          className="flex rounded gap-0.5 p-0.5"
          style={{ background: 'oklch(0.09 0.015 252)', border: '1px solid oklch(0.20 0.015 252)' }}
        >
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="rounded px-3 py-1 font-mono text-[9px] uppercase tracking-widest cursor-pointer transition-all"
              style={
                period === p
                  ? { background: 'oklch(0.72 0.14 78 / 0.15)', color: 'oklch(0.72 0.14 78)', border: '1px solid oklch(0.72 0.14 78 / 0.3)' }
                  : { color: 'oklch(0.40 0.01 75)', border: '1px solid transparent' }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <CardContent className="p-0 pt-2">
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <AreaChart data={membershipData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.72 0.14 78)" stopOpacity={0.18} />
                <stop offset="95%" stopColor="oklch(0.72 0.14 78)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="1 4"
              stroke="oklch(0.22 0.015 252)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'oklch(0.35 0.01 75)', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'oklch(0.35 0.01 75)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              width={42}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="members"
              stroke="oklch(0.72 0.14 78)"
              strokeWidth={1.5}
              fill="url(#goldFill)"
              dot={false}
              activeDot={{ r: 3, fill: 'oklch(0.72 0.14 78)', strokeWidth: 0 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}
