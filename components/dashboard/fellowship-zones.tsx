"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useDashboardStats } from "./use-dashboard-stats"
import { WidgetFrame, WidgetLoading, WidgetError, WidgetEmpty } from "./widget-frame"

/*
 * Zones with at least one fellowship, from GET /api/dashboard/stats.
 * Shows: zone name, active fellowships, members, size relative to the largest zone, meeting days.
 */

const TITLE = "Fellowship Zones"
const dayOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

/** Fellowships store the day as free text ("Friday"); match on the first three letters. */
function shortDays(days: string[]): Set<string> {
  return new Set(days.map((d) => d.trim().slice(0, 3).toLowerCase()))
}

export function FellowshipZones() {
  const { stats, error, loading } = useDashboardStats()

  if (error) return <WidgetFrame title={TITLE}><WidgetError message="Couldn't load fellowship zones." /></WidgetFrame>
  if (loading || !stats) return <WidgetFrame title={TITLE}><WidgetLoading rows={4} /></WidgetFrame>

  const zones = stats.fellowships.zones ?? []
  if (zones.length === 0) {
    return (
      <WidgetFrame title={TITLE}>
        <WidgetEmpty>
          No fellowships yet.{" "}
          <Link href="/fellowships" className="underline" style={{ color: "var(--primary)" }}>Add one</Link>
        </WidgetEmpty>
      </WidgetFrame>
    )
  }

  const totalMembers = zones.reduce((s, z) => s + z.memberCount, 0)
  const totalFellowships = zones.reduce((s, z) => s + z.fellowshipCount, 0)
  const largest = Math.max(...zones.map((z) => z.memberCount), 1)

  return (
    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display text-[1.4rem] font-light italic text-foreground">{TITLE}</h2>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5 text-muted-foreground">
            {zones.length} {zones.length === 1 ? "zone" : "zones"} · {totalFellowships} {totalFellowships === 1 ? "fellowship" : "fellowships"} · {totalMembers.toLocaleString()} members
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
          const sizePct = Math.round((zone.memberCount / largest) * 100)
          const hasIssue = zone.activeFellowships < zone.fellowshipCount
          const meets = shortDays(zone.meetingDays ?? [])

          return (
            <Link
              key={zone.id}
              href="/fellowships"
              className="group block rounded-lg px-3 py-3 cursor-pointer transition-all"
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
                    {zone.memberCount.toLocaleString()} {zone.memberCount === 1 ? "member" : "members"}
                  </span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Size relative to the largest zone */}
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${sizePct}%`, background: "#E3B04B" }}
                />
              </div>

              {/* Meeting days */}
              <div className="flex gap-1 mt-2">
                {dayOfWeek.map((d) => (
                  <span
                    key={d}
                    className="font-mono text-[7.5px] px-1 py-0.5 rounded"
                    style={
                      meets.has(d.toLowerCase())
                        ? { background: "rgba(227,176,75,.15)", color: "#E3B04B" }
                        : { color: "var(--muted-foreground)", opacity: 0.3 }
                    }
                  >
                    {d}
                  </span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
