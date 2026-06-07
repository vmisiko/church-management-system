"use client"

import { useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
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
import { cn } from "@/lib/utils"
import { Pencil, Trash2, Phone, Mail, Calendar, Users, Building2, Check, ChevronsUpDown } from "lucide-react"
import useMembersState from "@/application/member/useMembersState"
import useFellowshipsState from "@/application/fellowship/useFellowshipsState"
import useDepartmentsState from "@/application/department/useDepartmentsState"
import {
  useMembersPloc,
  useFellowshipsPloc,
  useDepartmentsPloc,
} from "@/core/di/DependencyLocator"
import type { MemberStatus, MemberType, ActivityStatus } from "@/domain/entities/member/Member"

const statusColors: Record<string, string> = {
  guest: "bg-muted text-muted-foreground",
  member: "bg-primary text-primary-foreground",
  leader: "bg-destructive text-destructive-foreground",
}

const activityColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  inactive: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
}

interface MemberDetailDrawerProps {
  memberId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberDetailDrawer({ memberId, open, onOpenChange }: MemberDetailDrawerProps) {
  const membersPloc = useMembersPloc()
  const fellowshipsPloc = useFellowshipsPloc()
  const departmentsPloc = useDepartmentsPloc()

  const member = useMembersState((s) => s.currentMember)
  const memberDepartments = useMembersState((s) => s.memberDepartments)
  const submitting = useMembersState((s) => s.submitting)
  const submitError = useMembersState((s) => s.error)

  const fellowships = useFellowshipsState((s) => Array.isArray(s.fellowships) ? s.fellowships : [])
  const departments = useDepartmentsState((s) => Array.isArray(s.departments) ? s.departments : [])

  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deptPopoverOpen, setDeptPopoverOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "member" as MemberStatus,
    memberType: "adult" as MemberType,
    activityStatus: "active" as ActivityStatus,
    fellowshipId: "",
    departmentIds: [] as string[],
  })

  useEffect(() => {
    if (open && memberId) {
      membersPloc.fetchById(memberId)
      membersPloc.fetchDepartments(memberId)
      fellowshipsPloc.fetchAll()
      departmentsPloc.fetchAll()
      setEditing(false)
      setConfirmDelete(false)
    }
  }, [open, memberId, membersPloc, fellowshipsPloc, departmentsPloc])

  useEffect(() => {
    if (member && member.id === memberId) {
      setFormData((prev) => ({
        ...prev,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email ?? "",
        phone: member.phone ?? "",
        status: member.status,
        memberType: member.memberType,
        activityStatus: member.activityStatus,
        fellowshipId: member.fellowshipId ?? "",
      }))
    }
  }, [member, memberId])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      departmentIds: memberDepartments.map((d) => d.id),
    }))
  }, [memberDepartments])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!memberId) return

    await membersPloc.update(memberId, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email || null,
      phone: formData.phone || null,
      status: formData.status,
      memberType: formData.memberType,
      activityStatus: formData.activityStatus,
      fellowshipId: formData.fellowshipId || null,
    })
    if (useMembersState.getState().error) return

    const currentIds = new Set(memberDepartments.map((d) => d.id))
    const newIds = new Set(formData.departmentIds)
    const toRemove = [...currentIds].filter((id) => !newIds.has(id))
    const toAdd = [...newIds].filter((id) => !currentIds.has(id))

    for (const id of toRemove) {
      await membersPloc.removeDepartment(memberId, id)
      if (useMembersState.getState().error) return
    }
    for (const id of toAdd) {
      await membersPloc.assignDepartment(memberId, id)
      if (useMembersState.getState().error) return
    }

    if (!useMembersState.getState().error) setEditing(false)
  }

  const handleDelete = async () => {
    if (!memberId) return
    await membersPloc.delete(memberId)
    const error = useMembersState.getState().error
    if (!error) onOpenChange(false)
  }

  const fellowshipName = fellowships.find((f) => f.id === member?.fellowshipId)?.name ?? "None"
  const name = member ? `${member.firstName} ${member.lastName}` : ""
  const initials = member ? `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}` : ""

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-full flex flex-col p-0">
        {/* SheetTitle must always be rendered for accessibility */}
        {!member ? (
          <>
            <SheetHeader className="px-6 pt-6 pb-4">
              <SheetTitle className="sr-only">Member Details</SheetTitle>
              <SheetDescription className="sr-only">Loading member information</SheetDescription>
            </SheetHeader>
            <div className="flex items-center justify-center flex-1 text-muted-foreground">
              Loading…
            </div>
          </>
        ) : (
          <>
            {/* Profile Header */}
            <SheetHeader className="px-6 pt-6 pb-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 shrink-0">
                  <AvatarImage src={member.avatarUrl ?? undefined} alt={name} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-lg font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <SheetTitle className="text-xl leading-tight">{name}</SheetTitle>
                  <SheetDescription className="mt-1 flex flex-wrap gap-2">
                    <Badge className={statusColors[member.status] ?? "bg-secondary"}>
                      {member.status}
                    </Badge>
                    <Badge variant="outline" className={activityColors[member.activityStatus]}>
                      {member.activityStatus}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {member.memberType}
                    </Badge>
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <Separator />

            <ScrollArea className="flex-1 overflow-auto">
              {editing ? (
                <form id="edit-member-form" onSubmit={handleSave} className="px-6 py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="edit-firstName">First Name</FieldLabel>
                        <Input
                          id="edit-firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="edit-lastName">Last Name</FieldLabel>
                        <Input
                          id="edit-lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                        />
                      </Field>
                    </FieldGroup>
                  </div>

                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="edit-email">Email</FieldLabel>
                      <Input
                        id="edit-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </Field>
                  </FieldGroup>

                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="edit-phone">Phone</FieldLabel>
                      <Input
                        id="edit-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+254 700 000000"
                      />
                    </Field>
                  </FieldGroup>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Status</FieldLabel>
                        <Select
                          value={formData.status}
                          onValueChange={(v) => setFormData({ ...formData, status: v as MemberStatus })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="guest">Guest</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="leader">Leader</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Activity</FieldLabel>
                        <Select
                          value={formData.activityStatus}
                          onValueChange={(v) => setFormData({ ...formData, activityStatus: v as ActivityStatus })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </FieldGroup>
                  </div>

                  <FieldGroup>
                    <Field>
                      <FieldLabel>Type</FieldLabel>
                      <Select
                        value={formData.memberType}
                        onValueChange={(v) => setFormData({ ...formData, memberType: v as MemberType })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adult">Adult</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>

                  <FieldGroup>
                    <Field>
                      <FieldLabel>Fellowship</FieldLabel>
                      <Select
                        value={formData.fellowshipId || "none"}
                        onValueChange={(v) => setFormData({ ...formData, fellowshipId: v === "none" ? "" : v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {fellowships.map((f) => (
                            <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>

                  <FieldGroup>
                    <Field>
                      <FieldLabel>Departments</FieldLabel>
                      <Popover open={deptPopoverOpen} onOpenChange={setDeptPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between font-normal min-h-9 h-auto"
                          >
                            {formData.departmentIds.length === 0 ? (
                              <span className="text-muted-foreground">None</span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {formData.departmentIds.map((id) => {
                                  const dept = departments.find((d) => d.id === id)
                                  return dept ? (
                                    <Badge key={id} variant="secondary" className="text-xs">
                                      {dept.name}
                                    </Badge>
                                  ) : null
                                })}
                              </div>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search departments…" />
                            <CommandList>
                              <CommandEmpty>No departments found.</CommandEmpty>
                              <CommandGroup>
                                {departments.map((dept) => {
                                  const selected = formData.departmentIds.includes(dept.id)
                                  return (
                                    <CommandItem
                                      key={dept.id}
                                      value={dept.name}
                                      onSelect={() => {
                                        setFormData({
                                          ...formData,
                                          departmentIds: selected
                                            ? formData.departmentIds.filter((id) => id !== dept.id)
                                            : [...formData.departmentIds, dept.id],
                                        })
                                      }}
                                    >
                                      <Check className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")} />
                                      {dept.name}
                                    </CommandItem>
                                  )
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </Field>
                  </FieldGroup>

                  {submitError && (
                    <p className="text-sm text-destructive">{submitError}</p>
                  )}
                </form>
              ) : (
                <div className="px-6 py-4 space-y-5">
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Contact
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{member.phone ?? <span className="text-muted-foreground">No phone</span>}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="break-all">{member.email ?? <span className="text-muted-foreground">No email</span>}</span>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Church Details
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{fellowshipName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>
                          {memberDepartments.length > 0
                            ? memberDepartments.map((d) => d.name).join(", ")
                            : <span className="text-muted-foreground">No department</span>}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>
                          Joined{" "}
                          {new Date(member.joinedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </ScrollArea>

            <Separator />

            {/* Footer Actions */}
            <div className="px-6 py-4 flex items-center justify-between gap-2">
              {editing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditing(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    form="edit-member-form"
                    disabled={submitting}
                  >
                    {submitting ? "Saving…" : "Save Changes"}
                  </Button>
                </>
              ) : (
                <>
                  {confirmDelete ? (
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-sm text-muted-foreground flex-1">Remove this member?</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDelete(false)}
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={submitting}
                      >
                        {submitting ? "Removing…" : "Yes, remove"}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setConfirmDelete(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Remove
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setEditing(true)}
                      >
                        <Pencil className="h-4 w-4 mr-1.5" />
                        Edit Details
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
