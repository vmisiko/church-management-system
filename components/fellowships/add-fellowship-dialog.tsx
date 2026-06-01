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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import type { Fellowship } from "@/domain/entities/fellowship/Fellowship"
import useFellowshipZonesState from "@/application/fellowship-zone/useFellowshipZonesState"
import { useFellowshipsPloc } from "@/core/di/DependencyLocator"

interface AddFellowshipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fellowship?: Fellowship
}

const emptyFormData = {
  name: "",
  zoneId: "",
  meetingDay: "",
  meetingTime: "",
  location: "",
  description: "",
  status: "active",
}

export function AddFellowshipDialog({
  open,
  onOpenChange,
  fellowship,
}: AddFellowshipDialogProps) {
  const ploc = useFellowshipsPloc()
  const { fellowshipZones } = useFellowshipZonesState()
  const isEditing = Boolean(fellowship)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState(emptyFormData)

  useEffect(() => {
    if (open) {
      setFormData(fellowship
        ? { name: fellowship.name, zoneId: fellowship.zoneId, meetingDay: fellowship.meetingDay, meetingTime: fellowship.meetingTime, location: fellowship.location, description: fellowship.description ?? "", status: fellowship.status }
        : emptyFormData
      )
    }
  }, [open, fellowship])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    if (isEditing && fellowship) {
      await ploc.update(fellowship.id, { ...formData, status: formData.status as 'active' | 'inactive' })
    } else {
      await ploc.create({ ...formData, status: formData.status as 'active' | 'inactive' })
    }
    setSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Fellowship" : "Create New Fellowship"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details for this fellowship group."
              : "Set up a new fellowship group for your congregation."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Fellowship Name</FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Kawangware Fellowship"
                />
              </Field>
            </FieldGroup>

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Zone</FieldLabel>
                  <Select
                    value={formData.zoneId}
                    onValueChange={(value) => setFormData({ ...formData, zoneId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {fellowshipZones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
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
                  <FieldLabel>Meeting Day</FieldLabel>
                  <Select
                    value={formData.meetingDay}
                    onValueChange={(value) => setFormData({ ...formData, meetingDay: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="time">Meeting Time</FieldLabel>
                  <Input
                    id="time"
                    type="time"
                    value={formData.meetingTime}
                    onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                  />
                </Field>
              </FieldGroup>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="location">Meeting Location</FieldLabel>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Address or venue name"
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="description">About This Fellowship</FieldLabel>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this fellowship..."
                  rows={3}
                />
              </Field>
            </FieldGroup>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>{isEditing ? "Save Changes" : "Create Fellowship"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
