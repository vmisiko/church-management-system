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
import {
  fellowshipToFormData,
  fellowshipZoneOptions,
  type FellowshipRecord,
} from "@/lib/fellowships"

interface AddFellowshipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fellowship?: FellowshipRecord
}

const emptyFormData = {
  name: "",
  zone: "",
  leader: "",
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
  const isEditing = Boolean(fellowship)
  const [formData, setFormData] = useState(emptyFormData)

  useEffect(() => {
    if (open) {
      setFormData(fellowship ? fellowshipToFormData(fellowship) : emptyFormData)
    }
  }, [open, fellowship])

  const resetForm = () => {
    setFormData(fellowship ? fellowshipToFormData(fellowship) : emptyFormData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(isEditing ? "Fellowship updated:" : "Fellowship created:", formData)
    onOpenChange(false)
    resetForm()
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
                    value={formData.zone}
                    onValueChange={(value) => setFormData({ ...formData, zone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {fellowshipZoneOptions.map((zone) => (
                        <SelectItem key={zone.value} value={zone.value}>
                          {zone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="leader">Fellowship Leader</FieldLabel>
                  <Input
                    id="leader"
                    value={formData.leader}
                    onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                    placeholder="Leader name"
                  />
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

            <div className="grid grid-cols-2 gap-4">
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Save Changes" : "Create Fellowship"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
