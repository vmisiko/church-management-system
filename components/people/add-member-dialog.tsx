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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { fellowshipSelectOptions } from "@/lib/fellowships"

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultFellowshipSlug?: string
}

const emptyFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  status: "",
  fellowship: "",
  department: "",
  address: "",
  notes: "",
}

export function AddMemberDialog({
  open,
  onOpenChange,
  defaultFellowshipSlug,
}: AddMemberDialogProps) {
  const [formData, setFormData] = useState(emptyFormData)

  useEffect(() => {
    if (open) {
      setFormData({
        ...emptyFormData,
        fellowship: defaultFellowshipSlug ?? "",
      })
    }
  }, [open, defaultFellowshipSlug])

  const resetForm = () => {
    setFormData({
      ...emptyFormData,
      fellowship: defaultFellowshipSlug ?? "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    onOpenChange(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Enter the details of the new congregation member below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
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
                  />
                </Field>
              </FieldGroup>
            </div>

            {/* Contact Row */}
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
                    placeholder="(555) 000-0000"
                  />
                </Field>
              </FieldGroup>
            </div>

            {/* Status Row */}
            <div className="grid grid-cols-3 gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
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
                  <FieldLabel>Fellowship</FieldLabel>
                  <Select
                    value={formData.fellowship}
                    onValueChange={(value) => setFormData({ ...formData, fellowship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fellowship" />
                    </SelectTrigger>
                    <SelectContent>
                      {fellowshipSelectOptions.map((fellowship) => (
                        <SelectItem key={fellowship.value} value={fellowship.value}>
                          {fellowship.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Department</FieldLabel>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="choir">Choir</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="ushers">Ushers</SelectItem>
                      <SelectItem value="children">Children</SelectItem>
                      <SelectItem value="youth">Youth</SelectItem>
                      <SelectItem value="welfare">Welfare</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </div>

            {/* Address */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter home address"
                />
              </Field>
            </FieldGroup>

            {/* Notes */}
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
