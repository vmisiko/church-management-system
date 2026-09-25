"use client"

import { useEffect, useState } from "react"
import Papa from "papaparse"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, UserCheck, UserX, ClipboardCheck, Download, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { useRetentionPloc, useDepartmentsPloc, useFellowshipsPloc } from "@/core/di/DependencyLocator"
import useRetentionState from "@/application/retention/useRetentionState"
import useDepartmentsState from "@/application/department/useDepartmentsState"
import useFellowshipsState from "@/application/fellowship/useFellowshipsState"
import type { AtRiskReason, RetentionStats } from "@/domain/entities/retention/Retention"
import { buildRetentionCsvRows, buildRetentionSummaryTable, buildRetentionBreakdownTable, retentionExportFilename } from "@/core/utility/retentionExportRows"

const chartConfig = {
  rate: {
    label: "30-day Retention Rate",
    color: "var(--color-primary)",
  },
}

const REASON_LABELS: Record<AtRiskReason, string> = {
  inactive: "Inactive",
  stale_guest: "Guest, never attended",
}

function exportCsv(stats: RetentionStats, from: string, to: string) {
  const csv = Papa.unparse(buildRetentionCsvRows(stats))
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = retentionExportFilename("csv", from, to)
  a.click()
  URL.revokeObjectURL(url)
}

async function exportPdf(stats: RetentionStats, from: string, to: string) {
  // Loaded on demand: jspdf's Node build can't be bundled for SSR, and it is only needed on click.
  const [{ default: jsPDF }, { autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")])
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text("Retention Report", 14, 18)
  doc.setFontSize(10)
  doc.text(`Date range: ${from || "All time"} — ${to || "Now"}`, 14, 25)

  autoTable(doc, {
    startY: 32,
    head: [["Metric", "Eligible / Total", "Value", "Rate"]],
    body: buildRetentionSummaryTable(stats),
  })

  const breakdownRows = buildRetentionBreakdownTable(stats)
  if (breakdownRows.length > 0) {
    autoTable(doc, {
      head: [["Group", "Members", "Active"]],
      body: breakdownRows,
    })
  }

  doc.save(retentionExportFilename("pdf", from, to))
}

export default function RetentionPage() {
  const retentionPloc = useRetentionPloc()
  const departmentsPloc = useDepartmentsPloc()
  const fellowshipsPloc = useFellowshipsPloc()
  const stats = useRetentionState((s) => s.stats)
  const loading = useRetentionState((s) => s.loading)
  const atRiskMembers = useRetentionState((s) => s.atRiskMembers)
  const atRiskTotal = useRetentionState((s) => s.atRiskTotal)
  const atRiskPage = useRetentionState((s) => s.atRiskPage)
  const atRiskLimit = useRetentionState((s) => s.atRiskLimit)
  const atRiskLoading = useRetentionState((s) => s.atRiskLoading)
  const departments = useDepartmentsState((s) => (Array.isArray(s.departments) ? s.departments : []))
  const fellowships = useFellowshipsState((s) => (Array.isArray(s.fellowships) ? s.fellowships : []))

  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [fellowshipId, setFellowshipId] = useState("")

  useEffect(() => {
    void retentionPloc.fetchStats()
    void retentionPloc.fetchAtRiskMembers(1, 20)
    void departmentsPloc.fetchAll()
    void fellowshipsPloc.fetchAll()
  }, [retentionPloc, departmentsPloc, fellowshipsPloc])

  const applyFilters = () => {
    void retentionPloc.fetchStats({
      from: from || undefined,
      to: to || undefined,
      departmentId: departmentId || undefined,
      fellowshipId: fellowshipId || undefined,
    })
  }

  const totalPages = Math.max(1, Math.ceil(atRiskTotal / atRiskLimit))

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Retention</h1>
            <p className="text-muted-foreground">Track retention, guest conversion, and members who need attention.</p>
          </div>
        </div>

        {!stats && loading && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stats.cohortRetention.d30.rate}%</p>
                    <p className="text-sm text-muted-foreground">30-day retention</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <UserCheck className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">{stats.guestConversion.rate}%</p>
                    <p className="text-sm text-muted-foreground">Guest conversion</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <ClipboardCheck className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{stats.followUpCompletion.rate}%</p>
                    <p className="text-sm text-muted-foreground">Follow-up completion</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <UserX className="h-8 w-8 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">{atRiskTotal}</p>
                    <p className="text-sm text-muted-foreground">At-risk members</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Retention Trend</CardTitle>
                <CardDescription>30-day retention rate for members who joined each month</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.trend.every((p) => p.eligible === 0) ? (
                  <p className="text-sm text-muted-foreground text-center py-10">Not enough historical data yet — cohorts need to be 30+ days old to appear here.</p>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} width={40} unit="%" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="rate" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leadership Report</CardTitle>
                <CardDescription>Filter by date range or group, then export.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="retention-from">From</FieldLabel>
                      <Input id="retention-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="retention-to">To</FieldLabel>
                      <Input id="retention-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Department</FieldLabel>
                      <Select value={departmentId || "all"} onValueChange={(v) => setDepartmentId(v === "all" ? "" : v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All departments</SelectItem>
                          {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Fellowship</FieldLabel>
                      <Select value={fellowshipId || "all"} onValueChange={(v) => setFellowshipId(v === "all" ? "" : v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All fellowships</SelectItem>
                          {fellowships.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={applyFilters} disabled={loading}>Apply filters</Button>
                  <Button variant="outline" className="gap-2" onClick={() => exportCsv(stats, from, to)}>
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => void exportPdf(stats, from, to)}>
                    <FileText className="h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
                {(stats.departmentBreakdown || stats.fellowshipBreakdown) && (
                  <Table className="mt-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group</TableHead>
                        <TableHead className="text-right">Members</TableHead>
                        <TableHead className="text-right">Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...(stats.departmentBreakdown ?? []), ...(stats.fellowshipBreakdown ?? [])].map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell className="text-right">{row.memberCount}</TableCell>
                          <TableCell className="text-right">{row.activeCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>At-risk members</CardTitle>
            <CardDescription>Inactive members, or guests who joined 30+ days ago with no recorded attendance.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {atRiskLoading && atRiskMembers.length === 0 ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : atRiskMembers.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No at-risk members right now.</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Name</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atRiskMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.firstName} {member.lastName}</TableCell>
                        <TableCell>
                          <Badge variant={member.reason === "inactive" ? "destructive" : "secondary"}>
                            {REASON_LABELS[member.reason]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{member.joinedAt}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/follow-ups?memberId=${member.id}`}>Create follow-up</a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-between p-4 border-t">
                  <p className="text-sm text-muted-foreground">Page {atRiskPage} of {totalPages} · {atRiskTotal} total</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={atRiskPage <= 1}
                      onClick={() => void retentionPloc.fetchAtRiskMembers(atRiskPage - 1, atRiskLimit)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={atRiskPage >= totalPages}
                      onClick={() => void retentionPloc.fetchAtRiskMembers(atRiskPage + 1, atRiskLimit)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
