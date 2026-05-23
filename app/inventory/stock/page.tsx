"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Search,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpDown,
  RefreshCw,
  History,
} from "lucide-react"

interface StockItem {
  id: string
  name: string
  category: string
  code: string
  totalQty: number
  availableQty: number
  reservedQty: number
  minStock: number
  lastRestocked: string
  status: "healthy" | "low" | "critical" | "out"
}

interface StockMovement {
  id: string
  itemName: string
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  performedBy: string
  date: string
}

const stockItems: StockItem[] = [
  { id: "1", name: "Hymn Books", category: "Books", code: "BK-001", totalQty: 150, availableQty: 12, reservedQty: 50, minStock: 30, lastRestocked: "2024-02-15", status: "critical" },
  { id: "2", name: "Communion Cups", category: "Communion", code: "CM-001", totalQty: 500, availableQty: 480, reservedQty: 0, minStock: 100, lastRestocked: "2024-03-10", status: "healthy" },
  { id: "3", name: "Offering Envelopes", category: "Finance", code: "FN-001", totalQty: 2000, availableQty: 1500, reservedQty: 200, minStock: 500, lastRestocked: "2024-03-01", status: "healthy" },
  { id: "4", name: "Folding Chairs", category: "Furniture", code: "FR-001", totalQty: 200, availableQty: 160, reservedQty: 20, minStock: 50, lastRestocked: "2024-01-20", status: "healthy" },
  { id: "5", name: "Wireless Microphones", category: "Equipment", code: "EQ-001", totalQty: 10, availableQty: 6, reservedQty: 2, minStock: 4, lastRestocked: "2024-02-28", status: "low" },
  { id: "6", name: "Baptismal Robes", category: "Vestments", code: "VS-001", totalQty: 20, availableQty: 0, reservedQty: 0, minStock: 5, lastRestocked: "2023-12-15", status: "out" },
  { id: "7", name: "Bibles (NIV)", category: "Books", code: "BK-002", totalQty: 100, availableQty: 35, reservedQty: 10, minStock: 25, lastRestocked: "2024-03-05", status: "low" },
  { id: "8", name: "Sunday School Materials", category: "Education", code: "ED-001", totalQty: 150, availableQty: 120, reservedQty: 30, minStock: 40, lastRestocked: "2024-03-12", status: "healthy" },
]

const stockMovements: StockMovement[] = [
  { id: "1", itemName: "Communion Cups", type: "in", quantity: 200, reason: "Monthly restock", performedBy: "Admin", date: "2024-03-18" },
  { id: "2", itemName: "Hymn Books", type: "out", quantity: 50, reason: "Youth Fellowship request", performedBy: "John O.", date: "2024-03-17" },
  { id: "3", itemName: "Folding Chairs", type: "out", quantity: 20, reason: "Women Ministry event", performedBy: "Grace W.", date: "2024-03-16" },
  { id: "4", itemName: "Sunday School Materials", type: "in", quantity: 50, reason: "Quarterly supplies", performedBy: "Sarah M.", date: "2024-03-15" },
  { id: "5", itemName: "Wireless Microphones", type: "adjustment", quantity: -2, reason: "Inventory count correction", performedBy: "Admin", date: "2024-03-14" },
]

const statusStyles = {
  healthy: "bg-success/20 text-success border-success/30",
  low: "bg-warning/20 text-warning border-warning/30",
  critical: "bg-destructive/20 text-destructive border-destructive/30",
  out: "bg-muted text-muted-foreground border-muted",
}

const statusLabels = {
  healthy: "Healthy",
  low: "Low Stock",
  critical: "Critical",
  out: "Out of Stock",
}

const movementTypeStyles = {
  in: "bg-success/20 text-success",
  out: "bg-destructive/20 text-destructive",
  adjustment: "bg-warning/20 text-warning",
}

export default function StockPage() {
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const healthyCount = stockItems.filter(i => i.status === "healthy").length
  const lowCount = stockItems.filter(i => i.status === "low").length
  const criticalCount = stockItems.filter(i => i.status === "critical").length
  const outCount = stockItems.filter(i => i.status === "out").length

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Stock Management</h1>
            <p className="text-muted-foreground">Monitor and manage inventory stock levels</p>
          </div>
          <Button onClick={() => setIsRestockDialogOpen(true)} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Restock Item
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{healthyCount}</p>
                <p className="text-sm text-muted-foreground">Healthy</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <TrendingDown className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{lowCount}</p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{outCount}</p>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stock Levels Table */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="border shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Item</TableHead>
                      <TableHead className="font-semibold">
                        <div className="flex items-center gap-1">
                          Available
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">Reserved</TableHead>
                      <TableHead className="font-semibold">Stock Level</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => {
                      const stockPercentage = (item.availableQty / item.totalQty) * 100
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.code}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={item.availableQty <= item.minStock ? "text-destructive font-semibold" : ""}>
                              {item.availableQty}
                            </span>
                            <span className="text-muted-foreground"> / {item.totalQty}</span>
                          </TableCell>
                          <TableCell>{item.reservedQty}</TableCell>
                          <TableCell className="w-32">
                            <Progress 
                              value={stockPercentage} 
                              className="h-2"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge className={statusStyles[item.status]}>
                              {statusLabels[item.status]}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Recent Stock Movements */}
          <div>
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Recent Stock Movements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {stockMovements.map((movement) => (
                    <div key={movement.id} className="px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{movement.itemName}</span>
                        <Badge className={movementTypeStyles[movement.type]}>
                          {movement.type === "in" ? "+" : movement.type === "out" ? "-" : ""}
                          {Math.abs(movement.quantity)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{movement.reason}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{movement.performedBy}</span>
                        <span className="text-xs text-muted-foreground">
                          {movement.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Restock Dialog */}
        <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Restock Item</DialogTitle>
              <DialogDescription>Add stock to an inventory item.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); setIsRestockDialogOpen(false); }}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Item</FieldLabel>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {stockItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} ({item.availableQty} available)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="quantity">Quantity to Add</FieldLabel>
                    <Input id="quantity" type="number" placeholder="0" min="1" />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reason">Reason</FieldLabel>
                    <Textarea id="reason" placeholder="e.g., Monthly restock, New purchase..." rows={2} />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRestockDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Restock</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
