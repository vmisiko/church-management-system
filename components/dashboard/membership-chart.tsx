"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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
  members: {
    label: "Members",
    color: "var(--color-primary)",
  },
}

export function MembershipChart() {
  const [period, setPeriod] = useState("6months")

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Membership Growth</CardTitle>
          <CardDescription>Historical data trend</CardDescription>
        </div>
        <ToggleGroup
          type="single"
          value={period}
          onValueChange={(value) => value && setPeriod(value)}
          className="bg-secondary rounded-lg p-1"
        >
          <ToggleGroupItem
            value="6months"
            className="text-xs px-3 py-1 data-[state=on]:bg-card"
          >
            6 Months
          </ToggleGroupItem>
          <ToggleGroupItem
            value="1year"
            className="text-xs px-3 py-1 data-[state=on]:bg-card"
          >
            1 Year
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={membershipData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="memberGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              width={45}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="members"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#memberGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
