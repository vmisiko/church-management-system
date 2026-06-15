import { AppShell } from "@/components/app-shell"
import { KpiCardsGrid } from "@/components/dashboard/kpi-cards"
import { MembershipChart } from "@/components/dashboard/membership-chart"
import { PriorityAlerts } from "@/components/dashboard/priority-alerts"
import { WeeklyGoal } from "@/components/dashboard/weekly-goal"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { AttendanceTrends } from "@/components/dashboard/attendance-trends"
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting"

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="px-7 py-6 max-w-[1440px] mx-auto space-y-7">

        {/* ── Oversized greeting ── */}
        <DashboardGreeting />

        {/* ── Divider ── */}
        <div
          className="rise rise-4 h-px w-full"
          style={{ background: "linear-gradient(90deg, rgba(227,176,75,.32), rgba(227,176,75,.06) 70%, transparent)" }}
        />

        {/* ── Numbered vault cards ── */}
        <div className="rise rise-5">
          <KpiCardsGrid />
        </div>

        {/* ── Analytics row ── */}
        <div className="rise rise-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MembershipChart />
          </div>
          <div className="flex flex-col gap-5">
            <PriorityAlerts />
            <WeeklyGoal
              goal="Add 30 new members to Lang'ata Fellowship."
              target={30}
              current={24}
            />
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="rise rise-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AttendanceTrends />
          <RecentActivity />
        </div>

        <div className="h-4" />
      </div>
    </AppShell>
  )
}
