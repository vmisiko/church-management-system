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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, MoreHorizontal, Boxes, Package } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ChevronsUpDown, Check } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  useInventoryCategoriesPloc,
  useInventoryItemsPloc,
  useMembersPloc,
} from "@/core/di/DependencyLocator"
import useInventoryCategoriesState from "@/application/inventory/useInventoryCategoriesState"
import useInventoryItemsState from "@/application/inventory/useInventoryItemsState"
import useMembersState from "@/application/member/useMembersState"
import type { InventoryCategory } from "@/domain/entities/inventory/InventoryCategory"

function getInitials(name: string | null): string {
  if (!name) return "?"
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

const EMPTY_FORM = { name: "", leaderId: "", description: "" }

export default function CategoriesPage() {
  const categoriesPloc = useInventoryCategoriesPloc()
  const itemsPloc = useInventoryItemsPloc()
  const membersPloc = useMembersPloc()

  const categories = useInventoryCategoriesState((s) => s.categories)
  const loading = useInventoryCategoriesState((s) => s.loading)
  const submitting = useInventoryCategoriesState((s) => s.submitting)
  const items = useInventoryItemsState((s) => s.items)
  const members = useMembersState((s) => s.members)

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<InventoryCategory | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<InventoryCategory | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [leaderPopoverOpen, setLeaderPopoverOpen] = useState(false)

  useEffect(() => {
    categoriesPloc.fetchAll()
    itemsPloc.fetchAll()
    membersPloc.fetchAll()
  }, [categoriesPloc, itemsPloc, membersPloc])

  const getMemberName = (id: string | null) => {
    if (!id) return null
    const m = members.find((m) => m.id === id)
    return m ? `${m.firstName} ${m.lastName}` : null
  }

  const filteredCategories = categories.filter((cat) => {
    const leaderName = getMemberName(cat.leaderId) ?? ""
    return (
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leaderName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const totalItems = items.length

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await categoriesPloc.create({
      name: form.name,
      leaderId: form.leaderId || null,
    })
    if (ok) {
      setForm(EMPTY_FORM)
      setIsAddOpen(false)
    }
  }

  const openEdit = (cat: InventoryCategory) => {
    setEditingCategory(cat)
    setForm({ name: cat.name, leaderId: cat.leaderId ?? "", description: "" })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    const ok = await categoriesPloc.update(editingCategory.id, {
      name: form.name,
      leaderId: form.leaderId || null,
    })
    if (ok) {
      setEditingCategory(null)
      setForm(EMPTY_FORM)
    }
  }

  const handleDelete = async () => {
    if (!deletingCategory) return
    await categoriesPloc.delete(deletingCategory.id)
    setDeletingCategory(null)
  }

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Inventory Categories</h1>
            <p className="text-muted-foreground">Organize inventory items into categories</p>
          </div>
          <Button onClick={() => { setForm(EMPTY_FORM); setIsAddOpen(true) }} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Boxes className="h-6 w-6 text-primary" />
              </div>
              <div>
                {loading && categories.length === 0 ? (
                  <Skeleton className="h-7 w-12 mb-1" />
                ) : (
                  <p className="text-2xl font-bold">{categories.length}</p>
                )}
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
        </div>

        {/* Search */}
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
        </div>

        {/* Categories Table */}
        <Card className="border shadow-sm">
          <CardContent className="p-0">
            {loading && categories.length === 0 ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Category Name</TableHead>
                    <TableHead className="font-semibold">Leader</TableHead>
                    <TableHead className="font-semibold">Items</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => {
                      const itemCount = items.filter((i) => i.categoryId === category.id).length
                      return (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>
                            {(() => {
                              const name = getMemberName(category.leaderId)
                              return name ? (
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-7 w-7">
                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                      {getInitials(name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{name}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">—</span>
                              )
                            })()}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              {itemCount} items
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
                                <DropdownMenuItem onClick={() => openEdit(category)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Category
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => setDeletingCategory(category)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
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

        {/* Add Category Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>Create a new inventory category.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="categoryName">Category Name</FieldLabel>
                    <Input
                      id="categoryName"
                      placeholder="e.g., Electronics"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      id="description"
                      placeholder="Describe this category..."
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Category Leader</FieldLabel>
                    <Popover open={leaderPopoverOpen} onOpenChange={setLeaderPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                          {form.leaderId
                            ? (() => { const m = members.find((m) => m.id === form.leaderId); return m ? `${m.firstName} ${m.lastName}` : "Select a member" })()
                            : "Select a member"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search members..." />
                          <CommandList>
                            <CommandEmpty>No member found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem value="none" onSelect={() => { setForm((f) => ({ ...f, leaderId: "" })); setLeaderPopoverOpen(false) }}>
                                <Check className={cn("mr-2 h-4 w-4", !form.leaderId ? "opacity-100" : "opacity-0")} />
                                No leader
                              </CommandItem>
                              {members.map((m) => (
                                <CommandItem
                                  key={m.id}
                                  value={`${m.firstName} ${m.lastName}`}
                                  onSelect={() => { setForm((f) => ({ ...f, leaderId: m.id })); setLeaderPopoverOpen(false) }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", form.leaderId === m.id ? "opacity-100" : "opacity-0")} />
                                  {m.firstName} {m.lastName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Adding…" : "Add Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={!!editingCategory} onOpenChange={(open) => { if (!open) setEditingCategory(null) }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update category details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEdit}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="editCategoryName">Category Name</FieldLabel>
                    <Input
                      id="editCategoryName"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Category Leader</FieldLabel>
                    <Popover open={leaderPopoverOpen} onOpenChange={setLeaderPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                          {form.leaderId
                            ? (() => { const m = members.find((m) => m.id === form.leaderId); return m ? `${m.firstName} ${m.lastName}` : "Select a member" })()
                            : "Select a member"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search members..." />
                          <CommandList>
                            <CommandEmpty>No member found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem value="none" onSelect={() => { setForm((f) => ({ ...f, leaderId: "" })); setLeaderPopoverOpen(false) }}>
                                <Check className={cn("mr-2 h-4 w-4", !form.leaderId ? "opacity-100" : "opacity-0")} />
                                No leader
                              </CommandItem>
                              {members.map((m) => (
                                <CommandItem
                                  key={m.id}
                                  value={`${m.firstName} ${m.lastName}`}
                                  onSelect={() => { setForm((f) => ({ ...f, leaderId: m.id })); setLeaderPopoverOpen(false) }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", form.leaderId === m.id ? "opacity-100" : "opacity-0")} />
                                  {m.firstName} {m.lastName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving…" : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
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
                onClick={handleDelete}
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
