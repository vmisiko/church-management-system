"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { AddDepartmentDialog } from "@/components/departments/add-department-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Plus, MoreVertical, Users } from "lucide-react"
import { useDepartmentsPloc, useMembersPloc } from "@/core/di/DependencyLocator"
import useDepartmentsState from "@/application/department/useDepartmentsState"
import useMembersState from "@/application/member/useMembersState"
import type { Department } from "@/domain/entities/department/Department"

const fmt = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 })

const CARD_COLORS = [
  "bg-primary", "bg-accent", "bg-chart-3", "bg-chart-4",
  "bg-chart-5", "bg-success", "bg-primary", "bg-accent",
]

export default function DepartmentsPage() {
  const ploc = useDepartmentsPloc()
  const membersPloc = useMembersPloc()

  const departments = useDepartmentsState((s) => Array.isArray(s.departments) ? s.departments : [])
  const loading = useDepartmentsState((s) => s.loading)
  const members = useMembersState((s) => Array.isArray(s.members) ? s.members : [])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [deletingDept, setDeletingDept] = useState<Department | null>(null)

  useEffect(() => {
    ploc.fetchAll()
    membersPloc.fetchAll()
  }, [ploc, membersPloc])

  const memberMap = Object.fromEntries(members.map((m) => [m.id, `${m.firstName} ${m.lastName}`]))

  const totalBudget = departments.reduce((acc, d) => acc + (d.annualBudget ?? 0), 0)
  const totalSpent = departments.reduce((acc, d) => acc + (d.budgetSpent ?? 0), 0)

  const handleDelete = async () => {
    if (!deletingDept) return
    await ploc.delete(deletingDept.id)
    setDeletingDept(null)
  }

  if (loading && departments.length === 0) {
    return (
      <AppShell>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Departments</h1>
            <p className="text-muted-foreground">Manage church departments and ministry units</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-primary">{departments.length}</p>
              <p className="text-sm text-muted-foreground">Total Departments</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-accent-foreground">
                {departments.reduce((acc, d) => acc + (d.memberTarget ?? 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Member Target</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-success">{totalBudget > 0 ? fmt.format(totalBudget) : "—"}</p>
              <p className="text-sm text-muted-foreground">Total Budget</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">
                {totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}%` : "—"}
              </p>
              <p className="text-sm text-muted-foreground">Budget Utilized</p>
            </CardContent>
          </Card>
        </div>

        {/* Cards */}
        {departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-2">
            <Users className="h-10 w-10 opacity-30" />
            <p className="text-sm">No departments yet. Add your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {departments.map((dept, idx) => {
              const color = CARD_COLORS[idx % CARD_COLORS.length]
              const memberProgress = dept.memberTarget
                ? Math.min(100, Math.round(((dept.memberTarget ?? 0) / dept.memberTarget) * 100))
                : 0
              const budgetProgress = dept.annualBudget
                ? Math.min(100, Math.round(((dept.budgetSpent ?? 0) / dept.annualBudget) * 100))
                : 0
              const headName = dept.headId ? memberMap[dept.headId] : null

              return (
                <Card key={dept.id} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white shrink-0`}>
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-base truncate">{dept.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs mt-1">
                            Target: {dept.memberTarget ?? "—"}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingDept(dept)}>
                            Edit Department
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeletingDept(dept)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    {dept.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{dept.description}</p>
                    )}

                    {dept.memberTarget ? (
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Member Target</span>
                          <span className="font-medium">{dept.memberTarget}</span>
                        </div>
                        <Progress value={memberProgress} className="h-1.5" />
                      </div>
                    ) : null}

                    {dept.annualBudget ? (
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Budget Used</span>
                          <span className="font-medium">{budgetProgress}%</span>
                        </div>
                        <Progress value={budgetProgress} className="h-1.5" />
                      </div>
                    ) : null}

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarFallback className="text-xs bg-secondary">
                          {headName ? headName.split(" ").map((n) => n[0]).join("").slice(0, 2) : "—"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground truncate">
                        {headName ?? "No head assigned"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Dialogs */}
        <AddDepartmentDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
        {editingDept && (
          <AddDepartmentDialog
            open={true}
            onOpenChange={(open) => !open && setEditingDept(null)}
            department={editingDept}
          />
        )}

        <AlertDialog open={Boolean(deletingDept)} onOpenChange={(open) => !open && setDeletingDept(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {deletingDept?.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All members assigned to this department will be unaffected but the department will be removed permanently.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  )
}
