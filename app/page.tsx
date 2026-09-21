import { AppShell } from "@/components/app-shell"
import { KpiCardsGrid } from "@/components/dashboard/kpi-cards"
import { FollowUpActivity } from "@/components/dashboard/follow-up-activity"
import { AttendanceSessions } from "@/components/dashboard/attendance-sessions"
import { MemberDemographics } from "@/components/dashboard/member-demographics"
import { LiveAlerts } from "@/components/dashboard/live-alerts"
import { FellowshipZones } from "@/components/dashboard/fellowship-zones"
import { MessageStats } from "@/components/dashboard/message-stats"
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting"

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="px-7 py-6 max-w-[1440px] mx-auto space-y-6">

        {/* ── Greeting ── */}
        <DashboardGreeting />

        {/* Gold divider */}
        <div
          className="rise rise-4 h-px w-full"
          style={{ background: "linear-gradient(90deg, rgba(227,176,75,.32), rgba(227,176,75,.06) 70%, transparent)" }}
        />

        {/* ── 6 KPI cards ── */}
        <div className="rise rise-5">
          <KpiCardsGrid />
        </div>

        {/* ── Follow-up activity ── */}
        <div className="rise rise-6">
          <FollowUpActivity />
        </div>

        {/* ── Attendance (full width) ── */}
        <div className="rise rise-7">
          <AttendanceSessions />
        </div>

        {/* ── Demographics + Alerts ── */}
        <div className="rise rise-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <MemberDemographics />
          <div className="lg:col-span-2">
            <LiveAlerts />
          </div>
        </div>

        {/* ── Fellowship Zones ── */}
        <div className="rise rise-9">
          <FellowshipZones />
        </div>

        {/* ── Messaging Stats ── */}
        <div className="rise rise-10">
          <MessageStats />
        </div>

        <div className="h-4" />
      </div>
    </AppShell>
  )
}
