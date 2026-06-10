"use client"

import { useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
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

const attendanceHistory = [
  { id: "1", date: "2024-03-31", event: "Sunday Service (8:00 AM)", count: 342, type: "service" },
  { id: "2", date: "2024-03-31", event: "Sunday Service (10:30 AM)", count: 489, type: "service" },
  { id: "3", date: "2024-03-27", event: "Wednesday Bible Study", count: 156, type: "midweek" },
  { id: "4", date: "2024-03-24", event: "Sunday Service (8:00 AM)", count: 328, type: "service" },
  { id: "5", date: "2024-03-24", event: "Sunday Service (10:30 AM)", count: 512, type: "service" },
  { id: "6", date: "2024-03-22", event: "Friday Night Vigil", count: 234, type: "special" },
  { id: "7", date: "2024-03-20", event: "Wednesday Bible Study", count: 148, type: "midweek" },
  { id: "8", date: "2024-03-17", event: "Sunday Service (8:00 AM)", count: 315, type: "service" },
  { id: "9", date: "2024-03-17", event: "Sunday Service (10:30 AM)", count: 478, type: "service" },
]

const weeklyData = [
  { week: "Week 1", attendance: 820 },
  { week: "Week 2", attendance: 856 },
  { week: "Week 3", attendance: 793 },
  { week: "Week 4", attendance: 831 },
]

const chartConfig = {
  attendance: {
    label: "Attendance",
    color: "var(--color-primary)",
  },
}

const eventTypes = {
  service: "bg-primary/20 text-primary",
  midweek: "bg-accent/30 text-accent-foreground",
  special: "bg-chart-4/20 text-chart-4",
}

export default function AttendancePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState("all")

  const filteredHistory = attendanceHistory.filter((record) => {
    if (selectedEvent === "all") return true
    return record.type === selectedEvent
  })

  const totalAttendance = attendanceHistory
    .filter((r) => r.date.startsWith("2024-03"))
    .reduce((acc, r) => acc + r.count, 0)

  const averageAttendance = Math.round(
    attendanceHistory
      .filter((r) => r.type === "service")
      .reduce((acc, r) => acc + r.count, 0) /
      attendanceHistory.filter((r) => r.type === "service").length
  )

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
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button onClick={() => setIsRecordDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Record Attendance
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border shadow-sm bg-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">{totalAttendance.toLocaleString()}</p>
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
                  <p className="text-2xl font-bold">{averageAttendance}</p>
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
                  <p className="text-2xl font-bold">{attendanceHistory.length}</p>
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
                  <p className="text-2xl font-bold">+8%</p>
                  <p className="text-sm text-muted-foreground">vs Last Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Calendar and Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Trend Chart */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Weekly Attendance Trend</CardTitle>
                <CardDescription>Total attendance per week this month</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Attendance History Table */}
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Attendance History</CardTitle>
                  <CardDescription>Recent attendance records</CardDescription>
                </div>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="service">Sunday Services</SelectItem>
                    <SelectItem value="midweek">Midweek</SelectItem>
                    <SelectItem value="special">Special Events</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Event</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold text-right">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="text-muted-foreground">
                          {record.date}
                        </TableCell>
                        <TableCell className="font-medium">{record.event}</TableCell>
                        <TableCell>
                          <Badge className={eventTypes[record.type as keyof typeof eventTypes]}>
                            {record.type === "service" ? "Sunday" : record.type === "midweek" ? "Midweek" : "Special"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{record.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Calendar */}
          <div>
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
                  <Button
                    className="w-full mt-4"
                    onClick={() => setIsRecordDialogOpen(true)}
                  >
                    Record for This Date
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Record Attendance Dialog */}
        <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Record Attendance</DialogTitle>
              <DialogDescription>
                Enter attendance details for a service or event.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); setIsRecordDialogOpen(false); }}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="eventDate">Date</FieldLabel>
                    <Input
                      id="eventDate"
                      type="date"
                      defaultValue={date?.toISOString().split("T")[0]}
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Event Type</FieldLabel>
                    <Select defaultValue="service">
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service-8am">Sunday Service (8:00 AM)</SelectItem>
                        <SelectItem value="service-1030am">Sunday Service (10:30 AM)</SelectItem>
                        <SelectItem value="bible-study">Wednesday Bible Study</SelectItem>
                        <SelectItem value="vigil">Friday Night Vigil</SelectItem>
                        <SelectItem value="special">Special Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="adults">Adults</FieldLabel>
                      <Input id="adults" type="number" placeholder="0" />
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="children">Children</FieldLabel>
                      <Input id="children" type="number" placeholder="0" />
                    </Field>
                  </FieldGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="firstTimers">First Timers</FieldLabel>
                      <Input id="firstTimers" type="number" placeholder="0" />
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="total">Total Count</FieldLabel>
                      <Input id="total" type="number" placeholder="0" />
                    </Field>
                  </FieldGroup>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Attendance</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
