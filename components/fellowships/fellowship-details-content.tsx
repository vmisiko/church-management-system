"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { AddMemberDialog } from "@/components/people/add-member-dialog"
import { AddFellowshipDialog } from "@/components/fellowships/add-fellowship-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  MapPin,
  MessageSquare,
  MoreVertical,
  UserPlus,
  Users,
} from "lucide-react"
import type { Fellowship } from "@/domain/entities/fellowship/Fellowship"
import { fellowshipZoneColors } from "@/lib/fellowships"
import useFellowshipZonesState from "@/application/fellowship-zone/useFellowshipZonesState"
import useMembersState from "@/application/member/useMembersState"
import { useFellowshipZonesPloc, useMembersPloc } from "@/core/di/DependencyLocator"

interface FellowshipDetailsContentProps {
  fellowship: Fellowship
}

export function FellowshipDetailsContent({ fellowship }: FellowshipDetailsContentProps) {
  const fellowshipZonesPloc = useFellowshipZonesPloc()
  const membersPloc = useMembersPloc()

  const fellowshipZones = useFellowshipZonesState((s) => Array.isArray(s.fellowshipZones) ? s.fellowshipZones : [])
  const members = useMembersState((s) => Array.isArray(s.members) ? s.members : [])

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  useEffect(() => {
    fellowshipZonesPloc.fetchAll()
    membersPloc.fetchAll()
  }, [fellowshipZonesPloc, membersPloc])

  const zone = fellowshipZones.find((z) => z.id === fellowship.zoneId)
  const zoneName = zone?.name ?? "—"
  const zoneColor = fellowshipZoneColors[zoneName] ?? "bg-secondary text-secondary-foreground"

  const leader = fellowship.leaderId ? members.find((m) => m.id === fellowship.leaderId) : null
  const leaderName = leader
    ? `${leader.firstName} ${leader.lastName}`
    : fellowship.leaderId
    ? "Loading…"
    : "Not assigned"

  const initials = fellowship.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <AppShell>
      <div className="p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/fellowships">Fellowships</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{fellowship.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2 gap-2" asChild>
            <Link href="/fellowships">
              <ArrowLeft className="h-4 w-4" />
              Back to Fellowships
            </Link>
          </Button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{fellowship.name}</h1>
                  <Badge className={zoneColor}>{zoneName}</Badge>
                  <Badge
                    variant="outline"
                    className={
                      fellowship.status === "active"
                        ? "border-success text-success"
                        : "border-muted-foreground text-muted-foreground"
                    }
                  >
                    {fellowship.status}
                  </Badge>
                </div>
                {fellowship.description && (
                  <p className="text-muted-foreground max-w-2xl">{fellowship.description}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button className="gap-2" asChild>
                <Link href={`/messaging?fellowship=${fellowship.slug}`}>
                  <MessageSquare className="h-4 w-4" />
                  Send Message
                </Link>
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <Link href={`/people?fellowshipId=${fellowship.id}`}>
                  <Users className="h-4 w-4" />
                  View Members
                </Link>
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setIsAddMemberOpen(true)}>
                <UserPlus className="h-4 w-4" />
                Add Member
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setIsEditOpen(true)}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/attendance?fellowshipId=${fellowship.id}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      View Attendance
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{fellowship.memberCount}</p>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                  <Clock className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold capitalize">{fellowship.meetingDay}s at {fellowship.meetingTime}</p>
                  <p className="text-sm text-muted-foreground">{fellowship.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Fellowship Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Leader</p>
                    <p className="font-medium">{leaderName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zone</p>
                    <p className="font-medium">{zoneName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{fellowship.status}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Meeting Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Schedule</p>
                      <p className="font-medium capitalize">
                        {fellowship.meetingDay}s at {fellowship.meetingTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{fellowship.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {fellowship.description && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">About This Fellowship</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{fellowship.description}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="members">
            <Card className="border shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1">Fellowship members</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Members are managed in the People section, pre-filtered to this fellowship.
                  </p>
                </div>
                <Button asChild>
                  <Link href={`/people?fellowshipId=${fellowship.id}`}>
                    <Users className="h-4 w-4 mr-2" />
                    Open in People
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AddMemberDialog
          open={isAddMemberOpen}
          onOpenChange={setIsAddMemberOpen}
          defaultFellowshipId={fellowship.id}
        />
        <AddFellowshipDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          fellowship={fellowship}
        />
      </div>
    </AppShell>
  )
}
