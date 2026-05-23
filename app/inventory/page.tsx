"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
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

// Types
interface InventoryItem {
  id: string
  name: string
  category: string
  code: string
  totalQty: number
  availableQty: number
  condition: "excellent" | "good" | "fair" | "poor"
}

interface Category {
  id: string
  name: string
  department: string
  leader: string
  itemCount: number
}

interface ItemRequest {
  id: string
  requester: string
  requesterAvatar: string
  item: string
  quantity: number
  requestDate: string
  returnDate: string
  status: "pending" | "approved" | "rejected" | "returned"
}

// Sample Data
const inventoryItems: InventoryItem[] = [
  { id: "1", name: "Hymn Books", category: "Books", code: "BK-001", totalQty: 150, availableQty: 12, condition: "good" },
  { id: "2", name: "Communion Cups", category: "Communion", code: "CM-001", totalQty: 500, availableQty: 480, condition: "excellent" },
  { id: "3", name: "Communion Bread", category: "Communion", code: "CM-002", totalQty: 50, availableQty: 25, condition: "good" },
  { id: "4", name: "Offering Envelopes", category: "Finance", code: "FN-001", totalQty: 2000, availableQty: 1500, condition: "excellent" },
  { id: "5", name: "Folding Chairs", category: "Furniture", code: "FR-001", totalQty: 200, availableQty: 180, condition: "fair" },
  { id: "6", name: "Wireless Microphones", category: "Equipment", code: "EQ-001", totalQty: 10, availableQty: 8, condition: "excellent" },
  { id: "7", name: "Baptismal Robes", category: "Vestments", code: "VS-001", totalQty: 20, availableQty: 0, condition: "good" },
  { id: "8", name: "Bibles (NIV)", category: "Books", code: "BK-002", totalQty: 100, availableQty: 45, condition: "good" },
  { id: "9", name: "Sunday School Materials", category: "Education", code: "ED-001", totalQty: 150, availableQty: 120, condition: "excellent" },
  { id: "10", name: "First Aid Kits", category: "Safety", code: "SF-001", totalQty: 6, availableQty: 5, condition: "excellent" },
]

const categories: Category[] = [
  { id: "1", name: "Books", department: "Media", leader: "John Ochieng", itemCount: 2 },
  { id: "2", name: "Communion", department: "Worship", leader: "Mary Akinyi", itemCount: 2 },
  { id: "3", name: "Finance", department: "Finance", leader: "Peter Kamau", itemCount: 1 },
  { id: "4", name: "Furniture", department: "Admin", leader: "Grace Wanjiku", itemCount: 1 },
  { id: "5", name: "Equipment", department: "Media", leader: "John Ochieng", itemCount: 1 },
  { id: "6", name: "Vestments", department: "Worship", leader: "Mary Akinyi", itemCount: 1 },
  { id: "7", name: "Education", department: "Children Ministry", leader: "Sarah Muthoni", itemCount: 1 },
  { id: "8", name: "Safety", department: "Security", leader: "James Otieno", itemCount: 1 },
]

const itemRequests: ItemRequest[] = [
  { id: "1", requester: "Youth Fellowship", requesterAvatar: "YF", item: "Folding Chairs", quantity: 20, requestDate: "2024-03-18", returnDate: "2024-03-20", status: "pending" },
  { id: "2", requester: "Women Ministry", requesterAvatar: "WM", item: "Wireless Microphones", quantity: 2, requestDate: "2024-03-17", returnDate: "2024-03-17", status: "approved" },
  { id: "3", requester: "Children Church", requesterAvatar: "CC", item: "Sunday School Materials", quantity: 30, requestDate: "2024-03-15", returnDate: "2024-03-22", status: "approved" },
  { id: "4", requester: "Choir Ministry", requesterAvatar: "CM", item: "Hymn Books", quantity: 50, requestDate: "2024-03-14", returnDate: "2024-03-21", status: "returned" },
  { id: "5", requester: "Ushers Ministry", requesterAvatar: "UM", item: "First Aid Kits", quantity: 1, requestDate: "2024-03-12", returnDate: "2024-03-12", status: "rejected" },
]

const conditionStyles = {
  excellent: "bg-success/20 text-success border-success/30",
  good: "bg-primary/20 text-primary border-primary/30",
  fair: "bg-warning/20 text-warning border-warning/30",
  poor: "bg-destructive/20 text-destructive border-destructive/30",
}

const requestStatusStyles = {
  pending: "bg-warning/20 text-warning border-warning/30",
  approved: "bg-success/20 text-success border-success/30",
  rejected: "bg-destructive/20 text-destructive border-destructive/30",
  returned: "bg-muted text-muted-foreground border-muted",
}

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("items")
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isRequestItemDialogOpen, setIsRequestItemDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const categoryNames = [...new Set(inventoryItems.map((item) => item.category))]

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const lowStockItems = inventoryItems.filter((i) => i.availableQty < i.totalQty * 0.2)
  const outOfStockItems = inventoryItems.filter((i) => i.availableQty === 0)
  const pendingRequests = itemRequests.filter((r) => r.status === "pending")

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
                <p className="text-2xl font-bold">{inventoryItems.length}</p>
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
                <p className="text-2xl font-bold text-warning">{lowStockItems.length}</p>
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
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
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
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              {activeTab === "items" && (
                <Button onClick={() => setIsAddItemDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              )}
              {activeTab === "categories" && (
                <Button onClick={() => setIsAddCategoryDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              )}
              {activeTab === "requests" && (
                <Button onClick={() => setIsRequestItemDialogOpen(true)} className="gap-2">
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
                  {categoryNames.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card className="border shadow-sm">
              <CardContent className="p-0">
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
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.code}</TableCell>
                        <TableCell>{item.totalQty}</TableCell>
                        <TableCell>
                          <span className={item.availableQty === 0 ? "text-destructive font-semibold" : item.availableQty < item.totalQty * 0.2 ? "text-warning font-semibold" : ""}>
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
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Item
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="mt-0">
            <Card className="border shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Department</TableHead>
                      <TableHead className="font-semibold">Leader</TableHead>
                      <TableHead className="font-semibold">Items</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{category.department}</Badge>
                        </TableCell>
                        <TableCell>{category.leader}</TableCell>
                        <TableCell>{category.itemCount}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="mt-0">
            <Card className="border shadow-sm">
              <CardContent className="p-0">
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
                    {itemRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                              {request.requesterAvatar}
                            </div>
                            <span className="font-medium">{request.requester}</span>
                          </div>
                        </TableCell>
                        <TableCell>{request.item}</TableCell>
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
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-success hover:bg-success/10">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {request.status === "approved" && (
                                  <DropdownMenuItem>Mark as Returned</DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Item Dialog */}
        <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
              <DialogDescription>Add a new item to the church inventory.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); setIsAddItemDialogOpen(false); }}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="itemName">Item Name</FieldLabel>
                    <Input id="itemName" placeholder="e.g., Communion Cups" />
                  </Field>
                </FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Category</FieldLabel>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryNames.map((cat) => (
                            <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="code">Item Code</FieldLabel>
                      <Input id="code" placeholder="e.g., BK-001" />
                    </Field>
                  </FieldGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                      <Input id="quantity" type="number" placeholder="0" />
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Condition</FieldLabel>
                      <Select>
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
                <Button type="button" variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Item</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>Create a new inventory category.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); setIsAddCategoryDialogOpen(false); }}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="categoryName">Category Name</FieldLabel>
                    <Input id="categoryName" placeholder="e.g., Electronics" />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Department</FieldLabel>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="worship">Worship</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="children">Children Ministry</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="leader">Leader</FieldLabel>
                    <Input id="leader" placeholder="Category leader name" />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Request Item Dialog */}
        <Dialog open={isRequestItemDialogOpen} onOpenChange={setIsRequestItemDialogOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Request Item</DialogTitle>
              <DialogDescription>Submit a request to borrow inventory items.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); setIsRequestItemDialogOpen(false); }}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Item</FieldLabel>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.filter(i => i.availableQty > 0).map((item) => (
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
                    <Input id="reqQuantity" type="number" placeholder="0" />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="returnDate">Return Date</FieldLabel>
                    <Input id="returnDate" type="date" />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reason">Reason for Request</FieldLabel>
                    <Textarea id="reason" placeholder="Describe why you need this item..." rows={3} />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRequestItemDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
