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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Search, LayoutGrid, List, MapPin } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import useFellowshipsState from "@/application/fellowship/useFellowshipsState"
import useFellowshipZonesState from "@/application/fellowship-zone/useFellowshipZonesState"
import { useFellowshipsPloc, useFellowshipZonesPloc } from "@/core/di/DependencyLocator"
import type { Fellowship } from "@/domain/entities/fellowship/Fellowship"
import { AddZoneDialog } from "@/components/fellowships/add-zone-dialog"

export default function FellowshipsPage() {
  const fellowshipsPloc = useFellowshipsPloc()
  const zonesPloc = useFellowshipZonesPloc()
  const fellowships = useFellowshipsState((s) => Array.isArray(s.fellowships) ? s.fellowships : [])
  const loading = useFellowshipsState((s) => s.loading)
  const fellowshipZones = useFellowshipZonesState((s) => Array.isArray(s.fellowshipZones) ? s.fellowshipZones : [])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddZoneDialogOpen, setIsAddZoneDialogOpen] = useState(false)
  const [editingFellowship, setEditingFellowship] = useState<Fellowship | null>(null)
  const [deletingFellowship, setDeletingFellowship] = useState<Fellowship | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [zoneFilter, setZoneFilter] = useState("all")

  useEffect(() => {
    fellowshipsPloc.fetchAll()
    zonesPloc.fetchAll()
  }, [fellowshipsPloc, zonesPloc])

  const zoneNameMap = Object.fromEntries(fellowshipZones.map((z) => [z.id, z.name]))

  const filteredFellowships = fellowships.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesZone = zoneFilter === "all" || f.zoneId === zoneFilter
    return matchesSearch && matchesZone
  })

  const zones = fellowshipZones

  async function handleDeleteFellowship() {
    if (!deletingFellowship) return
    await fellowshipsPloc.delete(deletingFellowship.id)
    setDeletingFellowship(null)
  }

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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAddZoneDialogOpen(true)} className="gap-2">
              <MapPin className="h-4 w-4" />
              Add Zone
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Fellowship
            </Button>
          </div>
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
                onDelete={setDeletingFellowship}
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
        <AddZoneDialog open={isAddZoneDialogOpen} onOpenChange={setIsAddZoneDialogOpen} />

        <AlertDialog
          open={!!deletingFellowship}
          onOpenChange={(open) => !open && setDeletingFellowship(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Fellowship</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">{deletingFellowship?.name}</span>? This action
                cannot be undone and will remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDeleteFellowship}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  )
}
