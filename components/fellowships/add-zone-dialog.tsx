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
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { useFellowshipZonesPloc, useMembersPloc } from "@/core/di/DependencyLocator"
import useFellowshipZonesState from "@/application/fellowship-zone/useFellowshipZonesState"
import useMembersState from "@/application/member/useMembersState"
import type { FellowshipZone } from "@/domain/entities/fellowship-zone/FellowshipZone"

interface AddZoneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  zone?: FellowshipZone
}

export function AddZoneDialog({ open, onOpenChange, zone }: AddZoneDialogProps) {
  const ploc = useFellowshipZonesPloc()
  const membersPloc = useMembersPloc()
  const submitting = useFellowshipZonesState((s) => s.submitting)
  const error = useFellowshipZonesState((s) => s.error)
  const allMembers = useMembersState((s) => Array.isArray(s.members) ? s.members : [])
  const isEditing = Boolean(zone)
  const [name, setName] = useState("")
  const [overseerId, setOverseerId] = useState("")

  useEffect(() => {
    if (open) {
      setName(zone?.name ?? "")
      setOverseerId(zone?.overseerId ?? "")
      ploc.clearError()
      membersPloc.fetchAll()
    }
  }, [open, zone, ploc, membersPloc])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const result = isEditing && zone
      ? await ploc.update(zone.id, { name: name.trim(), overseerId: overseerId || null })
      : await ploc.create({ name: name.trim(), overseerId: overseerId || null })
    if (result.isRight()) onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Zone" : "Create New Zone"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the name of this fellowship zone."
              : "Add a new zone to group fellowships by area."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="zone-name">Zone Name</FieldLabel>
                <Input
                  id="zone-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Westlands Zone"
                  autoFocus
                />
              </Field>
            </FieldGroup>
            <FieldGroup className="mt-4">
              <Field>
                <FieldLabel>Overseer</FieldLabel>
                <Select value={overseerId || "none"} onValueChange={(v) => setOverseerId(v === "none" ? "" : v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No overseer assigned</SelectItem>
                    {allMembers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.firstName} {m.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? "Saving…" : isEditing ? "Save Changes" : "Create Zone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
