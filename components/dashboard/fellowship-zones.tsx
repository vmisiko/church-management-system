"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

/*
 * Based on Fellowship + FellowshipZone entities.
 * Shows: zone name, fellowship count, total members, activity health bar.
 */

interface Zone {
  name: string
  fellowshipCount: number
  totalMembers: number
  target: number
  activeFellowships: number
  meetingDays: string[]
}

const zones: Zone[] = [
  {
    name: "Nairobi Central",
    fellowshipCount: 4, activeFellowships: 4,
    totalMembers: 720, target: 800,
    meetingDays: ["Mon", "Wed", "Fri", "Sat"],
  },
  {
    name: "Thika Road",
    fellowshipCount: 3, activeFellowships: 3,
    totalMembers: 540, target: 600,
    meetingDays: ["Tue", "Thu", "Sat"],
  },
  {
    name: "Eastlands",
    fellowshipCount: 4, activeFellowships: 3,
    totalMembers: 610, target: 700,
    meetingDays: ["Mon", "Wed", "Fri", "Sun"],
  },
  {
    name: "Kawangware",
    fellowshipCount: 2, activeFellowships: 2,
    totalMembers: 310, target: 350,
    meetingDays: ["Tue", "Sat"],
  },
  {
    name: "Lang'ata",
    fellowshipCount: 2, activeFellowships: 1,
    totalMembers: 161, target: 300,
    meetingDays: ["Wed", "Sat"],
  },
]

const dayOfWeek = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]

export function FellowshipZones() {
  const totalMembers = zones.reduce((s, z) => s + z.totalMembers, 0)
  const totalFellowships = zones.reduce((s, z) => s + z.fellowshipCount, 0)

  return (
    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display text-[1.4rem] font-light italic text-foreground">Fellowship Zones</h2>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5 text-muted-foreground">
            {zones.length} zones · {totalFellowships} fellowships · {totalMembers.toLocaleString()} members
          </p>
        </div>
        <Link href="/fellowships"
          className="font-mono text-[9px] uppercase tracking-wider hover:opacity-70 transition-opacity cursor-pointer"
          style={{ color: "var(--primary)" }}>
          View all →
        </Link>
      </div>

      {/* Zone rows */}
      <div className="flex flex-col gap-1">
        {zones.map((zone) => {
          const fillPct = Math.min(Math.round((zone.totalMembers / zone.target) * 100), 100)
          const hasIssue = zone.activeFellowships < zone.fellowshipCount

          return (
            <div
              key={zone.name}
              className="group rounded-lg px-3 py-3 cursor-pointer transition-all"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--secondary)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: hasIssue ? "#EFA64A" : "#6FD79B" }}
                  />
                  <span className="text-[13px] font-medium text-foreground">{zone.name}</span>
                  {hasIssue && (
                    <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(239,166,74,.12)", color: "#EFA64A" }}>
                      {zone.activeFellowships}/{zone.fellowshipCount} active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {zone.totalMembers.toLocaleString()} members
                  </span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${fillPct}%`,
                    background: fillPct >= 90 ? "#6FD79B" : fillPct >= 60 ? "#E3B04B" : "#EFA64A",
                  }}
                />
              </div>

              {/* Meeting days */}
              <div className="flex gap-1 mt-2">
                {dayOfWeek.map((d) => (
                  <span
                    key={d}
                    className="font-mono text-[7.5px] px-1 py-0.5 rounded"
                    style={
                      zone.meetingDays.includes(d)
                        ? { background: "rgba(227,176,75,.15)", color: "#E3B04B" }
                        : { color: "var(--muted-foreground)", opacity: 0.3 }
                    }
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
