"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Plus,
  Music,
  Video,
  Users,
  Heart,
  Baby,
  Sparkles,
  Shield,
  BookOpen,
  MoreVertical,
  TrendingUp,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const departments = [
  {
    id: "1",
    name: "Choir",
    icon: Music,
    head: "Sister Florence Adekunle",
    members: 45,
    target: 60,
    budget: 250000,
    spent: 180000,
    description: "Leading worship through music and song",
    color: "bg-primary",
  },
  {
    id: "2",
    name: "Media",
    icon: Video,
    head: "Brother Michael Okafor",
    members: 28,
    target: 35,
    budget: 500000,
    spent: 420000,
    description: "Audio-visual and digital communications",
    color: "bg-accent",
  },
  {
    id: "3",
    name: "Ushers",
    icon: Shield,
    head: "Deacon Paul Nnamdi",
    members: 52,
    target: 50,
    budget: 150000,
    spent: 95000,
    description: "Welcoming and seating congregation members",
    color: "bg-chart-3",
  },
  {
    id: "4",
    name: "Children",
    icon: Baby,
    head: "Sister Grace Umeh",
    members: 18,
    target: 25,
    budget: 200000,
    spent: 165000,
    description: "Sunday school and children ministry",
    color: "bg-chart-4",
  },
  {
    id: "5",
    name: "Youth",
    icon: Sparkles,
    head: "Pastor David Chukwu",
    members: 85,
    target: 100,
    budget: 350000,
    spent: 280000,
    description: "Engaging and nurturing young adults",
    color: "bg-chart-5",
  },
  {
    id: "6",
    name: "Welfare",
    icon: Heart,
    head: "Deaconess Mary Obi",
    members: 24,
    target: 30,
    budget: 400000,
    spent: 375000,
    description: "Supporting members in need",
    color: "bg-success",
  },
  {
    id: "7",
    name: "Protocol",
    icon: Users,
    head: "Elder James Eze",
    members: 32,
    target: 40,
    budget: 180000,
    spent: 120000,
    description: "VIP reception and special events coordination",
    color: "bg-primary",
  },
  {
    id: "8",
    name: "Bible Study",
    icon: BookOpen,
    head: "Pastor Ruth Adewale",
    members: 156,
    target: 200,
    budget: 100000,
    spent: 45000,
    description: "Facilitating in-depth scripture study",
    color: "bg-accent",
  },
]

export default function DepartmentsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const totalMembers = departments.reduce((acc, d) => acc + d.members, 0)
  const totalBudget = departments.reduce((acc, d) => acc + d.budget, 0)
  const totalSpent = departments.reduce((acc, d) => acc + d.spent, 0)

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Departments</h1>
            <p className="text-muted-foreground">
              Manage church departments and ministry units
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
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
              <p className="text-2xl font-bold text-accent-foreground">{totalMembers}</p>
              <p className="text-sm text-muted-foreground">Active Workers</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-success">
                {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(totalBudget)}
              </p>
              <p className="text-sm text-muted-foreground">Total Budget</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">
                {Math.round((totalSpent / totalBudget) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Budget Utilized</p>
            </CardContent>
          </Card>
        </div>

        {/* Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const Icon = dept.icon
            const memberProgress = (dept.members / dept.target) * 100
            const budgetProgress = (dept.spent / dept.budget) * 100

            return (
              <Card key={dept.id} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${dept.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{dept.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {dept.members} workers
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Department</DropdownMenuItem>
                        <DropdownMenuItem>View Members</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <p className="text-xs text-muted-foreground line-clamp-2">{dept.description}</p>
                  
                  {/* Member Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Member Target</span>
                      <span className="font-medium">{dept.members}/{dept.target}</span>
                    </div>
                    <Progress value={memberProgress} className="h-1.5" />
                  </div>

                  {/* Budget Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Budget Used</span>
                      <span className="font-medium">{Math.round(budgetProgress)}%</span>
                    </div>
                    <Progress value={budgetProgress} className="h-1.5" />
                  </div>

                  {/* Department Head */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-secondary">
                        {dept.head.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate">{dept.head}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Add Department Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>
                Create a new ministry department for your church.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); setIsAddDialogOpen(false); }}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Department Name</FieldLabel>
                    <Input id="name" placeholder="e.g., Evangelism" />
                  </Field>
                </FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="head">Department Head</FieldLabel>
                      <Input id="head" placeholder="Leader name" />
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="target">Member Target</FieldLabel>
                      <Input id="target" type="number" placeholder="50" />
                    </Field>
                  </FieldGroup>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="budget">Annual Budget (NGN)</FieldLabel>
                    <Input id="budget" type="number" placeholder="250000" />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the department's purpose..."
                      rows={3}
                    />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Department</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
