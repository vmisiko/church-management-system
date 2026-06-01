"use client"

import { useState, useEffect } from "react"
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
import useFellowshipsState from "@/application/fellowship/useFellowshipsState"
import useFellowshipZonesState from "@/application/fellowship-zone/useFellowshipZonesState"
import { useFellowshipsPloc, useFellowshipZonesPloc } from "@/core/di/DependencyLocator"
import type { Fellowship } from "@/domain/entities/fellowship/Fellowship"

export default function FellowshipsPage() {
  const fellowshipsPloc = useFellowshipsPloc()
  const zonesPloc = useFellowshipZonesPloc()
  const { fellowships, loading } = useFellowshipsState()
  const { fellowshipZones } = useFellowshipZonesState()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingFellowship, setEditingFellowship] = useState<Fellowship | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [zoneFilter, setZoneFilter] = useState("all")

  useEffect(() => {
    fellowshipsPloc.fetchAll()
    zonesPloc.fetchAll()
  }, [fellowshipsPloc, zonesPloc])

  const zoneNameMap = Object.fromEntries(fellowshipZones.map((z) => [z.id, z.name]))

  const filteredFellowships = fellowships.filter((f) => {
    const zoneName = zoneNameMap[f.zoneId] ?? ""
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesZone = zoneFilter === "all" || f.zoneId === zoneFilter
    return matchesSearch && matchesZone
  })

  const zones = fellowshipZones

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
                <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg bg-primary/10 p-4">
            <p className="text-2xl font-bold text-primary">{fellowships.length}</p>
            <p className="text-sm text-muted-foreground">Total Fellowships</p>
          </div>
          <div className="rounded-lg bg-accent/20 p-4">
            <p className="text-2xl font-bold text-accent-foreground">{zones.length}</p>
            <p className="text-sm text-muted-foreground">Active Zones</p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-2xl font-bold">{fellowships.filter((f) => f.status === "active").length}</p>
            <p className="text-sm text-muted-foreground">Active Fellowships</p>
          </div>
        </div>

        {/* Fellowship Grid */}
        {loading && fellowships.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            : "flex flex-col gap-4"
          }>
            {filteredFellowships.map((fellowship) => (
              <FellowshipCard
                key={fellowship.id}
                fellowship={fellowship}
                zoneName={zoneNameMap[fellowship.zoneId] ?? "Unknown Zone"}
                viewMode={viewMode}
                onEdit={setEditingFellowship}
              />
            ))}
          </div>
        )}

        <AddFellowshipDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
        {editingFellowship && (
          <AddFellowshipDialog
            open={true}
            onOpenChange={(open) => !open && setEditingFellowship(null)}
            fellowship={editingFellowship}
          />
        )}
      </div>
    </AppShell>
  )
}
