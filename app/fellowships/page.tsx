"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { FellowshipCard } from "@/components/fellowships/fellowship-card"
import { AddFellowshipDialog } from "@/components/fellowships/add-fellowship-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, LayoutGrid, List } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { mockFellowships, type FellowshipRecord } from "@/lib/fellowships"

export default function FellowshipsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingFellowship, setEditingFellowship] = useState<FellowshipRecord | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [zoneFilter, setZoneFilter] = useState("all")

  const filteredFellowships = mockFellowships.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.leader.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesZone = zoneFilter === "all" || f.zone === zoneFilter
    return matchesSearch && matchesZone
  })

  const zones = [...new Set(mockFellowships.map((f) => f.zone))]

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Fellowships</h1>
            <p className="text-muted-foreground">
              Manage fellowship groups across Nairobi road zones
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Fellowship
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search fellowships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={zoneFilter} onValueChange={setZoneFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {zones.map((zone) => (
                <SelectItem key={zone} value={zone}>{zone}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value as "grid" | "list")}
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg bg-primary/10 p-4">
            <p className="text-2xl font-bold text-primary">{mockFellowships.length}</p>
            <p className="text-sm text-muted-foreground">Total Fellowships</p>
          </div>
          <div className="rounded-lg bg-accent/20 p-4">
            <p className="text-2xl font-bold text-accent-foreground">{zones.length}</p>
            <p className="text-sm text-muted-foreground">Active Zones</p>
          </div>
          <div className="rounded-lg bg-success/20 p-4">
            <p className="text-2xl font-bold text-success">{mockFellowships.reduce((acc, f) => acc + f.members, 0).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Members</p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-2xl font-bold">{Math.round(mockFellowships.reduce((acc, f) => acc + f.members, 0) / mockFellowships.length)}</p>
            <p className="text-sm text-muted-foreground">Avg. per Fellowship</p>
          </div>
        </div>

        {/* Fellowship Grid */}
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
          : "flex flex-col gap-4"
        }>
          {filteredFellowships.map((fellowship) => (
            <FellowshipCard
              key={fellowship.id}
              fellowship={fellowship}
              viewMode={viewMode}
              onEdit={setEditingFellowship}
            />
          ))}
        </div>

        <AddFellowshipDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
        <AddFellowshipDialog
          open={Boolean(editingFellowship)}
          onOpenChange={(open) => !open && setEditingFellowship(null)}
          fellowship={editingFellowship ?? undefined}
        />
      </div>
    </AppShell>
  )
}
