"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  FileWarning,
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

interface DamageReport {
  id: string
  itemName: string
  itemCode: string
  reportedBy: string
  reporterInitials: string
  damageType: "broken" | "lost" | "stolen" | "wear" | "other"
  severity: "minor" | "moderate" | "severe" | "total-loss"
  quantity: number
  description: string
  reportDate: string
  status: "pending" | "investigating" | "resolved" | "written-off"
  resolution?: string
}

const damageReports: DamageReport[] = [
  {
    id: "1",
    itemName: "Wireless Microphone",
    itemCode: "EQ-001",
    reportedBy: "John Ochieng",
    reporterInitials: "JO",
    damageType: "broken",
    severity: "moderate",
    quantity: 1,
    description: "Microphone stopped working during Sunday service. No audio output.",
    reportDate: "2024-03-18",
    status: "investigating",
  },
  {
    id: "2",
    itemName: "Folding Chair",
    itemCode: "FR-001",
    reportedBy: "Grace Wanjiku",
    reporterInitials: "GW",
    damageType: "broken",
    severity: "severe",
    quantity: 3,
    description: "Chairs collapsed during youth event. Legs are bent beyond repair.",
    reportDate: "2024-03-15",
    status: "resolved",
    resolution: "Written off and removed from inventory. Replacement ordered.",
  },
  {
    id: "3",
    itemName: "Hymn Books",
    itemCode: "BK-001",
    reportedBy: "Mary Akinyi",
    reporterInitials: "MA",
    damageType: "wear",
    severity: "moderate",
    quantity: 15,
    description: "Pages falling out, covers worn. Normal wear and tear over years of use.",
    reportDate: "2024-03-10",
    status: "pending",
  },
  {
    id: "4",
    itemName: "Projector Screen",
    itemCode: "EQ-005",
    reportedBy: "Peter Kamau",
    reporterInitials: "PK",
    damageType: "other",
    severity: "minor",
    quantity: 1,
    description: "Small tear on the left side of the screen. Still usable but visible.",
    reportDate: "2024-03-08",
    status: "resolved",
    resolution: "Repaired with screen patch kit.",
  },
  {
    id: "5",
    itemName: "Communion Tray",
    itemCode: "CM-003",
    reportedBy: "Sarah Muthoni",
    reporterInitials: "SM",
    damageType: "lost",
    severity: "total-loss",
    quantity: 2,
    description: "Cannot locate 2 communion trays after Easter service.",
    reportDate: "2024-03-05",
    status: "investigating",
  },
  {
    id: "6",
    itemName: "Keyboard Stand",
    itemCode: "EQ-008",
    reportedBy: "James Otieno",
    reporterInitials: "JOt",
    damageType: "broken",
    severity: "severe",
    quantity: 1,
    description: "Stand collapsed while setting up for worship. One leg completely broken.",
    reportDate: "2024-02-28",
    status: "written-off",
    resolution: "Item removed from inventory. New stand purchased.",
  },
]

const inventoryItems = [
  { id: "1", name: "Wireless Microphone", code: "EQ-001" },
  { id: "2", name: "Folding Chair", code: "FR-001" },
  { id: "3", name: "Hymn Books", code: "BK-001" },
  { id: "4", name: "Projector", code: "EQ-004" },
  { id: "5", name: "Communion Cups", code: "CM-001" },
]

const damageTypeLabels = {
  broken: "Broken",
  lost: "Lost",
  stolen: "Stolen",
  wear: "Wear & Tear",
  other: "Other",
}

const severityStyles = {
  minor: "bg-success/20 text-success border-success/30",
  moderate: "bg-warning/20 text-warning border-warning/30",
  severe: "bg-destructive/20 text-destructive border-destructive/30",
  "total-loss": "bg-muted text-muted-foreground border-muted",
}

const statusStyles = {
  pending: "bg-warning/20 text-warning",
  investigating: "bg-primary/20 text-primary",
  resolved: "bg-success/20 text-success",
  "written-off": "bg-muted text-muted-foreground",
}

const statusIcons = {
  pending: Clock,
  investigating: AlertTriangle,
  resolved: CheckCircle,
  "written-off": XCircle,
}

export default function DamageReportsPage() {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredReports = damageReports.filter((report) => {
    const matchesSearch = report.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = damageReports.filter(r => r.status === "pending").length
  const investigatingCount = damageReports.filter(r => r.status === "investigating").length
  const resolvedCount = damageReports.filter(r => r.status === "resolved").length
  const writtenOffCount = damageReports.filter(r => r.status === "written-off").length

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Damage Reports</h1>
            <p className="text-muted-foreground">Track and manage damaged, lost, or broken inventory items</p>
          </div>
          <Button onClick={() => setIsReportDialogOpen(true)} className="gap-2">
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
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
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
                <p className="text-2xl font-bold text-primary">{investigatingCount}</p>
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
                <p className="text-2xl font-bold text-success">{resolvedCount}</p>
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
                <p className="text-2xl font-bold">{writtenOffCount}</p>
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
              <SelectItem value="written-off">Written Off</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reports Table */}
        <Card className="border shadow-sm">
          <CardContent className="p-0">
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
                {filteredReports.map((report) => {
                  const StatusIcon = statusIcons[report.status]
                  return (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.itemName}</p>
                          <p className="text-xs text-muted-foreground">{report.itemCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {report.reporterInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{report.reportedBy}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{damageTypeLabels[report.damageType]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={severityStyles[report.severity]}>
                          {report.severity.charAt(0).toUpperCase() + report.severity.slice(1).replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.quantity}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {report.reportDate}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusStyles[report.status]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace("-", " ")}
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
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {report.status === "pending" && (
                              <DropdownMenuItem>Start Investigation</DropdownMenuItem>
                            )}
                            {report.status === "investigating" && (
                              <>
                                <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                                <DropdownMenuItem>Write Off</DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Report Damage Dialog */}
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Report Damage</DialogTitle>
              <DialogDescription>Report a damaged, lost, or broken inventory item.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); setIsReportDialogOpen(false); }}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Item</FieldLabel>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} ({item.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Damage Type</FieldLabel>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
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
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minor">Minor</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                          <SelectItem value="total-loss">Total Loss</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="damageQty">Quantity Affected</FieldLabel>
                    <Input id="damageQty" type="number" placeholder="1" min="1" />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea 
                      id="description" 
                      placeholder="Describe what happened and the extent of the damage..." 
                      rows={4} 
                    />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsReportDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Submit Report</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
