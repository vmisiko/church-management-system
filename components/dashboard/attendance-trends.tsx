"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const attendanceData = [
  { week: "Wk 1", service8am: 320, service1030am: 450 },
  { week: "Wk 2", service8am: 340, service1030am: 480 },
  { week: "Wk 3", service8am: 310, service1030am: 460 },
  { week: "Wk 4", service8am: 360, service1030am: 490 },
]

const chartConfig = {
  service8am:   { label: "8:00 AM",  color: "#A87C2A" },
  service1030am:{ label: "10:30 AM", color: "#E3B04B" },
}

export function AttendanceTrends() {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 8px rgba(0,0,0,.06)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-display text-[1.4rem] font-light italic text-foreground">Attendance</h2>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5 text-muted-foreground">
            Weekly service participation
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { label: "8:00 AM",  color: "#A87C2A" },
            { label: "10:30 AM", color: "#E3B04B" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="h-px w-4 inline-block" style={{ background: color }} />
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[190px] w-full">
          <BarChart data={attendanceData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#7E8E98", fontSize: 10, fontFamily: "var(--font-mono)" }}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="service8am"    fill="#A87C2A" radius={[0, 3, 3, 0]} barSize={8} />
            <Bar dataKey="service1030am" fill="#E3B04B" radius={[0, 3, 3, 0]} barSize={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}
