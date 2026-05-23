"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { PeopleFilters } from "@/components/people/people-filters"
import { PeopleTable } from "@/components/people/people-table"
import { AddMemberDialog } from "@/components/people/add-member-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { defaultPeopleFilters, type PeopleFilterState } from "@/lib/people-filters"

export default function PeoplePage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filters, setFilters] = useState<PeopleFilterState>(defaultPeopleFilters)

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold">People Management</h1>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <PeopleFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Table */}
          <div className="flex-1 min-w-0">
            <PeopleTable filters={filters} />
          </div>
        </div>

        {/* Add Member Dialog */}
        <AddMemberDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      </div>
    </AppShell>
  )
}
