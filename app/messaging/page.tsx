"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Mail,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Search,
} from "lucide-react"
import { getFellowshipBySlug } from "@/lib/fellowships"

const messageHistory = [
  {
    id: "1",
    title: "Sunday Service Reminder",
    type: "sms",
    recipients: "All Members",
    count: 2480,
    sent: "2024-03-30 08:00",
    status: "delivered",
    deliveryRate: 98,
  },
  {
    id: "2",
    title: "Easter Celebration Invite",
    type: "email",
    recipients: "All Members + Guests",
    count: 2856,
    sent: "2024-03-28 10:30",
    status: "delivered",
    deliveryRate: 95,
  },
  {
    id: "3",
    title: "Fellowship Meeting Reschedule",
    type: "sms",
    recipients: "Kawangware Fellowship",
    count: 156,
    sent: "2024-03-25 14:00",
    status: "delivered",
    deliveryRate: 100,
  },
  {
    id: "4",
    title: "Youth Conference Registration",
    type: "email",
    recipients: "Youth Department",
    count: 245,
    sent: "2024-03-22 09:00",
    status: "delivered",
    deliveryRate: 92,
  },
  {
    id: "5",
    title: "Choir Rehearsal Notice",
    type: "sms",
    recipients: "Choir Department",
    count: 45,
    sent: "2024-03-20 16:00",
    status: "failed",
    deliveryRate: 0,
  },
]

const templates = [
  { id: "1", name: "Sunday Service Reminder", category: "Weekly" },
  { id: "2", name: "Birthday Wishes", category: "Personal" },
  { id: "3", name: "Event Invitation", category: "Events" },
  { id: "4", name: "Meeting Reminder", category: "Meetings" },
  { id: "5", name: "Offering Acknowledgment", category: "Finance" },
]

const statusStyles = {
  delivered: "bg-success/20 text-success",
  pending: "bg-warning/20 text-warning",
  failed: "bg-destructive/20 text-destructive",
}

const statusIcons = {
  delivered: CheckCircle2,
  pending: Clock,
  failed: XCircle,
}

const baseRecipientGroups = [
  { id: "all", label: "All Members", count: 2480 },
  { id: "leaders", label: "Leadership", count: 45 },
  { id: "youth", label: "Youth Department", count: 245 },
  { id: "choir", label: "Choir Department", count: 45 },
  { id: "ushers", label: "Ushers Department", count: 52 },
  { id: "fellowships", label: "Fellowship Leaders", count: 15 },
]

function MessagingPageContent() {
  const searchParams = useSearchParams()
  const fellowshipSlugParam = searchParams.get("fellowship")

  const [messageType, setMessageType] = useState<"sms" | "email">("sms")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")

  const targetedFellowship = fellowshipSlugParam
    ? getFellowshipBySlug(fellowshipSlugParam)
    : undefined

  const recipientGroups = useMemo(() => {
    if (!targetedFellowship) return baseRecipientGroups

    return [
      {
        id: `fellowship:${fellowshipSlugParam}`,
        label: targetedFellowship.name,
        count: targetedFellowship.members,
      },
      ...baseRecipientGroups,
    ]
  }, [targetedFellowship, fellowshipSlugParam])

  useEffect(() => {
    if (targetedFellowship && fellowshipSlugParam) {
      setSelectedRecipients([`fellowship:${fellowshipSlugParam}`])
    }
  }, [targetedFellowship, fellowshipSlugParam])

  const handleRecipientToggle = (id: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(id)
        ? prev.filter((r) => r !== id)
        : [...prev, id]
    )
  }

  const totalRecipients = recipientGroups
    .filter((g) => selectedRecipients.includes(g.id))
    .reduce((acc, g) => acc + g.count, 0)

  const totalSent = messageHistory.reduce((acc, m) => acc + m.count, 0)
  const deliveredMessages = messageHistory.filter((m) => m.status === "delivered").length

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Bulk Messaging</h1>
            <p className="text-muted-foreground">
              {targetedFellowship
                ? `Compose a message for ${targetedFellowship.name}`
                : "Send SMS and email notifications to congregation members"}
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSent.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Messages Sent</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{deliveredMessages}</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                <MessageSquare className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{templates.length}</p>
                <p className="text-sm text-muted-foreground">Templates</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/20">
                <Users className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">96%</p>
                <p className="text-sm text-muted-foreground">Avg. Delivery Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="compose" className="space-y-6">
          <TabsList>
            <TabsTrigger value="compose">Compose Message</TabsTrigger>
            <TabsTrigger value="history">Message History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Compose Tab */}
          <TabsContent value="compose">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Message Form */}
              <div className="lg:col-span-2">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>New Message</CardTitle>
                    <CardDescription>Compose and send a message to your congregation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Message Type Toggle */}
                    <div className="flex gap-2">
                      <Button
                        variant={messageType === "sms" ? "default" : "outline"}
                        onClick={() => setMessageType("sms")}
                        className="gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        SMS
                      </Button>
                      <Button
                        variant={messageType === "email" ? "default" : "outline"}
                        onClick={() => setMessageType("email")}
                        className="gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                    </div>

                    {/* Email Subject (only for email) */}
                    {messageType === "email" && (
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="subject">Subject Line</FieldLabel>
                          <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter email subject..."
                          />
                        </Field>
                      </FieldGroup>
                    )}

                    {/* Template Selection */}
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Use Template (Optional)</FieldLabel>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </FieldGroup>

                    {/* Message Content */}
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="message">Message Content</FieldLabel>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message here..."
                          rows={6}
                        />
                        {messageType === "sms" && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {message.length}/160 characters ({Math.ceil(message.length / 160) || 1} SMS)
                          </p>
                        )}
                      </Field>
                    </FieldGroup>

                    {/* Send Button */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        {totalRecipients > 0 ? (
                          <span>Sending to <span className="font-semibold text-foreground">{totalRecipients.toLocaleString()}</span> recipients</span>
                        ) : (
                          <span>Select recipients from the sidebar</span>
                        )}
                      </div>
                      <Button
                        disabled={totalRecipients === 0 || message.length === 0}
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Send {messageType === "sms" ? "SMS" : "Email"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recipients Sidebar */}
              <div>
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>Recipients</CardTitle>
                    <CardDescription>Select who should receive this message</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recipientGroups.map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleRecipientToggle(group.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedRecipients.includes(group.id)}
                            onCheckedChange={() => handleRecipientToggle(group.id)}
                          />
                          <Label className="cursor-pointer">{group.label}</Label>
                        </div>
                        <Badge variant="secondary">{group.count}</Badge>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium">
                        Total Selected: <span className="text-primary">{totalRecipients.toLocaleString()}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Message History</CardTitle>
                  <CardDescription>View all sent messages and their delivery status</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-9" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Message</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Recipients</TableHead>
                      <TableHead className="font-semibold">Sent</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">Delivery Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messageHistory.map((msg) => {
                      const StatusIcon = statusIcons[msg.status as keyof typeof statusIcons]
                      return (
                        <TableRow key={msg.id}>
                          <TableCell className="font-medium">{msg.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1">
                              {msg.type === "sms" ? <MessageSquare className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                              {msg.type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{msg.recipients}</p>
                              <p className="text-xs text-muted-foreground">{msg.count.toLocaleString()} recipients</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {msg.sent}
                          </TableCell>
                          <TableCell>
                            <Badge className={`gap-1 ${statusStyles[msg.status as keyof typeof statusStyles]}`}>
                              <StatusIcon className="h-3 w-3" />
                              {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {msg.deliveryRate}%
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{template.name}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                      <Button size="sm" className="flex-1">Use</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {/* Add New Template Card */}
              <Card className="border shadow-sm border-dashed hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[140px]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Create New Template</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

export default function MessagingPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="p-6">
            <p className="text-muted-foreground">Loading messaging...</p>
          </div>
        </AppShell>
      }
    >
      <MessagingPageContent />
    </Suspense>
  )
}
