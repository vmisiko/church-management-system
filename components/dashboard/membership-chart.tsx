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
  members: { label: "Members", color: "#E3B04B" },
}

const periods = ["6M", "1Y"] as const

export function MembershipChart() {
  const [period, setPeriod] = useState<"6M" | "1Y">("6M")

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 8px rgba(0,0,0,.06)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-display text-[1.4rem] font-light italic text-foreground">
            Membership Growth
          </h2>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5 text-muted-foreground">
            Historical trend · 2024
          </p>
        </div>
        <div
          className="flex rounded-lg gap-0.5 p-0.5"
          style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
        >
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="rounded-md px-3 py-1 font-mono text-[9px] uppercase tracking-widest cursor-pointer transition-all"
              style={
                period === p
                  ? { background: "rgba(227,176,75,.15)", color: "#E3B04B", border: "1px solid rgba(227,176,75,.30)" }
                  : { color: "var(--muted-foreground)", border: "1px solid transparent" }
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
                <stop offset="5%" stopColor="#E3B04B" stopOpacity={0.20} />
                <stop offset="95%" stopColor="#E3B04B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="1 4" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#7E8E98", fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#7E8E98", fontSize: 10, fontFamily: "var(--font-mono)" }}
              width={42}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="members"
              stroke="#E3B04B"
              strokeWidth={1.5}
              fill="url(#goldFill)"
              dot={false}
              activeDot={{ r: 3, fill: "#E3B04B", strokeWidth: 0 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}
