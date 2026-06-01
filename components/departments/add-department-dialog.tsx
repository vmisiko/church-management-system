"use client"

import { useEffect, useRef, useState } from "react"
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
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDepartmentsPloc, useMembersPloc } from "@/core/di/DependencyLocator"
import useDepartmentsState from "@/application/department/useDepartmentsState"
import useMembersState from "@/application/member/useMembersState"
import type { Department } from "@/domain/entities/department/Department"

interface AddDepartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  department?: Department
}

const emptyForm = {
  name: "",
  description: "",
  headId: "",
  memberTarget: "",
  annualBudget: "",
}

export function AddDepartmentDialog({ open, onOpenChange, department }: AddDepartmentDialogProps) {
  const ploc = useDepartmentsPloc()
  const membersPloc = useMembersPloc()

  const submitting = useDepartmentsState((s) => s.submitting)
  const error = useDepartmentsState((s) => s.error)
  const members = useMembersState((s) => Array.isArray(s.members) ? s.members : [])

  const isEditing = Boolean(department)
  const [form, setForm] = useState(emptyForm)
  const [headOpen, setHeadOpen] = useState(false)

  useEffect(() => {
    membersPloc.fetchAll()
  }, [membersPloc])

  useEffect(() => {
    if (open) {
      setForm(
        department
          ? {
              name: department.name,
              description: department.description ?? "",
              headId: department.headId ?? "",
              memberTarget: department.memberTarget ? String(department.memberTarget) : "",
              annualBudget: department.annualBudget ? String(department.annualBudget) : "",
            }
          : emptyForm,
      )
    }
  }, [open, department])

  const selectedHead = members.find((m) => m.id === form.headId)
  const headLabel = selectedHead
    ? `${selectedHead.firstName} ${selectedHead.lastName}`
    : "Search member…"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      description: form.description || undefined,
      headId: form.headId || undefined,
      memberTarget: form.memberTarget ? Number(form.memberTarget) : undefined,
      annualBudget: form.annualBudget ? Number(form.annualBudget) : undefined,
    }
    const ok = isEditing && department
      ? await ploc.update(department.id, payload)
      : await ploc.create(payload)
    if (ok) onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Department" : "Add New Department"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details for this ministry department."
              : "Create a new ministry department for your church."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="dept-name">Department Name</FieldLabel>
                <Input
                  id="dept-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Evangelism"
                  required
                />
              </Field>
            </FieldGroup>

            {/* Department Head — searchable member select */}
            <FieldGroup>
              <Field>
                <FieldLabel>Department Head</FieldLabel>
                <Popover open={headOpen} onOpenChange={setHeadOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={headOpen}
                      className="w-full justify-between font-normal"
                    >
                      <span className={cn("truncate", !selectedHead && "text-muted-foreground")}>
                        {headLabel}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search by name…" />
                      <CommandList>
                        <CommandEmpty>No member found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="none"
                            onSelect={() => {
                              setForm({ ...form, headId: "" })
                              setHeadOpen(false)
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", !form.headId ? "opacity-100" : "opacity-0")} />
                            None
                          </CommandItem>
                          {members.map((m) => {
                            const fullName = `${m.firstName} ${m.lastName}`
                            return (
                              <CommandItem
                                key={m.id}
                                value={fullName}
                                onSelect={() => {
                                  setForm({ ...form, headId: m.id })
                                  setHeadOpen(false)
                                }}
                              >
                                <Check
                                  className={cn("mr-2 h-4 w-4", form.headId === m.id ? "opacity-100" : "opacity-0")}
                                />
                                {fullName}
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

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="member-target">Member Target</FieldLabel>
                  <Input
                    id="member-target"
                    type="number"
                    min={0}
                    value={form.memberTarget}
                    onChange={(e) => setForm({ ...form, memberTarget: e.target.value })}
                    placeholder="50"
                  />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="annual-budget">Annual Budget (KES)</FieldLabel>
                  <Input
                    id="annual-budget"
                    type="number"
                    min={0}
                    value={form.annualBudget}
                    onChange={(e) => setForm({ ...form, annualBudget: e.target.value })}
                    placeholder="250000"
                  />
                </Field>
              </FieldGroup>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="dept-desc">Description</FieldLabel>
                <Textarea
                  id="dept-desc"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the department's purpose…"
                  rows={3}
                />
              </Field>
            </FieldGroup>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !form.name.trim()}>
              {submitting ? "Saving…" : isEditing ? "Save Changes" : "Create Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
