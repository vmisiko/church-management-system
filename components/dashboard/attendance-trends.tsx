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
  service8am: { label: "8:00 AM", color: "oklch(0.52 0.14 60)" },
  service1030am: { label: "10:30 AM", color: "oklch(0.72 0.14 78)" },
}

export function AttendanceTrends() {
  return (
    <div
      className="rounded p-5"
      style={{
        background: 'oklch(0.12 0.015 252)',
        border: '1px solid oklch(0.20 0.015 252)',
        boxShadow: '0 2px 12px oklch(0 0 0 / 0.25)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2
            className="font-display text-[1.4rem] font-light italic"
            style={{ color: 'oklch(0.93 0.005 75)' }}
          >
            Attendance
          </h2>
          <p
            className="font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5"
            style={{ color: 'oklch(0.40 0.01 75)' }}
          >
            Weekly service participation
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5">
          {[
            { label: "8:00 AM", color: 'oklch(0.52 0.14 60)' },
            { label: "10:30 AM", color: 'oklch(0.72 0.14 78)' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="h-px w-4" style={{ background: color }} />
              <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'oklch(0.40 0.01 75)' }}>
                {label}
              </span>
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
              tick={{ fill: 'oklch(0.35 0.01 75)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="service8am" fill="oklch(0.52 0.14 60)" radius={[0, 2, 2, 0]} barSize={8} />
            <Bar dataKey="service1030am" fill="oklch(0.72 0.14 78)" radius={[0, 2, 2, 0]} barSize={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}
