"use client"

import { useEffect, useMemo, useState } from "react"
import { format, startOfWeek, isSameMonth, isSameDay, subMonths, compareDesc } from "date-fns"
import { AppShell } from "@/components/app-shell"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Plus,
  Users,
  TrendingUp,
  CalendarDays,
  Download,
  Clock,
} from "lucide-react"
import useAttendanceState from "@/application/attendance/useAttendanceState"
import { useAttendancePloc } from "@/core/di/DependencyLocator"
import { RecordAttendanceDialog } from "@/components/attendance/record-attendance-dialog"
import type { SessionSummary, SessionType } from "@/domain/entities/attendance/Attendance"

const typeLabel: Record<SessionType, string> = {
  sunday_service: "Sunday",
  midweek_service: "Midweek",
  fellowship: "Fellowship",
  special_event: "Special",
}

const typeBadgeClass: Record<SessionType, string> = {
  sunday_service: "bg-primary/20 text-primary",
  midweek_service: "bg-accent/30 text-accent-foreground",
  fellowship: "bg-success/20 text-success",
  special_event: "bg-chart-4/20 text-chart-4",
}

const chartConfig = {
  attendance: {
    label: "Attendance",
    color: "var(--color-primary)",
  },
}

function exportCsv(rows: SessionSummary[]) {
  const header = ["Date", "Title", "Type", "Present", "Absent", "Excused", "Adults", "Children", "First-timers", "Guests", "Members"]
  const lines = rows.map((s) => [
    s.sessionDate,
    `"${s.title.replace(/"/g, '""')}"`,
    typeLabel[s.sessionType],
    s.present,
    s.absent,
    s.excused,
    s.adults,
    s.children,
    s.firstTimers,
    s.guests,
    s.members,
  ].join(","))
  const csv = [header.join(","), ...lines].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `attendance-report-${format(new Date(), "yyyy-MM-dd")}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AttendancePage() {
  const attendancePloc = useAttendancePloc()
  const sessionSummaries = useAttendanceState((s) => s.sessionSummaries)
  const loading = useAttendanceState((s) => s.loading)
  const error = useAttendanceState((s) => s.error)

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<SessionSummary | undefined>(undefined)
  const [selectedType, setSelectedType] = useState<SessionType | "all">("all")

  useEffect(() => {
    void attendancePloc.fetchSessionsSummary()
  }, [attendancePloc])

  const filteredHistory = useMemo(
    () =>
      sessionSummaries
        .filter((s) => selectedType === "all" || s.sessionType === selectedType)
        .sort((a, b) => compareDesc(new Date(a.sessionDate), new Date(b.sessionDate))),
    [sessionSummaries, selectedType],
  )

  const now = useMemo(() => new Date(), [])
  const thisMonthSessions = useMemo(() => sessionSummaries.filter((s) => isSameMonth(new Date(s.sessionDate), now)), [sessionSummaries, now])
  const lastMonthSessions = useMemo(() => sessionSummaries.filter((s) => isSameMonth(new Date(s.sessionDate), subMonths(now, 1))), [sessionSummaries, now])

  const monthlyTotal = thisMonthSessions.reduce((acc, s) => acc + s.present, 0)
  const lastMonthTotal = lastMonthSessions.reduce((acc, s) => acc + s.present, 0)
  const monthGrowth = lastMonthTotal > 0 ? Math.round(((monthlyTotal - lastMonthTotal) / lastMonthTotal) * 100) : null

  const monthlyGuests = thisMonthSessions.reduce((acc, s) => acc + s.guests, 0)
  const monthlyMembers = thisMonthSessions.reduce((acc, s) => acc + s.members, 0)
  const guestMemberTotal = monthlyGuests + monthlyMembers
  const guestPct = guestMemberTotal > 0 ? Math.round((monthlyGuests / guestMemberTotal) * 100) : 0
  const memberPct = guestMemberTotal > 0 ? 100 - guestPct : 0

  const sundaySessions = sessionSummaries.filter((s) => s.sessionType === "sunday_service")
  const averageAttendance = sundaySessions.length > 0
    ? Math.round(sundaySessions.reduce((acc, s) => acc + s.present, 0) / sundaySessions.length)
    : 0

  const weeklyData = useMemo(() => {
    const buckets = new Map<string, { week: string; attendance: number; order: number }>()
    for (const s of thisMonthSessions) {
      const start = startOfWeek(new Date(s.sessionDate))
      const key = format(start, "MMM d")
      const current = buckets.get(key)
      if (current) current.attendance += s.present
      else buckets.set(key, { week: key, attendance: s.present, order: start.getTime() })
    }
    return Array.from(buckets.values()).sort((a, b) => a.order - b.order)
  }, [thisMonthSessions])

  const sessionsOnSelectedDate = date ? sessionSummaries.filter((s) => isSameDay(new Date(s.sessionDate), date)) : []

  const openCreateDialog = () => {
    setEditingSession(undefined)
    setIsRecordDialogOpen(true)
  }

  const openEditDialog = (session: SessionSummary) => {
    setEditingSession(session)
    setIsRecordDialogOpen(true)
  }

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Attendance</h1>
            <p className="text-muted-foreground">
              Track and analyze service attendance
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={() => exportCsv(filteredHistory)} disabled={filteredHistory.length === 0}>
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Record Attendance
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border shadow-sm mb-6">
            <CardContent className="p-4 text-center text-sm text-destructive">
              Couldn&apos;t load attendance data.
            </CardContent>
          </Card>
        )}

        {!error && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <Card className="border shadow-sm bg-primary text-primary-foreground">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 opacity-80" />
                    <div>
                      <p className="text-2xl font-bold">{loading && sessionSummaries.length === 0 ? "—" : monthlyTotal.toLocaleString()}</p>
                      <p className="text-sm opacity-80">Monthly Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{loading && sessionSummaries.length === 0 ? "—" : averageAttendance}</p>
                      <p className="text-sm text-muted-foreground">Avg. Sunday</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                      <CalendarDays className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{sessionSummaries.length}</p>
                      <p className="text-sm text-muted-foreground">Events Recorded</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/20">
                      <Clock className="h-5 w-5 text-chart-4" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{monthGrowth === null ? "—" : `${monthGrowth >= 0 ? "+" : ""}${monthGrowth}%`}</p>
                      <p className="text-sm text-muted-foreground">vs Last Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Chart and Table */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>Weekly Attendance Trend</CardTitle>
                    <CardDescription>Total attendance per week this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {weeklyData.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-10">No sessions recorded this month yet.</p>
                    ) : (
                      <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                            <XAxis
                              dataKey="week"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                              width={45}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                              dataKey="attendance"
                              fill="var(--color-primary)"
                              radius={[4, 4, 0, 0]}
                              barSize={40}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    )}
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Attendance History</CardTitle>
                      <CardDescription>Click a row to view or edit its records</CardDescription>
                    </div>
                    <Select value={selectedType} onValueChange={(v) => setSelectedType(v as SessionType | "all")}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="sunday_service">Sunday Services</SelectItem>
                        <SelectItem value="midweek_service">Midweek</SelectItem>
                        <SelectItem value="fellowship">Fellowship</SelectItem>
                        <SelectItem value="special_event">Special Events</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loading && sessionSummaries.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-10">Loading…</p>
                    ) : filteredHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-10">No attendance records yet.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Event</TableHead>
                            <TableHead className="font-semibold">Type</TableHead>
                            <TableHead className="font-semibold text-right">Present</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredHistory.map((record) => (
                            <TableRow key={record.id} className="cursor-pointer" onClick={() => openEditDialog(record)}>
                              <TableCell className="text-muted-foreground">
                                {format(new Date(record.sessionDate), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell className="font-medium">{record.title}</TableCell>
                              <TableCell>
                                <Badge className={typeBadgeClass[record.sessionType]}>
                                  {typeLabel[record.sessionType]}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-semibold">{record.present}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Calendar */}
              <div className="space-y-6">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>Guests vs Members</CardTitle>
                    <CardDescription>Present attendees this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {guestMemberTotal === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No attendance recorded this month yet.</p>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="font-medium">Members</span>
                            <span className="text-muted-foreground">{monthlyMembers} ({memberPct}%)</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${memberPct}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="font-medium">Guests</span>
                            <span className="text-muted-foreground">{monthlyGuests} ({guestPct}%)</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-accent" style={{ width: `${guestPct}%` }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                    <CardDescription>Pick a date to view or record attendance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md"
                    />
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Selected Date:</p>
                      <p className="font-semibold">
                        {date ? formatDate(date, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "Select a date"}
                      </p>
                      {sessionsOnSelectedDate.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          {sessionsOnSelectedDate.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => openEditDialog(s)}
                              className="w-full text-left text-sm rounded-md border px-3 py-2 hover:bg-muted/50 transition-colors"
                            >
                              <span className="font-medium">{s.title}</span>
                              <span className="text-muted-foreground"> · {s.present} present</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <Button
                        className="w-full mt-4"
                        onClick={() => {
                          setEditingSession(undefined)
                          setIsRecordDialogOpen(true)
                        }}
                      >
                        Record for This Date
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        <RecordAttendanceDialog
          open={isRecordDialogOpen}
          onOpenChange={setIsRecordDialogOpen}
          initialDate={date?.toISOString().slice(0, 10)}
          session={editingSession}
          onSaved={() => void attendancePloc.fetchSessionsSummary()}
        />
      </div>
    </AppShell>
  )
}
