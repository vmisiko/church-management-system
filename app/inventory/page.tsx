"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Search,
  Package,
  TrendingDown,
  Edit,
  Trash2,
  Check,
  X,
  MoreHorizontal,
  Boxes,
  ClipboardList,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useInventoryItemsPloc,
  useInventoryCategoriesPloc,
  useItemRequestsPloc,
} from "@/core/di/DependencyLocator"
import useInventoryItemsState from "@/application/inventory/useInventoryItemsState"
import useInventoryCategoriesState from "@/application/inventory/useInventoryCategoriesState"
import useItemRequestsState from "@/application/inventory/useItemRequestsState"
import type { InventoryItem, ItemCondition } from "@/domain/entities/inventory/InventoryItem"
import type { InventoryCategory } from "@/domain/entities/inventory/InventoryCategory"

const conditionStyles: Record<ItemCondition, string> = {
  excellent: "bg-success/20 text-success border-success/30",
  good: "bg-primary/20 text-primary border-primary/30",
  fair: "bg-warning/20 text-warning border-warning/30",
  poor: "bg-destructive/20 text-destructive border-destructive/30",
}

const requestStatusStyles: Record<string, string> = {
  pending: "bg-warning/20 text-warning border-warning/30",
  approved: "bg-success/20 text-success border-success/30",
  rejected: "bg-destructive/20 text-destructive border-destructive/30",
  returned: "bg-muted text-muted-foreground border-muted",
}

const EMPTY_ITEM_FORM = { name: "", code: "", categoryId: "", totalQty: 0, condition: "good" as ItemCondition }
const EMPTY_CAT_FORM = { name: "", leaderName: "" }
const EMPTY_REQ_FORM = { requester: "", itemId: "", quantity: 1, requestDate: new Date().toISOString().split("T")[0], returnDate: "", reason: "" }

export default function InventoryPage() {
  const itemsPloc = useInventoryItemsPloc()
  const categoriesPloc = useInventoryCategoriesPloc()
  const requestsPloc = useItemRequestsPloc()

  const items = useInventoryItemsState((s) => s.items)
  const categories = useInventoryCategoriesState((s) => s.categories)
  const requests = useItemRequestsState((s) => s.requests)
  const itemsLoading = useInventoryItemsState((s) => s.loading)
  const requestsLoading = useItemRequestsState((s) => s.loading)
  const itemsSubmitting = useInventoryItemsState((s) => s.submitting)
  const categoriesSubmitting = useInventoryCategoriesState((s) => s.submitting)
  const requestsSubmitting = useItemRequestsState((s) => s.submitting)

  const [activeTab, setActiveTab] = useState("items")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Dialog states
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isRequestItemOpen, setIsRequestItemOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<InventoryCategory | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<InventoryCategory | null>(null)
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null)

  // Form states
  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM)
  const [catForm, setCatForm] = useState(EMPTY_CAT_FORM)
  const [reqForm, setReqForm] = useState(EMPTY_REQ_FORM)

  useEffect(() => {
    itemsPloc.fetchAll()
    categoriesPloc.fetchAll()
    requestsPloc.fetchAll()
  }, [itemsPloc, categoriesPloc, requestsPloc])

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? "—"

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.categoryId === categoryFilter
    return matchesSearch && matchesCategory
  })

  const lowStockItems = items.filter((i) => i.availableQty < i.totalQty * 0.2)
  const pendingRequests = requests.filter((r) => r.status === "pending")

  // ── Item handlers ──────────────────────────────────────────────────────────

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await itemsPloc.create({
      name: itemForm.name,
      code: itemForm.code,
      categoryId: itemForm.categoryId,
      totalQty: itemForm.totalQty,
      condition: itemForm.condition,
    })
    if (ok) {
      setItemForm(EMPTY_ITEM_FORM)
      setIsAddItemOpen(false)
    }
  }

  const openEditItem = (item: InventoryItem) => {
    setEditingItem(item)
    setItemForm({ name: item.name, code: item.code, categoryId: item.categoryId, totalQty: item.totalQty, condition: item.condition })
  }

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return
    const ok = await itemsPloc.update(editingItem.id, {
      name: itemForm.name,
      code: itemForm.code,
      categoryId: itemForm.categoryId,
      totalQty: itemForm.totalQty,
      condition: itemForm.condition,
    })
    if (ok) {
      setEditingItem(null)
      setItemForm(EMPTY_ITEM_FORM)
    }
  }

  const handleDeleteItem = async () => {
    if (!deletingItem) return
    await itemsPloc.delete(deletingItem.id)
    setDeletingItem(null)
  }

  // ── Category handlers ──────────────────────────────────────────────────────

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await categoriesPloc.create({
      name: catForm.name,
      leaderName: catForm.leaderName || undefined,
    })
    if (ok) {
      setCatForm(EMPTY_CAT_FORM)
      setIsAddCategoryOpen(false)
    }
  }

  const openEditCategory = (cat: InventoryCategory) => {
    setEditingCategory(cat)
    setCatForm({ name: cat.name, leaderName: cat.leaderName ?? "" })
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    const ok = await categoriesPloc.update(editingCategory.id, {
      name: catForm.name,
      leaderName: catForm.leaderName || null,
    })
    if (ok) {
      setEditingCategory(null)
      setCatForm(EMPTY_CAT_FORM)
    }
  }

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return
    await categoriesPloc.delete(deletingCategory.id)
    setDeletingCategory(null)
  }

  // ── Request handlers ───────────────────────────────────────────────────────

  const handleApprove = (id: string) => requestsPloc.updateStatus(id, "approved")
  const handleReject = (id: string) => requestsPloc.updateStatus(id, "rejected")
  const handleMarkReturned = (id: string) => requestsPloc.updateStatus(id, "returned")

  const handleDeleteRequest = async () => {
    if (!deletingRequestId) return
    await requestsPloc.delete(deletingRequestId)
    setDeletingRequestId(null)
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await requestsPloc.create({
      requester: reqForm.requester,
      itemId: reqForm.itemId,
      quantity: reqForm.quantity,
      requestDate: reqForm.requestDate,
      returnDate: reqForm.returnDate,
      reason: reqForm.reason || undefined,
    })
    if (ok) {
      setReqForm(EMPTY_REQ_FORM)
      setIsRequestItemOpen(false)
    }
  }

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">Track and manage church assets and supplies</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                {itemsLoading ? (
                  <Skeleton className="h-7 w-12 mb-1" />
                ) : (
                  <p className="text-2xl font-bold">{items.length}</p>
                )}
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <Boxes className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm border-warning/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <TrendingDown className="h-6 w-6 text-warning" />
              </div>
              <div>
                {itemsLoading ? (
                  <Skeleton className="h-7 w-12 mb-1" />
                ) : (
                  <p className="text-2xl font-bold text-warning">{lowStockItems.length}</p>
                )}
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <ClipboardList className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                {requestsLoading ? (
                  <Skeleton className="h-7 w-12 mb-1" />
                ) : (
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                )}
                <p className="text-sm text-muted-foreground">Pending Requests</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              {activeTab === "items" && (
                <Button onClick={() => { setItemForm(EMPTY_ITEM_FORM); setIsAddItemOpen(true) }} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              )}
              {activeTab === "requests" && (
                <Button onClick={() => { setReqForm(EMPTY_REQ_FORM); setIsRequestItemOpen(true) }} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Request Item
                </Button>
              )}
            </div>
          </div>

          {/* Items Tab */}
          <TabsContent value="items" className="mt-0">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card className="border shadow-sm">
              <CardContent className="p-0">
                {itemsLoading && items.length === 0 ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Item Name</TableHead>
                        <TableHead className="font-semibold">Category</TableHead>
                        <TableHead className="font-semibold">Code</TableHead>
                        <TableHead className="font-semibold">Total Qty</TableHead>
                        <TableHead className="font-semibold">Available Qty</TableHead>
                        <TableHead className="font-semibold">Condition</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No items found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{getCategoryName(item.categoryId)}</Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{item.code}</TableCell>
                            <TableCell>{item.totalQty}</TableCell>
                            <TableCell>
                              <span className={
                                item.availableQty === 0
                                  ? "text-destructive font-semibold"
                                  : item.availableQty < item.totalQty * 0.2
                                  ? "text-warning font-semibold"
                                  : ""
                              }>
                                {item.availableQty}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={conditionStyles[item.condition]}>
                                {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
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
                                  <DropdownMenuItem onClick={() => openEditItem(item)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Item
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setDeletingItem(item)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="mt-0">
            <Card className="border shadow-sm">
              <CardContent className="p-0">
                {requestsLoading && requests.length === 0 ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Requester</TableHead>
                        <TableHead className="font-semibold">Item</TableHead>
                        <TableHead className="font-semibold">Quantity</TableHead>
                        <TableHead className="font-semibold">Request Date</TableHead>
                        <TableHead className="font-semibold">Return Date</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No requests yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        requests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                  {request.requesterAvatar}
                                </div>
                                <span className="font-medium">{request.requester}</span>
                              </div>
                            </TableCell>
                            <TableCell>{request.itemName}</TableCell>
                            <TableCell>{request.quantity}</TableCell>
                            <TableCell>{request.requestDate}</TableCell>
                            <TableCell>{request.returnDate}</TableCell>
                            <TableCell>
                              <Badge className={requestStatusStyles[request.status]}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {request.status === "pending" ? (
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-success hover:bg-success/10"
                                    onClick={() => handleApprove(request.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                    onClick={() => handleReject(request.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {request.status === "approved" && (
                                      <DropdownMenuItem onClick={() => handleMarkReturned(request.id)}>
                                        Mark as Returned
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => setDeletingRequestId(request.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Item Dialog */}
        <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
              <DialogDescription>Add a new item to the church inventory.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddItem}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="itemName">Item Name</FieldLabel>
                    <Input
                      id="itemName"
                      placeholder="e.g., Communion Cups"
                      value={itemForm.name}
                      onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </Field>
                </FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Category</FieldLabel>
                      <Select
                        value={itemForm.categoryId}
                        onValueChange={(v) => setItemForm((f) => ({ ...f, categoryId: v }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="code">Item Code</FieldLabel>
                      <Input
                        id="code"
                        placeholder="e.g., BK-001"
                        value={itemForm.code}
                        onChange={(e) => setItemForm((f) => ({ ...f, code: e.target.value }))}
                        required
                      />
                    </Field>
                  </FieldGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={itemForm.totalQty}
                        onChange={(e) => setItemForm((f) => ({ ...f, totalQty: Number(e.target.value) }))}
                      />
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Condition</FieldLabel>
                      <Select
                        value={itemForm.condition}
                        onValueChange={(v) => setItemForm((f) => ({ ...f, condition: v as ItemCondition }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddItemOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={itemsSubmitting}>
                  {itemsSubmitting ? "Adding…" : "Add Item"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog open={!!editingItem} onOpenChange={(open) => { if (!open) setEditingItem(null) }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>Update inventory item details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditItem}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="editItemName">Item Name</FieldLabel>
                    <Input
                      id="editItemName"
                      value={itemForm.name}
                      onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </Field>
                </FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Category</FieldLabel>
                      <Select
                        value={itemForm.categoryId}
                        onValueChange={(v) => setItemForm((f) => ({ ...f, categoryId: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="editCode">Item Code</FieldLabel>
                      <Input
                        id="editCode"
                        value={itemForm.code}
                        onChange={(e) => setItemForm((f) => ({ ...f, code: e.target.value }))}
                        required
                      />
                    </Field>
                  </FieldGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="editTotalQty">Total Quantity</FieldLabel>
                      <Input
                        id="editTotalQty"
                        type="number"
                        min={0}
                        value={itemForm.totalQty}
                        onChange={(e) => setItemForm((f) => ({ ...f, totalQty: Number(e.target.value) }))}
                        required
                      />
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Condition</FieldLabel>
                      <Select
                        value={itemForm.condition}
                        onValueChange={(v) => setItemForm((f) => ({ ...f, condition: v as ItemCondition }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                <Button type="submit" disabled={itemsSubmitting}>
                  {itemsSubmitting ? "Saving…" : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>Create a new inventory category.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategory}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="categoryName">Category Name</FieldLabel>
                    <Input
                      id="categoryName"
                      placeholder="e.g., Electronics"
                      value={catForm.name}
                      onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="leaderName">Leader</FieldLabel>
                    <Input
                      id="leaderName"
                      placeholder="Category leader name"
                      value={catForm.leaderName}
                      onChange={(e) => setCatForm((f) => ({ ...f, leaderName: e.target.value }))}
                    />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={categoriesSubmitting}>
                  {categoriesSubmitting ? "Adding…" : "Add Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={!!editingCategory} onOpenChange={(open) => { if (!open) setEditingCategory(null) }}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update category details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditCategory}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="editCategoryName">Category Name</FieldLabel>
                    <Input
                      id="editCategoryName"
                      value={catForm.name}
                      onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="editLeaderName">Leader</FieldLabel>
                    <Input
                      id="editLeaderName"
                      value={catForm.leaderName}
                      onChange={(e) => setCatForm((f) => ({ ...f, leaderName: e.target.value }))}
                    />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button>
                <Button type="submit" disabled={categoriesSubmitting}>
                  {categoriesSubmitting ? "Saving…" : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Request Item Dialog */}
        <Dialog open={isRequestItemOpen} onOpenChange={setIsRequestItemOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Request Item</DialogTitle>
              <DialogDescription>Submit a request to borrow inventory items.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitRequest}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="requester">Your Name / Ministry</FieldLabel>
                    <Input
                      id="requester"
                      placeholder="e.g., Youth Fellowship"
                      value={reqForm.requester}
                      onChange={(e) => setReqForm((f) => ({ ...f, requester: e.target.value }))}
                      required
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Item</FieldLabel>
                    <Select
                      value={reqForm.itemId}
                      onValueChange={(v) => setReqForm((f) => ({ ...f, itemId: v }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.filter((i) => i.availableQty > 0).map((item) => (
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
                    <FieldLabel htmlFor="reqQuantity">Quantity</FieldLabel>
                    <Input
                      id="reqQuantity"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={reqForm.quantity}
                      onChange={(e) => setReqForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="requestDate">Request Date</FieldLabel>
                    <Input
                      id="requestDate"
                      type="date"
                      value={reqForm.requestDate}
                      onChange={(e) => setReqForm((f) => ({ ...f, requestDate: e.target.value }))}
                      required
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="returnDate">Return Date</FieldLabel>
                    <Input
                      id="returnDate"
                      type="date"
                      value={reqForm.returnDate}
                      onChange={(e) => setReqForm((f) => ({ ...f, returnDate: e.target.value }))}
                      required
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reason">Reason for Request</FieldLabel>
                    <Textarea
                      id="reason"
                      placeholder="Describe why you need this item..."
                      rows={3}
                      value={reqForm.reason}
                      onChange={(e) => setReqForm((f) => ({ ...f, reason: e.target.value }))}
                    />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRequestItemOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={requestsSubmitting}>
                  {requestsSubmitting ? "Submitting…" : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Item Confirmation */}
        <AlertDialog open={!!deletingItem} onOpenChange={(open) => { if (!open) setDeletingItem(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Item</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{deletingItem?.name}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDeleteItem}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Category Confirmation */}
        <AlertDialog open={!!deletingCategory} onOpenChange={(open) => { if (!open) setDeletingCategory(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{deletingCategory?.name}</strong>? Items in this category will be unassigned.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDeleteCategory}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Request Confirmation */}
        <AlertDialog open={!!deletingRequestId} onOpenChange={(open) => { if (!open) setDeletingRequestId(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Request</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this request? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDeleteRequest}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  )
}
