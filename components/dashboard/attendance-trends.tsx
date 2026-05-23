"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const attendanceData = [
  { week: "Week 1", service8am: 320, service1030am: 450 },
  { week: "Week 2", service8am: 340, service1030am: 480 },
  { week: "Week 3", service8am: 310, service1030am: 460 },
  { week: "Week 4", service8am: 360, service1030am: 490 },
]

const chartConfig = {
  service8am: {
    label: "8:00 AM",
    color: "var(--color-primary)",
  },
  service1030am: {
    label: "10:30 AM",
    color: "var(--color-chart-2)",
  },
}

export function AttendanceTrends() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Attendance Trends</CardTitle>
            <CardDescription>Weekly service participation</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>8:00 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chart-2" />
              <span>10:30 AM</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={attendanceData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              width={60}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="service8am"
              fill="var(--color-primary)"
              radius={[0, 4, 4, 0]}
              barSize={16}
            />
            <Bar
              dataKey="service1030am"
              fill="var(--color-chart-2)"
              radius={[0, 4, 4, 0]}
              barSize={16}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
