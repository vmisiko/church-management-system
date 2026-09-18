"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Spinner } from "@/components/ui/spinner"
import { ChevronsUpDown, X } from "lucide-react"
import { useAttendancePloc, useMembersPloc } from "@/core/di/DependencyLocator"
import useAttendanceState from "@/application/attendance/useAttendanceState"
import useMembersState from "@/application/member/useMembersState"
import type { AttendanceStatus, SessionSummary, SessionType } from "@/domain/entities/attendance/Attendance"

const SESSION_TYPES: { value: SessionType; label: string }[] = [
  { value: "sunday_service", label: "Sunday Service" },
  { value: "midweek_service", label: "Midweek Service" },
  { value: "fellowship", label: "Fellowship" },
  { value: "special_event", label: "Special Event" },
]

const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "excused", label: "Excused" },
]

interface Row {
  memberId: string
  name: string
  status: AttendanceStatus
  recordId: string | null
}

interface RecordAttendanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDate?: string
  session?: SessionSummary
  onSaved?: () => void
}

export function RecordAttendanceDialog({ open, onOpenChange, initialDate, session, onSaved }: RecordAttendanceDialogProps) {
  const attendancePloc = useAttendancePloc()
  const membersPloc = useMembersPloc()
  const sessionRecords = useAttendanceState((s) => s.sessionRecords)
  const error = useAttendanceState((s) => s.error)
  const members = useMembersState((s) => (Array.isArray(s.members) ? s.members : []))

  const [sessionForm, setSessionForm] = useState({ title: "", sessionType: "sunday_service" as SessionType, sessionDate: initialDate ?? new Date().toISOString().slice(0, 10) })
  const [sessionId, setSessionId] = useState<string | null>(session?.id ?? null)
  const [rows, setRows] = useState<Row[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void membersPloc.fetchAll()
  }, [membersPloc])

  useEffect(() => {
    if (!open) return
    if (session) {
      setSessionId(session.id)
      setRows([])
      void attendancePloc.fetchSessionRecords(session.id)
    } else {
      setSessionId(null)
      setRows([])
      setSessionForm({ title: "", sessionType: "sunday_service", sessionDate: initialDate ?? new Date().toISOString().slice(0, 10) })
    }
  }, [open, session, initialDate, attendancePloc])

  useEffect(() => {
    if (!sessionId || members.length === 0) return
    setRows((current) => {
      const known = new Map(current.map((r) => [r.memberId, r]))
      const fromRecords: Row[] = sessionRecords
        .filter((r) => r.sessionId === sessionId)
        .map((r) => {
          const member = members.find((m) => m.id === r.memberId)
          return {
            memberId: r.memberId,
            name: member ? `${member.firstName} ${member.lastName}` : "Unknown member",
            status: r.status,
            recordId: r.id,
          }
        })
      const merged = new Map(fromRecords.map((r) => [r.memberId, r]))
      for (const [memberId, row] of known) {
        if (!merged.has(memberId)) merged.set(memberId, row)
      }
      return Array.from(merged.values())
    })
  }, [sessionRecords, sessionId, members])

  const availableMembers = useMemo(
    () => members.filter((m) => !rows.some((r) => r.memberId === m.id)),
    [members, rows],
  )

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    const created = await attendancePloc.createSession(sessionForm)
    setCreating(false)
    if (created) setSessionId(created.id)
  }

  const addMember = (memberId: string, name: string) => {
    setRows((current) => [...current, { memberId, name, status: "present", recordId: null }])
    setPickerOpen(false)
  }

  const updateRowStatus = (memberId: string, status: AttendanceStatus) => {
    setRows((current) => current.map((r) => (r.memberId === memberId ? { ...r, status } : r)))
  }

  const removeRow = (memberId: string) => {
    setRows((current) => current.filter((r) => r.memberId !== memberId))
  }

  const handleSaveAttendance = async () => {
    if (!sessionId) return
    setSaving(true)
    for (const row of rows) {
      if (row.recordId) {
        await attendancePloc.updateRecord(row.recordId, { status: row.status })
      } else {
        await attendancePloc.recordAttendance({ sessionId, memberId: row.memberId, status: row.status })
      }
    }
    setSaving(false)
    onSaved?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{session ? `Attendance — ${session.title}` : "Record Attendance"}</DialogTitle>
          <DialogDescription>
            {sessionId
              ? "Search for a member to mark their attendance status."
              : "Create a session first, then mark who attended."}
          </DialogDescription>
        </DialogHeader>

        {!sessionId && (
          <form onSubmit={handleCreateSession}>
            <div className="grid gap-4 py-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="session-title">Title</FieldLabel>
                  <Input
                    id="session-title"
                    value={sessionForm.title}
                    onChange={(e) => setSessionForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g., Sunday Service"
                    required
                  />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <Select value={sessionForm.sessionType} onValueChange={(v) => setSessionForm((f) => ({ ...f, sessionType: v as SessionType }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SESSION_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="session-date">Date</FieldLabel>
                  <Input
                    id="session-date"
                    type="date"
                    value={sessionForm.sessionDate}
                    onChange={(e) => setSessionForm((f) => ({ ...f, sessionDate: e.target.value }))}
                    required
                  />
                </Field>
              </FieldGroup>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={creating} className="gap-2">
                {creating && <Spinner />}
                Continue
              </Button>
            </DialogFooter>
          </form>
        )}

        {sessionId && (
          <div className="space-y-4 py-2">
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" role="combobox" aria-expanded={pickerOpen} className="w-full justify-between font-normal">
                  <span className="text-muted-foreground">Add a member…</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search by name…" />
                  <CommandList>
                    <CommandEmpty>No member found.</CommandEmpty>
                    <CommandGroup>
                      {availableMembers.map((m) => {
                        const fullName = `${m.firstName} ${m.lastName}`
                        return (
                          <CommandItem key={m.id} value={fullName} onSelect={() => addMember(m.id, fullName)}>
                            {fullName}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="max-h-[320px] overflow-y-auto space-y-2">
              {rows.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No members added yet.</p>
              )}
              {rows.map((row) => (
                <div key={row.memberId} className="flex items-center gap-2 rounded-lg border p-2">
                  <span className="flex-1 text-sm font-medium truncate">{row.name}</span>
                  <Select value={row.status} onValueChange={(v) => updateRowStatus(row.memberId, v as AttendanceStatus)}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {!row.recordId && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(row.memberId)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button type="button" onClick={handleSaveAttendance} disabled={saving || rows.length === 0} className="gap-2">
                {saving && <Spinner />}
                Save Attendance
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
