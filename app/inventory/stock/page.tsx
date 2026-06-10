"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpDown,
  RefreshCw,
  History,
} from "lucide-react"
import { useInventoryItemsPloc, useInventoryCategoriesPloc } from "@/core/di/DependencyLocator"
import useInventoryItemsState from "@/application/inventory/useInventoryItemsState"
import useInventoryCategoriesState from "@/application/inventory/useInventoryCategoriesState"
import type { InventoryItem } from "@/domain/entities/inventory/InventoryItem"

type StockStatus = "healthy" | "low" | "critical" | "out"

function getStockStatus(item: InventoryItem): StockStatus {
  if (item.availableQty === 0) return "out"
  const ratio = item.totalQty > 0 ? item.availableQty / item.totalQty : 0
  if (ratio < 0.2) return "critical"
  if (ratio < 0.5) return "low"
  return "healthy"
}

const statusStyles: Record<StockStatus, string> = {
  healthy: "bg-success/20 text-success border-success/30",
  low: "bg-warning/20 text-warning border-warning/30",
  critical: "bg-destructive/20 text-destructive border-destructive/30",
  out: "bg-muted text-muted-foreground border-muted",
}

const statusLabels: Record<StockStatus, string> = {
  healthy: "Healthy",
  low: "Low Stock",
  critical: "Critical",
  out: "Out of Stock",
}

// Stock movements have no domain entity yet — kept as static seed data
interface StockMovement {
  id: string
  itemName: string
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  performedBy: string
  date: string
}

const SEED_MOVEMENTS: StockMovement[] = [
  { id: "1", itemName: "Communion Cups", type: "in", quantity: 200, reason: "Monthly restock", performedBy: "Admin", date: "2024-03-18" },
  { id: "2", itemName: "Hymn Books", type: "out", quantity: 50, reason: "Youth Fellowship request", performedBy: "John O.", date: "2024-03-17" },
  { id: "3", itemName: "Folding Chairs", type: "out", quantity: 20, reason: "Women Ministry event", performedBy: "Grace W.", date: "2024-03-16" },
  { id: "4", itemName: "Sunday School Materials", type: "in", quantity: 50, reason: "Quarterly supplies", performedBy: "Sarah M.", date: "2024-03-15" },
  { id: "5", itemName: "Wireless Microphones", type: "adjustment", quantity: -2, reason: "Inventory count correction", performedBy: "Admin", date: "2024-03-14" },
]

const movementTypeStyles: Record<StockMovement["type"], string> = {
  in: "bg-success/20 text-success",
  out: "bg-destructive/20 text-destructive",
  adjustment: "bg-warning/20 text-warning",
}

const EMPTY_RESTOCK_FORM = { itemId: "", quantity: 1, reason: "" }

export default function StockPage() {
  const itemsPloc = useInventoryItemsPloc()
  const categoriesPloc = useInventoryCategoriesPloc()

  const items = useInventoryItemsState((s) => s.items)
  const categories = useInventoryCategoriesState((s) => s.categories)
  const loading = useInventoryItemsState((s) => s.loading)
  const submitting = useInventoryItemsState((s) => s.submitting)

  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [restockForm, setRestockForm] = useState(EMPTY_RESTOCK_FORM)
  const [movements, setMovements] = useState<StockMovement[]>(SEED_MOVEMENTS)

  useEffect(() => {
    itemsPloc.fetchAll()
    categoriesPloc.fetchAll()
  }, [itemsPloc, categoriesPloc])

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? "—"

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    const status = getStockStatus(item)
    const matchesStatus = statusFilter === "all" || status === statusFilter
    return matchesSearch && matchesStatus
  })

  const healthyCount = items.filter((i) => getStockStatus(i) === "healthy").length
  const lowCount = items.filter((i) => getStockStatus(i) === "low").length
  const criticalCount = items.filter((i) => getStockStatus(i) === "critical").length
  const outCount = items.filter((i) => getStockStatus(i) === "out").length

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault()
    const item = items.find((i) => i.id === restockForm.itemId)
    if (!item) return
    const ok = await itemsPloc.adjustStock(restockForm.itemId, {
      adjustment: restockForm.quantity,
      reason: restockForm.reason || "Restock",
    })
    if (ok) {
      setMovements((prev) => [
        {
          id: String(Date.now()),
          itemName: item.name,
          type: "in",
          quantity: restockForm.quantity,
          reason: restockForm.reason || "Restock",
          performedBy: "Admin",
          date: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ])
      setRestockForm(EMPTY_RESTOCK_FORM)
      setIsRestockOpen(false)
    }
  }

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Stock Management</h1>
            <p className="text-muted-foreground">Monitor and manage inventory stock levels</p>
          </div>
          <Button onClick={() => { setRestockForm(EMPTY_RESTOCK_FORM); setIsRestockOpen(true) }} className="gap-2">
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
                {loading && items.length === 0 ? <Skeleton className="h-7 w-10 mb-1" /> : (
                  <p className="text-2xl font-bold text-success">{healthyCount}</p>
                )}
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
                {loading && items.length === 0 ? <Skeleton className="h-7 w-10 mb-1" /> : (
                  <p className="text-2xl font-bold text-warning">{lowCount}</p>
                )}
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
                {loading && items.length === 0 ? <Skeleton className="h-7 w-10 mb-1" /> : (
                  <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
                )}
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
                {loading && items.length === 0 ? <Skeleton className="h-7 w-10 mb-1" /> : (
                  <p className="text-2xl font-bold">{outCount}</p>
                )}
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
                {loading && items.length === 0 ? (
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
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-1">
                            Available
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">Category</TableHead>
                        <TableHead className="font-semibold">Stock Level</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No items found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item) => {
                          const stockPercentage = item.totalQty > 0 ? (item.availableQty / item.totalQty) * 100 : 0
                          const status = getStockStatus(item)
                          return (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.code}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={item.availableQty === 0 || stockPercentage < 20 ? "text-destructive font-semibold" : ""}>
                                  {item.availableQty}
                                </span>
                                <span className="text-muted-foreground"> / {item.totalQty}</span>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{getCategoryName(item.categoryId)}</Badge>
                              </TableCell>
                              <TableCell className="w-32">
                                <Progress value={stockPercentage} className="h-2" />
                              </TableCell>
                              <TableCell>
                                <Badge className={statusStyles[status]}>
                                  {statusLabels[status]}
                                </Badge>
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
                  {movements.map((movement) => (
                    <div key={movement.id} className="px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{movement.itemName}</span>
                        <Badge className={movementTypeStyles[movement.type]}>
                          {movement.type === "in" ? "+" : movement.type === "out" ? "−" : ""}
                          {Math.abs(movement.quantity)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{movement.reason}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{movement.performedBy}</span>
                        <span className="text-xs text-muted-foreground">{movement.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Restock Dialog */}
        <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Restock Item</DialogTitle>
              <DialogDescription>Add stock to an inventory item.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRestock}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Item</FieldLabel>
                    <Select
                      value={restockForm.itemId}
                      onValueChange={(v) => setRestockForm((f) => ({ ...f, itemId: v }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
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
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      placeholder="0"
                      value={restockForm.quantity}
                      onChange={(e) => setRestockForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reason">Reason</FieldLabel>
                    <Textarea
                      id="reason"
                      placeholder="e.g., Monthly restock, New purchase..."
                      rows={2}
                      value={restockForm.reason}
                      onChange={(e) => setRestockForm((f) => ({ ...f, reason: e.target.value }))}
                    />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRestockOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Restocking…" : "Restock"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
