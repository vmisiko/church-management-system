"use client"

import { useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { PhoneCall } from "lucide-react"
import useDashboardState from "@/application/dashboard/useDashboardState"
import { useDashboardPloc } from "@/core/di/DependencyLocator"

const METHOD_LABELS: Record<string, string> = { call: "Call", sms: "SMS", email: "Email", visit: "Visit", other: "Other" }
const OUTCOME_META: Record<string, { label: string; color: string }> = {
  connected: { label: "Connected", color: "#6FD79B" },
  no_answer: { label: "No answer", color: "#EFA64A" },
  requested_callback: { label: "Callback requested", color: "#5CA8E0" },
  not_interested: { label: "Not interested", color: "#EB6A56" },
  wrong_number: { label: "Wrong number", color: "#8A8578" },
  other: { label: "Other", color: "#8A8578" },
}

export function FollowUpActivity() {
  const dashboardPloc = useDashboardPloc()
  const stats = useDashboardState((state) => state.stats)
  const loading = useDashboardState((state) => state.loading)
  const error = useDashboardState((state) => state.error)

  // KpiCardsGrid already triggers the initial fetch into the shared
  // dashboard-stats store; this panel just renders a slice of it.
  useEffect(() => {
    if (!stats && !loading && !error) void dashboardPloc.fetchStats()
  }, [dashboardPloc, stats, loading, error])

  const recentAttempts = stats?.followUps.recentAttempts ?? []

  return (
    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="font-display text-[1.4rem] font-light italic text-foreground">
          Follow-up Activity
        </h2>
        <div className="flex-1 h-px"
          style={{ background: "linear-gradient(90deg, rgba(227,176,75,.22), transparent)" }} />
        <a href="/follow-ups"
          className="font-mono text-[9px] uppercase tracking-[0.2em] cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: "rgba(227,176,75,.60)" }}>
          View all →
        </a>
      </div>

      {error && (
        <p className="text-[12px] text-center py-6" style={{ color: "#EB6A56" }}>
          Couldn&apos;t load follow-up activity.
        </p>
      )}

      {!error && loading && !stats && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-12 rounded-lg animate-pulse" style={{ background: "var(--border)", opacity: 0.4 }} />
          ))}
        </div>
      )}

      {!error && stats && recentAttempts.length === 0 && (
        <p className="text-[12px] text-muted-foreground text-center py-6">No contact attempts recorded yet.</p>
      )}

      {!error && recentAttempts.length > 0 && (
        <div className="flex flex-col">
          {recentAttempts.map((attempt, i) => {
            const outcome = OUTCOME_META[attempt.outcome] ?? OUTCOME_META.other
            return (
              <div
                key={attempt.id}
                className="flex items-start gap-3 py-3"
                style={{ borderBottom: i < recentAttempts.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  background: `${outcome.color}18`,
                  border: `1px solid ${outcome.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <PhoneCall className="h-3.5 w-3.5" style={{ color: outcome.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-medium text-foreground leading-tight truncate">
                    {attempt.memberName} · {attempt.taskTitle}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    {METHOD_LABELS[attempt.contactMethod] ?? attempt.contactMethod}{" "}
                    {formatDistanceToNow(new Date(attempt.contactedAt), { addSuffix: true })}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: outcome.color }} />
                  <span className="font-mono text-[9px]" style={{ color: outcome.color }}>{outcome.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
