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
import { Plus, Search, Edit, Trash2, MoreHorizontal, Boxes, Package } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Category {
  id: string
  name: string
  description: string
  department: string
  leader: string
  leaderInitials: string
  itemCount: number
  createdAt: string
}

const categories: Category[] = [
  { id: "1", name: "Books", description: "Bibles, Hymn books, and study materials", department: "Media", leader: "John Ochieng", leaderInitials: "JO", itemCount: 5, createdAt: "2024-01-15" },
  { id: "2", name: "Communion", description: "Communion cups, bread, and related supplies", department: "Worship", leader: "Mary Akinyi", leaderInitials: "MA", itemCount: 3, createdAt: "2024-01-15" },
  { id: "3", name: "Finance", description: "Offering envelopes, receipt books, etc.", department: "Finance", leader: "Peter Kamau", leaderInitials: "PK", itemCount: 4, createdAt: "2024-01-20" },
  { id: "4", name: "Furniture", description: "Chairs, tables, and other furniture", department: "Admin", leader: "Grace Wanjiku", leaderInitials: "GW", itemCount: 8, createdAt: "2024-02-01" },
  { id: "5", name: "Equipment", description: "Audio/visual equipment and electronics", department: "Media", leader: "John Ochieng", leaderInitials: "JO", itemCount: 12, createdAt: "2024-01-15" },
  { id: "6", name: "Vestments", description: "Robes, clergy attire, and ceremonial items", department: "Worship", leader: "Mary Akinyi", leaderInitials: "MA", itemCount: 6, createdAt: "2024-02-10" },
  { id: "7", name: "Education", description: "Sunday school and training materials", department: "Children Ministry", leader: "Sarah Muthoni", leaderInitials: "SM", itemCount: 15, createdAt: "2024-01-25" },
  { id: "8", name: "Safety", description: "First aid, fire extinguishers, safety equipment", department: "Security", leader: "James Otieno", leaderInitials: "JOt", itemCount: 7, createdAt: "2024-03-01" },
]

const departments = ["Media", "Worship", "Finance", "Admin", "Children Ministry", "Security", "Youth Ministry"]

export default function CategoriesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || cat.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const totalItems = categories.reduce((acc, cat) => acc + cat.itemCount, 0)

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Inventory Categories</h1>
            <p className="text-muted-foreground">Organize inventory items into categories</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Boxes className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Total Categories</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <Package className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalItems}</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Boxes className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="text-sm text-muted-foreground">Departments</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Categories Table */}
        <Card className="border shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Category Name</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Leader</TableHead>
                  <TableHead className="font-semibold">Items</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {category.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {category.leaderInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{category.leader}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {category.itemCount} items
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
                          <DropdownMenuItem>View Items</DropdownMenuItem>
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

        {/* Add Category Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>Create a new inventory category.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); setIsAddDialogOpen(false); }}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="categoryName">Category Name</FieldLabel>
                    <Input id="categoryName" placeholder="e.g., Electronics" />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea id="description" placeholder="Describe this category..." rows={3} />
                  </Field>
                </FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Department</FieldLabel>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="leader">Category Leader</FieldLabel>
                      <Input id="leader" placeholder="Leader name" />
                    </Field>
                  </FieldGroup>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
