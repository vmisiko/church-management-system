"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Eye,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useDamageReportsPloc,
  useInventoryItemsPloc,
} from "@/core/di/DependencyLocator"
import useDamageReportsState from "@/application/inventory/useDamageReportsState"
import useInventoryItemsState from "@/application/inventory/useInventoryItemsState"
import type {
  DamageType,
  DamageSeverity,
  DamageStatus,
  DamageReport,
} from "@/domain/entities/inventory/DamageReport"

const damageTypeLabels: Record<DamageType, string> = {
  broken: "Broken",
  lost: "Lost",
  stolen: "Stolen",
  wear: "Wear & Tear",
  other: "Other",
}

const severityStyles: Record<DamageSeverity, string> = {
  minor: "bg-success/20 text-success border-success/30",
  moderate: "bg-warning/20 text-warning border-warning/30",
  severe: "bg-destructive/20 text-destructive border-destructive/30",
  total_loss: "bg-muted text-muted-foreground border-muted",
}

const severityLabels: Record<DamageSeverity, string> = {
  minor: "Minor",
  moderate: "Moderate",
  severe: "Severe",
  total_loss: "Total Loss",
}

const statusStyles: Record<DamageStatus, string> = {
  pending: "bg-warning/20 text-warning",
  investigating: "bg-primary/20 text-primary",
  resolved: "bg-success/20 text-success",
  written_off: "bg-muted text-muted-foreground",
}

const statusLabels: Record<DamageStatus, string> = {
  pending: "Pending",
  investigating: "Investigating",
  resolved: "Resolved",
  written_off: "Written Off",
}

const statusIcons: Record<DamageStatus, React.ElementType> = {
  pending: Clock,
  investigating: AlertTriangle,
  resolved: CheckCircle,
  written_off: XCircle,
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

const EMPTY_FORM = {
  itemId: "",
  reportedByName: "",
  damageType: "broken" as DamageType,
  severity: "moderate" as DamageSeverity,
  quantityAffected: 1,
  description: "",
}

export default function DamageReportsPage() {
  const reportsPloc = useDamageReportsPloc()
  const itemsPloc = useInventoryItemsPloc()

  const reports = useDamageReportsState((s) => s.reports)
  const loading = useDamageReportsState((s) => s.loading)
  const submitting = useDamageReportsState((s) => s.submitting)
  const items = useInventoryItemsState((s) => s.items)

  const [isReportOpen, setIsReportOpen] = useState(false)
  const [viewingReport, setViewingReport] = useState<DamageReport | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    reportsPloc.fetchAll()
    itemsPloc.fetchAll()
  }, [reportsPloc, itemsPloc])

  const getItemName = (itemId: string) =>
    items.find((i) => i.id === itemId)?.name ?? itemId

  const getItemCode = (itemId: string) =>
    items.find((i) => i.id === itemId)?.code ?? ""

  const filteredReports = reports.filter((report) => {
    const itemName = getItemName(report.itemId)
    const matchesSearch =
      itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedByName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = reports.filter((r) => r.status === "pending").length
  const investigatingCount = reports.filter((r) => r.status === "investigating").length
  const resolvedCount = reports.filter((r) => r.status === "resolved").length
  const writtenOffCount = reports.filter((r) => r.status === "written_off").length

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await reportsPloc.create({
      itemId: form.itemId,
      reportedByName: form.reportedByName,
      damageType: form.damageType,
      severity: form.severity,
      quantityAffected: form.quantityAffected,
      description: form.description,
    })
    if (ok) {
      setForm(EMPTY_FORM)
      setIsReportOpen(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: DamageStatus) => {
    await reportsPloc.update(id, { status })
  }

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Damage Reports</h1>
            <p className="text-muted-foreground">Track and manage damaged, lost, or broken inventory items</p>
          </div>
          <Button onClick={() => { setForm(EMPTY_FORM); setIsReportOpen(true) }} className="gap-2">
            <Plus className="h-4 w-4" />
            Report Damage
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                {loading && reports.length === 0 ? <Skeleton className="h-7 w-10 mb-1" /> : (
                  <p className="text-2xl font-bold text-warning">{pendingCount}</p>
                )}
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                {loading && reports.length === 0 ? <Skeleton className="h-7 w-10 mb-1" /> : (
                  <p className="text-2xl font-bold text-primary">{investigatingCount}</p>
                )}
                <p className="text-sm text-muted-foreground">Investigating</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                {loading && reports.length === 0 ? <Skeleton className="h-7 w-10 mb-1" /> : (
                  <p className="text-2xl font-bold text-success">{resolvedCount}</p>
                )}
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <XCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                {loading && reports.length === 0 ? <Skeleton className="h-7 w-10 mb-1" /> : (
                  <p className="text-2xl font-bold">{writtenOffCount}</p>
                )}
                <p className="text-sm text-muted-foreground">Written Off</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="written_off">Written Off</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reports Table */}
        <Card className="border shadow-sm">
          <CardContent className="p-0">
            {loading && reports.length === 0 ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Item</TableHead>
                    <TableHead className="font-semibold">Reported By</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Severity</TableHead>
                    <TableHead className="font-semibold">Qty</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No damage reports found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => {
                      const StatusIcon = statusIcons[report.status]
                      return (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{getItemName(report.itemId)}</p>
                              <p className="text-xs text-muted-foreground">{getItemCode(report.itemId)}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {getInitials(report.reportedByName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{report.reportedByName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{damageTypeLabels[report.damageType]}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={severityStyles[report.severity]}>
                              {severityLabels[report.severity]}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.quantityAffected}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {report.reportDate}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusStyles[report.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusLabels[report.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setViewingReport(report)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {report.status === "pending" && (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(report.id, "investigating")}>
                                    Start Investigation
                                  </DropdownMenuItem>
                                )}
                                {report.status === "investigating" && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate(report.id, "resolved")}>
                                      Mark as Resolved
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate(report.id, "written_off")}>
                                      Write Off
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Report Damage Dialog */}
        <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Report Damage</DialogTitle>
              <DialogDescription>Report a damaged, lost, or broken inventory item.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitReport}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Item</FieldLabel>
                    <Select
                      value={form.itemId}
                      onValueChange={(v) => setForm((f) => ({ ...f, itemId: v }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} ({item.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reportedBy">Reported By</FieldLabel>
                    <Input
                      id="reportedBy"
                      placeholder="Your name"
                      value={form.reportedByName}
                      onChange={(e) => setForm((f) => ({ ...f, reportedByName: e.target.value }))}
                      required
                    />
                  </Field>
                </FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Damage Type</FieldLabel>
                      <Select
                        value={form.damageType}
                        onValueChange={(v) => setForm((f) => ({ ...f, damageType: v as DamageType }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="broken">Broken</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                          <SelectItem value="stolen">Stolen</SelectItem>
                          <SelectItem value="wear">Wear & Tear</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Severity</FieldLabel>
                      <Select
                        value={form.severity}
                        onValueChange={(v) => setForm((f) => ({ ...f, severity: v as DamageSeverity }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minor">Minor</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                          <SelectItem value="total_loss">Total Loss</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="damageQty">Quantity Affected</FieldLabel>
                    <Input
                      id="damageQty"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={form.quantityAffected}
                      onChange={(e) => setForm((f) => ({ ...f, quantityAffected: Number(e.target.value) }))}
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      id="description"
                      placeholder="Describe what happened and the extent of the damage..."
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      required
                    />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsReportOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Report"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Report Details Dialog */}
        <Dialog open={!!viewingReport} onOpenChange={(open) => { if (!open) setViewingReport(null) }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Damage Report Details</DialogTitle>
              <DialogDescription>
                Reported on {viewingReport?.reportDate}
              </DialogDescription>
            </DialogHeader>
            {viewingReport && (
              <div className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Item</p>
                    <p className="font-medium">{getItemName(viewingReport.itemId)}</p>
                    <p className="text-xs text-muted-foreground">{getItemCode(viewingReport.itemId)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reported By</p>
                    <p className="font-medium">{viewingReport.reportedByName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Damage Type</p>
                    <Badge variant="outline">{damageTypeLabels[viewingReport.damageType]}</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Severity</p>
                    <Badge className={severityStyles[viewingReport.severity]}>
                      {severityLabels[viewingReport.severity]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantity Affected</p>
                    <p className="font-medium">{viewingReport.quantityAffected}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className={statusStyles[viewingReport.status]}>
                      {statusLabels[viewingReport.status]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Description</p>
                  <p className="text-sm border rounded-md p-3 bg-muted/50">{viewingReport.description}</p>
                </div>
                {viewingReport.resolution && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Resolution</p>
                    <p className="text-sm border rounded-md p-3 bg-success/5">{viewingReport.resolution}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingReport(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
