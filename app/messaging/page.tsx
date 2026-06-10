"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Send,
  MessageSquare,
  Clock,
  AlertCircle,
  FileText,
  BarChart2,
  Plus,
  Trash2,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useMessagingPloc, useFellowshipsPloc, useDepartmentsPloc, useFellowshipZonesPloc, useMessageTemplatePloc } from "@/core/di/DependencyLocator"
import useMessagingState from "@/application/messaging/useMessagingState"
import useFellowshipsState from "@/application/fellowship/useFellowshipsState"
import useDepartmentsState from "@/application/department/useDepartmentsState"
import useFellowshipZonesState from "@/application/fellowship-zone/useFellowshipZonesState"
import useMessageTemplateState from "@/application/messaging/useMessageTemplateState"
import type { CreateMessageRequest, MessageType, MessageTargetGroup, Message } from "@/domain/entities/messaging/Message"

const typeLabels: Record<MessageType, string> = {
  announcement: "Announcement",
  newsletter: "Newsletter",
  reminder: "Reminder",
  alert: "Alert",
}

const targetGroupLabels: Record<MessageTargetGroup, string> = {
  all: "All Members",
  fellowship: "Fellowship",
  department: "Department",
  zone: "Zone",
  members: "Specific Members",
}

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-primary text-primary-foreground",
}

const deliveryStatusColors = {
  pending: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  failed: "bg-destructive/20 text-destructive",
}


function CampaignDetailDrawer({
  message,
  open,
  onOpenChange,
}: {
  message: Message | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const ploc = useMessagingPloc()
  const deliveries = useMessagingState((s) => s.deliveries)
  const stats = useMessagingState((s) => s.deliveryStats)
  const loading = useMessagingState((s) => s.loading)

  useEffect(() => {
    if (open && message) {
      ploc.fetchDeliveries(message.id)
      ploc.fetchDeliveryStats(message.id)
    }
  }, [open, message, ploc])

  const deliveryRate = stats && stats.total > 0
    ? Math.round((stats.delivered / stats.total) * 100)
    : 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl w-full flex flex-col p-0">
        {!message ? (
          <>
            <SheetHeader className="px-6 pt-6 pb-4">
              <SheetTitle className="sr-only">Campaign Details</SheetTitle>
              <SheetDescription className="sr-only">Loading campaign</SheetDescription>
            </SheetHeader>
            <div className="flex items-center justify-center flex-1 text-muted-foreground">Loading…</div>
          </>
        ) : (
          <>
            <SheetHeader className="px-6 pt-6 pb-4">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge variant="outline">{typeLabels[message.type]}</Badge>
                <Badge className={statusColors[message.status]}>{message.status}</Badge>
              </div>
              <SheetTitle className="text-lg leading-tight">{message.title}</SheetTitle>
              <SheetDescription>
                {targetGroupLabels[message.targetGroup]}
                {message.sentAt && (
                  <> · {new Date(message.sentAt).toLocaleString()}</>
                )}
              </SheetDescription>
            </SheetHeader>

            <Separator />

            <ScrollArea className="flex-1 overflow-auto">
              <div className="px-6 py-4 space-y-5">
                {/* Message body */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Message</p>
                  <p className="text-sm leading-relaxed bg-muted/50 rounded-lg p-3">{message.body}</p>
                </div>

                <Separator />

                {/* Stats */}
                {stats ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Delivery Summary</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="border shadow-sm">
                        <CardContent className="p-3">
                          <p className="text-2xl font-bold">{stats.total}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </CardContent>
                      </Card>
                      <Card className="border shadow-sm">
                        <CardContent className="p-3">
                          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                          <p className="text-xs text-muted-foreground">Delivered ({deliveryRate}%)</p>
                        </CardContent>
                      </Card>
                      <Card className="border shadow-sm">
                        <CardContent className="p-3">
                          <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
                          <p className="text-xs text-muted-foreground">Sent (in transit)</p>
                        </CardContent>
                      </Card>
                      <Card className="border shadow-sm">
                        <CardContent className="p-3">
                          <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
                          <p className="text-xs text-muted-foreground">Failed</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : loading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[0,1,2,3].map(i => <Skeleton key={i} className="h-16" />)}
                  </div>
                ) : null}

                <Separator />

                {/* Delivery list */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Recipients ({deliveries.length})
                  </p>
                  {loading && deliveries.length === 0 ? (
                    <div className="space-y-2">
                      {[0,1,2,3].map(i => <Skeleton key={i} className="h-10" />)}
                    </div>
                  ) : deliveries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No delivery records yet.</p>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="text-xs">Member</TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                            <TableHead className="text-xs">Delivered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deliveries.map((d) => (
                            <TableRow key={d.id}>
                              <TableCell>
                                <p className="text-sm font-medium">{d.memberName}</p>
                                <p className="text-xs text-muted-foreground">{d.phone}</p>
                              </TableCell>
                              <TableCell>
                                <Badge className={`text-xs ${deliveryStatusColors[d.status] ?? "bg-muted"}`}>
                                  {d.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {d.deliveredAt
                                  ? new Date(d.deliveredAt).toLocaleString()
                                  : d.failureReason ?? "—"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function MessagingPageContent() {
  const searchParams = useSearchParams()
  const fellowshipIdParam = searchParams.get("fellowshipId")
  const memberIdsParam = searchParams.get("memberIds")

  const ploc = useMessagingPloc()
  const fellowshipsPloc = useFellowshipsPloc()
  const departmentsPloc = useDepartmentsPloc()
  const zonesPloc = useFellowshipZonesPloc()
  const templatePloc = useMessageTemplatePloc()

  const messages = useMessagingState((s) => s.messages)
  const loading = useMessagingState((s) => s.loading)
  const submitting = useMessagingState((s) => s.submitting)
  const sending = useMessagingState((s) => s.sending)
  const submitError = useMessagingState((s) => s.error)

  const templates = useMessageTemplateState((s) => s.templates)
  const templatesLoading = useMessageTemplateState((s) => s.loading)
  const templateSubmitting = useMessageTemplateState((s) => s.submitting)

  const fellowships = useFellowshipsState((s) => Array.isArray(s.fellowships) ? s.fellowships : [])
  const departments = useDepartmentsState((s) => Array.isArray(s.departments) ? s.departments : [])
  const zones = useFellowshipZonesState((s) => Array.isArray(s.fellowshipZones) ? s.fellowshipZones : [])

  const [createTemplateOpen, setCreateTemplateOpen] = useState(false)
  const [templateForm, setTemplateForm] = useState({ name: "", body: "" })

  const preselectedMemberIds = memberIdsParam ? memberIdsParam.split(",").filter(Boolean) : []

  const [form, setForm] = useState<{
    title: string
    body: string
    type: MessageType
    targetGroup: MessageTargetGroup
    targetId: string
    memberIds: string[]
  }>(() => {
    const now = new Date()
    const day = now.toLocaleDateString("en-US", { weekday: "long" })
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    return {
      title: `${day} Service Campaign ${time}`,
      body: "",
      type: "announcement",
      targetGroup: preselectedMemberIds.length > 0 ? "members" : fellowshipIdParam ? "fellowship" : "all",
      targetId: fellowshipIdParam ?? "",
      memberIds: preselectedMemberIds,
    }
  })

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("compose")

  useEffect(() => {
    fellowshipsPloc.fetchAll()
    departmentsPloc.fetchAll()
    zonesPloc.fetchAll()
    templatePloc.fetchAll()
  }, [fellowshipsPloc, departmentsPloc, zonesPloc, templatePloc])

  useEffect(() => {
    if (activeTab === "history") ploc.fetchAll()
    if (activeTab === "templates") templatePloc.fetchAll()
  }, [activeTab, ploc, templatePloc])

  const handleCompose = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: CreateMessageRequest = {
      title: form.title,
      body: form.body,
      type: form.type,
      targetGroup: form.targetGroup,
      targetId: form.targetGroup !== "all" && form.targetGroup !== "members" && form.targetId ? form.targetId : null,
      memberIds: form.targetGroup === "members" ? form.memberIds : undefined,
    }
    await ploc.create(payload)
    const state = useMessagingState.getState()
    if (!state.error && state.messages[0]) {
      await ploc.send(state.messages[0].id)
      if (!useMessagingState.getState().error) {
        const now = new Date()
        const day = now.toLocaleDateString("en-US", { weekday: "long" })
        const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
        setForm({ title: `${day} Service Campaign ${time}`, body: "", type: "announcement", targetGroup: "all", targetId: "", memberIds: [] })
        setActiveTab("history")
        ploc.fetchAll()
      }
    }
  }

  const handleViewDetail = (msg: Message) => {
    setSelectedMessage(msg)
    setDrawerOpen(true)
  }

  const applyTemplate = (name: string, body: string) => {
    setForm((prev) => ({ ...prev, title: name, body }))
    setActiveTab("compose")
  }

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await templatePloc.create({
      name: templateForm.name.trim(),
      body: templateForm.body.trim(),
    })
    if (ok) {
      setTemplateForm({ name: "", body: "" })
      setCreateTemplateOpen(false)
    }
  }

  const sentMessages = messages.filter((m) => m.status === "sent")
  const totalDelivered = sentMessages.length

  const needsTargetId = form.targetGroup !== "all" && form.targetGroup !== "members"
  const canSend = form.title.trim().length > 0 && form.body.trim().length > 0 &&
    (!needsTargetId || form.targetId.length > 0) &&
    (form.targetGroup !== "members" || form.memberIds.length > 0) &&
    !submitting && !sending

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Bulk Messaging</h1>
            <p className="text-muted-foreground">Send SMS notifications to congregation members</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{messages.length}</p>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <Send className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDelivered}</p>
                <p className="text-sm text-muted-foreground">Sent</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{messages.filter(m => m.status === "draft").length}</p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                <BarChart2 className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{templates.length}</p>
                <p className="text-sm text-muted-foreground">Templates</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* ── Compose Tab ────────────────────────────────────────────────── */}
          <TabsContent value="compose">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>New Campaign</CardTitle>
                    <CardDescription>Compose and send an SMS to a target group</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCompose} className="space-y-5">
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="title">Campaign Title</FieldLabel>
                          <Input
                            id="title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="e.g. Sunday Service Reminder"
                            required
                          />
                        </Field>
                      </FieldGroup>

                      <FieldGroup>
                        <Field>
                          <FieldLabel>Template</FieldLabel>
                          <Select
                            value=""
                            onValueChange={(id) => {
                              const tpl = templates.find((t) => t.id === id)
                              if (tpl) applyTemplate(tpl.name, tpl.body)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={
                                templatesLoading
                                  ? "Loading templates…"
                                  : templates.length === 0
                                  ? "No templates yet — create one in the Templates tab"
                                  : "Select a template to pre-fill"
                              } />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.map((tpl) => (
                                <SelectItem key={tpl.id} value={tpl.id}>
                                  {tpl.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      </FieldGroup>

                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="body">Message Body</FieldLabel>
                          <Textarea
                            id="body"
                            value={form.body}
                            onChange={(e) => setForm({ ...form, body: e.target.value })}
                            placeholder="Type your message here…"
                            rows={5}
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {form.body.length}/160 chars · {Math.ceil(form.body.length / 160) || 1} SMS part{Math.ceil(form.body.length / 160) !== 1 ? "s" : ""}
                          </p>
                        </Field>
                      </FieldGroup>

                      {submitError && (
                        <p className="text-sm text-destructive">{submitError}</p>
                      )}

                      <div className="pt-4 border-t flex items-center justify-end">
                        <Button type="submit" disabled={!canSend} className="gap-2">
                          <Send className="h-4 w-4" />
                          {submitting || sending ? "Sending…" : "Send Campaign"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Target Group Sidebar */}
              <div>
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>Target Group</CardTitle>
                    <CardDescription>Who should receive this message?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Audience</FieldLabel>
                        <Select
                          value={form.targetGroup}
                          onValueChange={(v) => setForm({ ...form, targetGroup: v as MessageTargetGroup, targetId: "", memberIds: [] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Members</SelectItem>
                            <SelectItem value="fellowship">Fellowship</SelectItem>
                            <SelectItem value="department">Department</SelectItem>
                            <SelectItem value="zone">Zone</SelectItem>
                            <SelectItem value="members">Specific Members</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </FieldGroup>

                    {form.targetGroup === "fellowship" && (
                      <FieldGroup>
                        <Field>
                          <FieldLabel>Select Fellowship</FieldLabel>
                          <Select
                            value={form.targetId}
                            onValueChange={(v) => setForm({ ...form, targetId: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a fellowship" />
                            </SelectTrigger>
                            <SelectContent>
                              {fellowships.map((f) => (
                                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      </FieldGroup>
                    )}

                    {form.targetGroup === "department" && (
                      <FieldGroup>
                        <Field>
                          <FieldLabel>Select Department</FieldLabel>
                          <Select
                            value={form.targetId}
                            onValueChange={(v) => setForm({ ...form, targetId: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((d) => (
                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      </FieldGroup>
                    )}

                    {form.targetGroup === "zone" && (
                      <FieldGroup>
                        <Field>
                          <FieldLabel>Select Zone</FieldLabel>
                          <Select
                            value={form.targetId}
                            onValueChange={(v) => setForm({ ...form, targetId: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a zone" />
                            </SelectTrigger>
                            <SelectContent>
                              {zones.map((z) => (
                                <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      </FieldGroup>
                    )}

                    {form.targetGroup === "members" && (
                      <div className="rounded-lg border bg-muted/40 px-4 py-3">
                        {form.memberIds.length > 0 ? (
                          <p className="text-sm font-medium">
                            {form.memberIds.length} member{form.memberIds.length !== 1 ? "s" : ""} selected
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            No members selected — go to People and use checkboxes
                          </p>
                        )}
                      </div>
                    )}

                    {needsTargetId && !form.targetId && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Please select a specific {form.targetGroup}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── History Tab ────────────────────────────────────────────────── */}
          <TabsContent value="history">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Campaign History</CardTitle>
                <CardDescription>All sent and draft campaigns with delivery status</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading && messages.length === 0 ? (
                  <div className="p-4 space-y-3">
                    {[0,1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                    <MessageSquare className="h-10 w-10 opacity-30" />
                    <p className="text-sm">No campaigns yet. Compose your first one.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Campaign</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Type</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Target</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Sent At</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((msg) => (
                        <TableRow key={msg.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{msg.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{typeLabels[msg.type]}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {targetGroupLabels[msg.targetGroup]}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[msg.status]}>{msg.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {msg.sentAt
                              ? new Date(msg.sentAt).toLocaleString()
                              : "—"}
                          </TableCell>
                          <TableCell>
                            {msg.status === "sent" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetail(msg)}
                              >
                                <BarChart2 className="h-4 w-4 mr-1.5" />
                                Report
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Templates Tab ──────────────────────────────────────────────── */}
          <TabsContent value="templates">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{templates.length} template{templates.length !== 1 ? "s" : ""}</p>
              <Button size="sm" className="gap-2" onClick={() => setCreateTemplateOpen(true)}>
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            </div>
            {templatesLoading && templates.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0,1,2].map(i => <Skeleton key={i} className="h-44" />)}
              </div>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                <FileText className="h-10 w-10 opacity-30" />
                <p className="text-sm">No templates yet. Create your first one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{template.name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => templatePloc.delete(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{template.body}</p>
                      <Button size="sm" className="w-full" onClick={() => applyTemplate(template.name, template.body)}>
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CampaignDetailDrawer
        message={selectedMessage}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      {/* ── Create Template Dialog ──────────────────────────────────────── */}
      <Dialog open={createTemplateOpen} onOpenChange={setCreateTemplateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Template</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTemplate} className="space-y-4 pt-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="tpl-name">Template Name</FieldLabel>
                <Input
                  id="tpl-name"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Sunday Service Reminder"
                  required
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="tpl-body">Message Body</FieldLabel>
                <Textarea
                  id="tpl-body"
                  value={templateForm.body}
                  onChange={(e) => setTemplateForm((p) => ({ ...p, body: e.target.value }))}
                  placeholder="Use {name} for member name, {date} for date…"
                  rows={4}
                  required
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateTemplateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={templateSubmitting}>
                {templateSubmitting ? "Saving…" : "Save Template"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}

export default function MessagingPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="p-6 flex items-center justify-center">
            <div className="text-muted-foreground">Loading…</div>
          </div>
        </AppShell>
      }
    >
      <MessagingPageContent />
    </Suspense>
  )
}
