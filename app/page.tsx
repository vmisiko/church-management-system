import { AppShell } from "@/components/app-shell"
import { KpiCardsGrid } from "@/components/dashboard/kpi-cards"
import { MembershipChart } from "@/components/dashboard/membership-chart"
import { PriorityAlerts } from "@/components/dashboard/priority-alerts"
import { WeeklyGoal } from "@/components/dashboard/weekly-goal"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { AttendanceTrends } from "@/components/dashboard/attendance-trends"
import { Button } from "@/components/ui/button"
import { FileText, Video } from "lucide-react"

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Pastor. Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
            <Button className="gap-2 bg-primary text-primary-foreground">
              <Video className="h-4 w-4" />
              Live Streaming
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <KpiCardsGrid />

        {/* Charts and Alerts Row */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Membership Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <MembershipChart />
          </div>

          {/* Right Column - Alerts and Goal */}
          <div className="flex flex-col gap-6">
            <PriorityAlerts />
            <WeeklyGoal
              goal="Add 30 new members to Lang'ata Fellowship."
              target={30}
              current={24}
            />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AttendanceTrends />
          <RecentActivity />
        </div>
      </div>
    </AppShell>
  )
}
