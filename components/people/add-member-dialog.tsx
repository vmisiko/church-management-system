"use client"

import { useEffect, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import useFellowshipsState from "@/application/fellowship/useFellowshipsState"
import useDepartmentsState from "@/application/department/useDepartmentsState"
import useMembersState from "@/application/member/useMembersState"
import {
  useFellowshipsPloc,
  useDepartmentsPloc,
  useMembersPloc,
} from "@/core/di/DependencyLocator"
import type { MemberStatus, MemberType, ActivityStatus } from "@/domain/entities/member/Member"

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultFellowshipId?: string
}

const emptyFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  status: "member" as MemberStatus,
  memberType: "adult" as MemberType,
  activityStatus: "active" as ActivityStatus,
  fellowshipId: "",
  departmentId: "",
  address: "",
  notes: "",
}

export function AddMemberDialog({ open, onOpenChange, defaultFellowshipId }: AddMemberDialogProps) {
  const membersPloc = useMembersPloc()
  const fellowshipsPloc = useFellowshipsPloc()
  const departmentsPloc = useDepartmentsPloc()

  const fellowships = useFellowshipsState((s) => Array.isArray(s.fellowships) ? s.fellowships : [])
  const departments = useDepartmentsState((s) => Array.isArray(s.departments) ? s.departments : [])
  const submitting = useMembersState((s) => s.submitting)
  const submitError = useMembersState((s) => s.error)

  const [formData, setFormData] = useState({ ...emptyFormData })

  useEffect(() => {
    fellowshipsPloc.fetchAll()
    departmentsPloc.fetchAll()
  }, [fellowshipsPloc, departmentsPloc])

  useEffect(() => {
    if (open) {
      setFormData({ ...emptyFormData, fellowshipId: defaultFellowshipId ?? "" })
    }
  }, [open, defaultFellowshipId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await membersPloc.create({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      status: formData.status,
      memberType: formData.memberType,
      activityStatus: formData.activityStatus,
      fellowshipId: formData.fellowshipId || undefined,
    })
    const error = useMembersState.getState().error
    if (!error) {
      if (formData.departmentId) {
        const newMember = useMembersState.getState().members[0]
        if (newMember) await membersPloc.assignDepartment(newMember.id, formData.departmentId)
      }
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Enter the details of the new congregation member below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
                    required
                  />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                    required
                  />
                </Field>
              </FieldGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 700 000000"
                  />
                </Field>
              </FieldGroup>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v as MemberStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
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
                  <FieldLabel>Type</FieldLabel>
                  <Select
                    value={formData.memberType}
                    onValueChange={(v) => setFormData({ ...formData, memberType: v as MemberType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
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
                  <FieldLabel>Activity</FieldLabel>
                  <Select
                    value={formData.activityStatus}
                    onValueChange={(v) => setFormData({ ...formData, activityStatus: v as ActivityStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Fellowship</FieldLabel>
                  <Select
                    value={formData.fellowshipId}
                    onValueChange={(v) => setFormData({ ...formData, fellowshipId: v === "none" ? "" : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fellowship" />
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
                  <FieldLabel>Department</FieldLabel>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(v) => setFormData({ ...formData, departmentId: v === "none" ? "" : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="notes">Notes</FieldLabel>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes about the member..."
                  rows={3}
                />
              </Field>
            </FieldGroup>

            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding…" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
