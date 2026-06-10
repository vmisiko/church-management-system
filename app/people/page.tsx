"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { PeopleFilters } from "@/components/people/people-filters"
import { PeopleTable } from "@/components/people/people-table"
import { AddMemberDialog } from "@/components/people/add-member-dialog"
import { MemberDetailDrawer } from "@/components/people/member-detail-drawer"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import { BulkUploadDialog } from "@/components/people/bulk-upload-dialog"
import { defaultPeopleFilters, type PeopleFilterState } from "@/lib/people-filters"

function PeoplePageContent() {
  const searchParams = useSearchParams()

  const getInitialFilters = (): PeopleFilterState => {
    const fellowshipId = searchParams.get("fellowshipId")
    const departmentId = searchParams.get("departmentId")

    if (fellowshipId) {
      return { ...defaultPeopleFilters, fellowship: fellowshipId, inFellowship: true }
    }
    if (departmentId) {
      return { ...defaultPeopleFilters, department: departmentId }
    }
    return defaultPeopleFilters
  }

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false)
  const [filters, setFilters] = useState<PeopleFilterState>(getInitialFilters)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleMemberClick = (memberId: string) => {
    setSelectedMemberId(memberId)
    setIsDrawerOpen(true)
  }

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold">People Management</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <PeopleFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Table */}
          <div className="flex-1 min-w-0">
            <PeopleTable filters={filters} onMemberClick={handleMemberClick} />
          </div>
        </div>

        {/* Add Member Dialog */}
        <AddMemberDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

        {/* Bulk Upload Dialog */}
        <BulkUploadDialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen} />

        {/* Member Detail Drawer */}
        <MemberDetailDrawer
          memberId={selectedMemberId}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
      </div>
    </AppShell>
  )
}

export default function PeoplePage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="p-6 flex items-center justify-center">
            <div className="text-muted-foreground">Loading…</div>
          </div>
        </AppShell>
      }
    >
      <PeoplePageContent />
    </Suspense>
  )
}
