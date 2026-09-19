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
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, ClipboardList, History, PhoneCall, Plus, RotateCcw, Sparkles } from "lucide-react"
import { useFollowUpsPloc, useMembersPloc, useUsersPloc } from "@/core/di/DependencyLocator"
import useFollowUpsState from "@/application/follow-up/useFollowUpsState"
import useMembersState from "@/application/member/useMembersState"
import useUsersState from "@/application/user/useUsersState"
import type { FollowUpContactMethod, FollowUpOutcome, FollowUpStatus, FollowUpTask } from "@/domain/entities/follow-up/FollowUp"

const emptyTask = { memberId: "", title: "", notes: "", dueDate: new Date().toISOString().slice(0, 10) }
const emptyAttempt: { contactMethod: FollowUpContactMethod; outcome: FollowUpOutcome; notes: string; contactedAt: string } = { contactMethod: "call", outcome: "connected", notes: "", contactedAt: "" }
const CONTACT_METHODS: FollowUpContactMethod[] = ["call", "sms", "email", "visit", "other"]
const OUTCOMES: FollowUpOutcome[] = ["connected", "no_answer", "requested_callback", "not_interested", "wrong_number", "other"]
const METHOD_LABELS: Record<FollowUpContactMethod, string> = { call: "Call", sms: "SMS", email: "Email", visit: "Visit", other: "Other" }
const OUTCOME_LABELS: Record<FollowUpOutcome, string> = { connected: "Connected", no_answer: "No answer", requested_callback: "Requested callback", not_interested: "Not interested", wrong_number: "Wrong number", other: "Other" }
const SOURCE_LABELS: Record<string, string> = { visitor_automation: "Auto · New visitor", inactivity_automation: "Auto · Inactivity" }

export default function FollowUpsPage() {
  const followUpsPloc = useFollowUpsPloc()
  const membersPloc = useMembersPloc()
  const usersPloc = useUsersPloc()
  const tasks = useFollowUpsState((state) => state.tasks)
  const escalations = useFollowUpsState((state) => state.escalations)
  const loading = useFollowUpsState((state) => state.loading)
  const submitting = useFollowUpsState((state) => state.submitting)
  const error = useFollowUpsState((state) => state.error)
  const members = useMembersState((state) => state.members)
  const users = useUsersState((state) => state.users)
  const [statusFilter, setStatusFilter] = useState<FollowUpStatus | "all">("open")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [taskForm, setTaskForm] = useState(emptyTask)
  const [attemptTask, setAttemptTask] = useState<FollowUpTask | null>(null)
  const [attemptForm, setAttemptForm] = useState(emptyAttempt)
  const [attemptDone, setAttemptDone] = useState(false)
  const [historyTask, setHistoryTask] = useState<FollowUpTask | null>(null)

  useEffect(() => {
    void followUpsPloc.fetchAll()
    void membersPloc.fetchAll({ page: 1, limit: 100 })
    void usersPloc.fetchAll()
  }, [followUpsPloc, membersPloc, usersPloc])

  const visibleTasks = useMemo(
    () => (statusFilter === "all" ? tasks : tasks.filter((task) => task.status === statusFilter)),
    [statusFilter, tasks],
  )

  const memberName = (id: string) => {
    const member = members.find((item) => item.id === id)
    return member ? `${member.firstName} ${member.lastName}` : "Unknown member"
  }
  const userEmail = (id: string | null) => {
    if (!id) return "Unassigned"
    return users.find((u) => u.id === id)?.email ?? "Unknown user"
  }

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const created = await followUpsPloc.create(taskForm)
    if (created) {
      setTaskForm(emptyTask)
      setIsCreateOpen(false)
    }
  }

  const openAttempt = (task: FollowUpTask) => {
    useFollowUpsState.setState({ error: null })
    setAttemptForm(emptyAttempt)
    setAttemptDone(false)
    setAttemptTask(task)
  }

  const openHistory = (task: FollowUpTask) => {
    setHistoryTask(task)
    void followUpsPloc.fetchEscalations(task.id)
  }

  const handleRecordAttempt = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!attemptTask) return
    const recorded = await followUpsPloc.recordAttempt(attemptTask.id, {
      contactMethod: attemptForm.contactMethod,
      outcome: attemptForm.outcome,
      notes: attemptForm.notes.trim() || undefined,
      contactedAt: attemptForm.contactedAt ? new Date(attemptForm.contactedAt).toISOString() : undefined,
    })
    if (recorded) {
      setAttemptDone(true)
      setTimeout(() => setAttemptTask(null), 900)
    }
  }

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Visitor Follow-up</h1>
            <p className="text-muted-foreground">Own the next action for every visitor and member who needs care.</p>
          </div>
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New Follow-up
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <ClipboardList className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{tasks.filter((task) => task.status === "open").length}</p>
                <p className="text-sm text-muted-foreground">Open tasks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <RotateCcw className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">
                  {tasks.filter((task) => task.status === "open" && task.dueDate < new Date().toISOString().slice(0, 10)).length}
                </p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{tasks.filter((task) => task.status === "completed").length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Task queue</h2>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FollowUpStatus | "all")}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="all">All tasks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Follow-up tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading && tasks.length === 0 && Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-20 w-full" />)}
            {!loading && visibleTasks.length === 0 && <p className="py-8 text-center text-muted-foreground">No tasks in this queue.</p>}
            {visibleTasks.map((task) => (
              <div key={task.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{task.title}</p>
                    <Badge>{task.status}</Badge>
                    {task.source !== "manual" && (
                      <Badge variant="secondary" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        {SOURCE_LABELS[task.source] ?? task.source}
                      </Badge>
                    )}
                    {task.escalationLevel > 0 && (
                      <Badge variant="destructive">Escalated → {userEmail(task.escalatedToId)}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {memberName(task.memberId)} · Due {task.dueDate} · Owner: {userEmail(task.ownerId)}
                  </p>
                  {task.notes && <p className="mt-1 text-sm">{task.notes}</p>}
                </div>
                <div className="flex gap-2">
                  {task.escalationLevel > 0 && (
                    <Button size="sm" variant="ghost" className="gap-1" onClick={() => openHistory(task)}>
                      <History className="h-4 w-4" />
                      History
                    </Button>
                  )}
                  {task.status === "open" && (
                    <>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => openAttempt(task)}>
                        <PhoneCall className="h-4 w-4" />
                        Record attempt
                      </Button>
                      <Button size="sm" onClick={() => void followUpsPloc.update(task.id, { status: "completed" })}>
                        Complete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New follow-up task</DialogTitle>
              <DialogDescription>Create an accountable next action.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Member or visitor</FieldLabel>
                    <Select value={taskForm.memberId} onValueChange={(value) => setTaskForm((form) => ({ ...form, memberId: value }))} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a person" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.firstName} {member.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="follow-up-title">Task title</FieldLabel>
                    <Input id="follow-up-title" value={taskForm.title} onChange={(event) => setTaskForm((form) => ({ ...form, title: event.target.value }))} required />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="follow-up-due-date">Due date</FieldLabel>
                    <Input id="follow-up-due-date" type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm((form) => ({ ...form, dueDate: event.target.value }))} required />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="follow-up-notes">Notes</FieldLabel>
                    <Textarea id="follow-up-notes" value={taskForm.notes} onChange={(event) => setTaskForm((form) => ({ ...form, notes: event.target.value }))} />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit">Create task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={attemptTask !== null} onOpenChange={(open) => { if (!open) setAttemptTask(null) }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record contact attempt</DialogTitle>
              <DialogDescription>{attemptTask ? `Log an outreach attempt for "${attemptTask.title}".` : ""}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRecordAttempt}>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Contact method</FieldLabel>
                    <Select value={attemptForm.contactMethod} onValueChange={(value) => setAttemptForm((form) => ({ ...form, contactMethod: value as FollowUpContactMethod }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTACT_METHODS.map((method) => (
                          <SelectItem key={method} value={method}>{METHOD_LABELS[method]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Outcome</FieldLabel>
                    <Select value={attemptForm.outcome} onValueChange={(value) => setAttemptForm((form) => ({ ...form, outcome: value as FollowUpOutcome }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OUTCOMES.map((outcome) => (
                          <SelectItem key={outcome} value={outcome}>{OUTCOME_LABELS[outcome]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="attempt-contacted-at">Contacted at (optional)</FieldLabel>
                    <Input id="attempt-contacted-at" type="datetime-local" value={attemptForm.contactedAt} onChange={(event) => setAttemptForm((form) => ({ ...form, contactedAt: event.target.value }))} />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="attempt-notes">Notes</FieldLabel>
                    <Textarea id="attempt-notes" value={attemptForm.notes} onChange={(event) => setAttemptForm((form) => ({ ...form, notes: event.target.value }))} placeholder="What happened on this attempt?" />
                  </Field>
                </FieldGroup>
                {error && !attemptDone && <p className="text-sm text-destructive">{error}</p>}
                {attemptDone && <p className="text-sm text-success">Attempt recorded.</p>}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAttemptTask(null)}>Cancel</Button>
                <Button type="submit" className="gap-2" disabled={submitting || attemptDone}>
                  {submitting && <Spinner />}
                  Save attempt
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={historyTask !== null} onOpenChange={(open) => { if (!open) setHistoryTask(null) }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Escalation history</DialogTitle>
              <DialogDescription>{historyTask ? `"${historyTask.title}"` : ""}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              {escalations.length === 0 && <p className="text-sm text-muted-foreground">No escalation history.</p>}
              {escalations.map((escalation) => (
                <div key={escalation.id} className="rounded-lg border p-3 text-sm">
                  <p>
                    <span className="text-muted-foreground">{userEmail(escalation.fromOwnerId)}</span>
                    {" → "}
                    <span className="font-medium">{userEmail(escalation.toOwnerId)}</span>
                  </p>
                  <p className="text-muted-foreground">{escalation.reason}</p>
                  <p className="text-xs text-muted-foreground">{new Date(escalation.escalatedAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setHistoryTask(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
