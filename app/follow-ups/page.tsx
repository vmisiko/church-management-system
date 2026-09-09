"use client"

import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, ClipboardList, Plus, RotateCcw } from "lucide-react"
import { useFollowUpsPloc, useMembersPloc } from "@/core/di/DependencyLocator"
import useFollowUpsState from "@/application/follow-up/useFollowUpsState"
import useMembersState from "@/application/member/useMembersState"
import type { FollowUpStatus } from "@/domain/entities/follow-up/FollowUp"

const emptyTask = { memberId: "", title: "", notes: "", dueDate: new Date().toISOString().slice(0, 10) }

export default function FollowUpsPage() {
  const followUpsPloc = useFollowUpsPloc()
  const membersPloc = useMembersPloc()
  const tasks = useFollowUpsState((state) => state.tasks)
  const loading = useFollowUpsState((state) => state.loading)
  const members = useMembersState((state) => state.members)
  const [statusFilter, setStatusFilter] = useState<FollowUpStatus | "all">("open")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [taskForm, setTaskForm] = useState(emptyTask)
  useEffect(() => { void followUpsPloc.fetchAll(); void membersPloc.fetchAll({ page: 1, limit: 100 }) }, [followUpsPloc, membersPloc])
  const visibleTasks = useMemo(() => statusFilter === "all" ? tasks : tasks.filter((task) => task.status === statusFilter), [statusFilter, tasks])
  const memberName = (id: string) => { const member = members.find((item) => item.id === id); return member ? `${member.firstName} ${member.lastName}` : "Unknown member" }
  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const created = await followUpsPloc.create(taskForm)
    if (created) {
      setTaskForm(emptyTask)
      setIsCreateOpen(false)
    }
  }

  return <AppShell><div className="p-6 space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Visitor Follow-up</h1><p className="text-muted-foreground">Own the next action for every visitor and member who needs care.</p></div><Button className="gap-2" onClick={() => setIsCreateOpen(true)}><Plus className="h-4 w-4" />New Follow-up</Button></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><Card><CardContent className="p-4 flex items-center gap-3"><ClipboardList className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{tasks.filter((task) => task.status === "open").length}</p><p className="text-sm text-muted-foreground">Open tasks</p></div></CardContent></Card><Card><CardContent className="p-4 flex items-center gap-3"><RotateCcw className="h-8 w-8 text-warning" /><div><p className="text-2xl font-bold">{tasks.filter((task) => task.status === "open" && task.dueDate < new Date().toISOString().slice(0, 10)).length}</p><p className="text-sm text-muted-foreground">Overdue</p></div></CardContent></Card><Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle2 className="h-8 w-8 text-success" /><div><p className="text-2xl font-bold">{tasks.filter((task) => task.status === "completed").length}</p><p className="text-sm text-muted-foreground">Completed</p></div></CardContent></Card></div><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Task queue</h2><Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FollowUpStatus | "all")}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem><SelectItem value="all">All tasks</SelectItem></SelectContent></Select></div><Card><CardHeader><CardTitle>Follow-up tasks</CardTitle></CardHeader><CardContent className="space-y-3">{loading && tasks.length === 0 && Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-20 w-full" />)}{!loading && visibleTasks.length === 0 && <p className="py-8 text-center text-muted-foreground">No tasks in this queue.</p>}{visibleTasks.map((task) => <div key={task.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><p className="font-semibold">{task.title}</p><Badge>{task.status}</Badge></div><p className="text-sm text-muted-foreground">{memberName(task.memberId)} · Due {task.dueDate}</p>{task.notes && <p className="mt-1 text-sm">{task.notes}</p>}</div><div className="flex gap-2">{task.status === "open" && <Button size="sm" onClick={() => void followUpsPloc.update(task.id, { status: "completed" })}>Complete</Button>}</div></div>)}</CardContent></Card><Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}><DialogContent><DialogHeader><DialogTitle>New follow-up task</DialogTitle><DialogDescription>Create an accountable next action.</DialogDescription></DialogHeader><form onSubmit={handleCreate}><div className="grid gap-4 py-4"><FieldGroup><Field><FieldLabel>Member or visitor</FieldLabel><Select value={taskForm.memberId} onValueChange={(value) => setTaskForm((form) => ({ ...form, memberId: value }))} required><SelectTrigger><SelectValue placeholder="Select a person" /></SelectTrigger><SelectContent>{members.map((member) => <SelectItem key={member.id} value={member.id}>{member.firstName} {member.lastName}</SelectItem>)}</SelectContent></Select></Field></FieldGroup><FieldGroup><Field><FieldLabel htmlFor="follow-up-title">Task title</FieldLabel><Input id="follow-up-title" value={taskForm.title} onChange={(event) => setTaskForm((form) => ({ ...form, title: event.target.value }))} required /></Field></FieldGroup><FieldGroup><Field><FieldLabel htmlFor="follow-up-due-date">Due date</FieldLabel><Input id="follow-up-due-date" type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm((form) => ({ ...form, dueDate: event.target.value }))} required /></Field></FieldGroup><FieldGroup><Field><FieldLabel htmlFor="follow-up-notes">Notes</FieldLabel><Textarea id="follow-up-notes" value={taskForm.notes} onChange={(event) => setTaskForm((form) => ({ ...form, notes: event.target.value }))} /></Field></FieldGroup></div><DialogFooter><Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button type="submit">Create task</Button></DialogFooter></form></DialogContent></Dialog></div></AppShell>
}
